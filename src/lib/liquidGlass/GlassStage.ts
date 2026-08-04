// Owns the glass layers and the one downscaled copy of the backdrop they share.
//
// Two layers, because a canvas occupies a single position in the stacking order:
//   content — z-5, under the page's own text
//   overlay — z-40, above the page but under the fixed nav's text
// Without the second one, a full-height content panel's text paints straight
// over the nav pill's glass while the nav's own text still floats on top of it.

import { GlassRenderer, type GlassOptions } from "./GlassRenderer";

export type GlassLayer = "content" | "overlay";

export const LAYER_Z: Record<GlassLayer, number> = {
  content: 5,
  overlay: 40,
};

// The backdrop only has to survive being blurred and refracted, so it is sampled
// well below screen resolution — and once, for every layer.
const MAX_TEXTURE_WIDTH = 1280;

export class GlassStage {
  readonly layers: Record<GlassLayer, GlassRenderer>;

  private backdrop: HTMLCanvasElement | null = null;
  private sample = document.createElement("canvas");
  private sampleCssWidth = 1;

  constructor() {
    this.layers = {
      content: new GlassRenderer(),
      overlay: new GlassRenderer(),
    };
  }

  private get all() {
    return Object.values(this.layers);
  }

  get supported() {
    return this.all.every((renderer) => renderer.supported);
  }

  setBackdrop(canvas: HTMLCanvasElement | null) {
    this.backdrop = canvas;
    this.refresh();
  }

  /** Call when the backdrop has been repainted (slide change, crossfade tick). */
  refresh() {
    if (!this.backdrop || this.backdrop.width === 0) {
      this.all.forEach((renderer) => renderer.setSource(null, 1));
      return;
    }

    const scale = Math.min(1, MAX_TEXTURE_WIDTH / this.backdrop.width);
    const width = Math.max(1, Math.round(this.backdrop.width * scale));
    const height = Math.max(1, Math.round(this.backdrop.height * scale));
    if (this.sample.width !== width || this.sample.height !== height) {
      this.sample.width = width;
      this.sample.height = height;
    }

    const ctx = this.sample.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(this.backdrop, 0, 0, width, height);
    this.sampleCssWidth = window.innerWidth;

    this.all.forEach((renderer) =>
      renderer.setSource(this.sample, this.sampleCssWidth)
    );
  }

  setTint(top: number[], bottom: number[]) {
    this.all.forEach((renderer) => renderer.setTint(top, bottom));
  }

  requestRender() {
    this.all.forEach((renderer) => renderer.requestRender());
  }

  register(layer: GlassLayer, element: HTMLElement, options: GlassOptions) {
    return this.layers[layer].register(element, options);
  }

  destroy() {
    this.all.forEach((renderer) => {
      renderer.destroy();
      renderer.canvas.remove();
    });
  }
}
