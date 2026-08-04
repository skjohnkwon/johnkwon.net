// One WebGL canvas draws every glass panel that shares a z-layer.
//
// liquid-glass-js gives each panel its own canvas and its own GL context, which
// is fine for a demo with three buttons and not fine here: browsers cap live
// contexts around 16, and every context would upload its own copy of the same
// backdrop. Instead there is one viewport-sized canvas per layer, and each
// registered panel is a single draw call into its own gl.viewport rectangle.
//
// Layers exist because a canvas is one element in the stacking order: glass
// drawn at z-5 sits under every panel's text at z-10, including the text of
// panels it is supposed to cover. The fixed nav therefore needs its own canvas
// above the content. See GlassStage.

import { FRAGMENT_SHADER, VERTEX_SHADER } from "./shader";

export interface GlassOptions {
  // "pill" resolves to half the measured height at draw time, which is the only
  // way the shader's pill branch can recognise the shape.
  borderRadius: number | "pill";
  tintOpacity: number;
  warp: boolean;
}

interface Panel extends GlassOptions {
  element: HTMLElement;
}

// Glass is soft by nature; the only crisp part is the rim, and 1 CSS px holds up.
const GLASS_SCALE = 1;

// Upstream's defaults describe frosted glass: a wide blur and a soft edge. These
// lean the other way — a thinner blur you can see through, a wider and stronger
// band of refraction at the border so the pane reads as having thickness, and a
// lit rim. Less ripple, because the wobble reads as plastic at panel size.
const UNIFORM_DEFAULTS = {
  blurRadius: 3.2, // upstream 5.0
  edgeIntensity: 0.022, // upstream 0.01
  rimIntensity: 0.07, // upstream 0.05
  baseIntensity: 0.012,
  edgeDistance: 0.09, // upstream 0.15 — lower means a wider refracted border
  rimDistance: 0.8,
  baseDistance: 0.1,
  cornerBoost: 0.035, // upstream 0.02
  rippleEffect: 0.05, // upstream 0.1
  specular: 0.3,
  chromatic: 0.35,
  latitude: 0.26,
};

const compile = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("glass shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

export class GlassRenderer {
  readonly canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private uniforms: Record<string, WebGLUniformLocation | null> = {};
  private texture: WebGLTexture | null = null;

  private panels = new Set<Panel>();
  // Downscaled copy of the backdrop, owned and shared by the stage.
  private source: HTMLCanvasElement | null = null;
  private sourceCssWidth = 1;
  private frame = 0;
  private textureDirty = true;
  private tint: [number[], number[]] = [
    [1, 1, 1],
    [0.85, 0.85, 0.85],
  ];

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("aria-hidden", "true");
    this.gl = this.canvas.getContext("webgl", {
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
    });
    if (this.gl) this.setup(this.gl);

    this.canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      this.program = null;
    });
    this.canvas.addEventListener("webglcontextrestored", () => {
      const gl = this.canvas.getContext("webgl") as WebGLRenderingContext | null;
      if (!gl) return;
      this.gl = gl;
      this.setup(gl);
      this.textureDirty = true;
      this.requestRender();
    });
  }

  get supported() {
    return Boolean(this.gl && this.program);
  }

  private setup(gl: WebGLRenderingContext) {
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("glass program:", gl.getProgramInfoLog(program));
      return;
    }
    this.program = program;
    gl.useProgram(program);

    // One static quad; each panel gets it through a different gl.viewport.
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const texcoords = new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]);

    const positionLoc = gl.getAttribLocation(program, "a_position");
    const texcoordLoc = gl.getAttribLocation(program, "a_texcoord");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texcoords, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texcoordLoc);
    gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);

    for (const name of [
      "u_image",
      "u_resolution",
      "u_textureSize",
      "u_containerPosition",
      "u_containerSizeCss",
      "u_texScale",
      "u_blurRadius",
      "u_borderRadius",
      "u_warp",
      "u_edgeIntensity",
      "u_rimIntensity",
      "u_baseIntensity",
      "u_edgeDistance",
      "u_rimDistance",
      "u_baseDistance",
      "u_cornerBoost",
      "u_rippleEffect",
      "u_tintOpacity",
      "u_tintTop",
      "u_tintBottom",
      "u_specular",
      "u_chromatic",
      "u_latitude",
    ]) {
      this.uniforms[name] = gl.getUniformLocation(program, name);
    }

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(this.uniforms.u_image, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    gl.uniform1f(this.uniforms.u_blurRadius, UNIFORM_DEFAULTS.blurRadius);
    gl.uniform1f(this.uniforms.u_edgeIntensity, UNIFORM_DEFAULTS.edgeIntensity);
    gl.uniform1f(this.uniforms.u_rimIntensity, UNIFORM_DEFAULTS.rimIntensity);
    gl.uniform1f(this.uniforms.u_baseIntensity, UNIFORM_DEFAULTS.baseIntensity);
    gl.uniform1f(this.uniforms.u_edgeDistance, UNIFORM_DEFAULTS.edgeDistance);
    gl.uniform1f(this.uniforms.u_rimDistance, UNIFORM_DEFAULTS.rimDistance);
    gl.uniform1f(this.uniforms.u_baseDistance, UNIFORM_DEFAULTS.baseDistance);
    gl.uniform1f(this.uniforms.u_cornerBoost, UNIFORM_DEFAULTS.cornerBoost);
    gl.uniform1f(this.uniforms.u_rippleEffect, UNIFORM_DEFAULTS.rippleEffect);
    gl.uniform1f(this.uniforms.u_specular, UNIFORM_DEFAULTS.specular);
    gl.uniform1f(this.uniforms.u_chromatic, UNIFORM_DEFAULTS.chromatic);
    gl.uniform1f(this.uniforms.u_latitude, UNIFORM_DEFAULTS.latitude);
  }

  /**
   * @param source     the stage's downscaled copy of the backdrop
   * @param cssWidth   viewport width the source represents, for texScale
   */
  setSource(source: HTMLCanvasElement | null, cssWidth: number) {
    this.source = source;
    this.sourceCssWidth = Math.max(1, cssWidth);
    this.markSourceDirty();
  }

  /** Call when the backdrop has been repainted (slide change, crossfade tick). */
  markSourceDirty() {
    this.textureDirty = true;
    this.requestRender();
  }

  setTint(top: number[], bottom: number[]) {
    this.tint = [top, bottom];
    this.requestRender();
  }

  register(element: HTMLElement, options: GlassOptions) {
    const panel: Panel = { element, ...options };
    this.panels.add(panel);
    this.requestRender();
    return {
      update: (next: GlassOptions) => {
        Object.assign(panel, next);
        this.requestRender();
      },
      unregister: () => {
        this.panels.delete(panel);
        this.requestRender();
      },
    };
  }

  requestRender() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.render();
    });
  }

  private uploadTexture(gl: WebGLRenderingContext) {
    if (!this.source || this.source.width === 0) return false;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.source
    );
    this.textureDirty = false;
    return true;
  }

  render() {
    const gl = this.gl;
    if (!gl || !this.program || !this.source) return;

    const cssWidth = window.innerWidth;
    const cssHeight = window.innerHeight;
    const width = Math.round(cssWidth * GLASS_SCALE);
    const height = Math.round(cssHeight * GLASS_SCALE);

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }

    if (this.textureDirty && !this.uploadTexture(gl)) return;

    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Backdrop texture pixels per CSS pixel, so the shader can map a panel's
    // viewport rectangle onto the downscaled sample texture.
    const texScale = this.source.width / this.sourceCssWidth;
    gl.uniform2f(
      this.uniforms.u_textureSize,
      this.source.width,
      this.source.height
    );
    gl.uniform1f(this.uniforms.u_texScale, texScale);
    gl.uniform3fv(this.uniforms.u_tintTop, this.tint[0]);
    gl.uniform3fv(this.uniforms.u_tintBottom, this.tint[1]);

    for (const panel of this.panels) {
      const rect = panel.element.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) continue;
      if (rect.bottom < 0 || rect.top > cssHeight) continue;

      const w = Math.round(rect.width * GLASS_SCALE);
      const h = Math.round(rect.height * GLASS_SCALE);
      const x = Math.round(rect.left * GLASS_SCALE);
      // GL's origin is bottom-left; the DOM's is top-left.
      const y = height - Math.round(rect.top * GLASS_SCALE) - h;

      gl.viewport(x, y, w, h);
      gl.uniform2f(this.uniforms.u_resolution, w, h);
      gl.uniform2f(
        this.uniforms.u_containerPosition,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
      gl.uniform2f(this.uniforms.u_containerSizeCss, rect.width, rect.height);
      gl.uniform1f(
        this.uniforms.u_borderRadius,
        panel.borderRadius === "pill"
          ? h / 2
          : Math.min(panel.borderRadius * GLASS_SCALE, Math.min(w, h) / 2)
      );
      gl.uniform1f(this.uniforms.u_tintOpacity, panel.tintOpacity);
      gl.uniform1f(this.uniforms.u_warp, panel.warp ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

  destroy() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.panels.clear();
  }
}
