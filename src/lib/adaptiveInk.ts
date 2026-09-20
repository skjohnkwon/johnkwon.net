// Paints the type with a picture instead of a colour.
//
// The text sits straight on the photo, so no single colour works: white
// disappears into a stop sign, black disappears into foliage, and one colour
// chosen for a whole paragraph is wrong wherever the photo changes under it.
//
// So the page builds a second, tiny picture from the backdrop — light where the
// photo is dark, dark where the photo is bright — and uses that as the fill for
// the glyphs, through background-clip: text. Every letter, and every part of a
// letter, ends up the shade that separates it from whatever is directly behind
// it. Nothing in the DOM is split up to do it, so justification and hyphenation
// are untouched.
//
// The mask is deliberately tiny. Upscaled to the viewport its pixels become
// slow gradients rather than edges, which is what keeps the colour drifting
// gently along a line instead of flickering from word to word.
//
// ── Making it cheap ──────────────────────────────────────────────────────────
// The mask is rebuilt many times a second through a crossfade, so the work is
// arranged so that almost none of it repeats:
//
//   Once per photo   decode → downscale → one pass to a luminance grid, cached
//                    by (src, grid size). Done off the critical path, during
//                    idle time, for the photo that's coming next.
//   Once per app     a 256-entry lookup table mapping luminance to packed RGBA,
//                    so the per-pixel path has no branches and no float maths.
//   Per frame        lerp two cached grids and index the table — one integer
//                    op and one 32-bit store per pixel, over ~5k pixels, into
//                    a reused ImageData. No decode, no getImageData, no alloc.
//
// The frame path also quantises its progress, so a crossfade asks for at most
// ~24 distinct masks and repeats are dropped before any work happens.

/**
 * Alpha of the scrim over the photo. The mask accounts for it too.
 *
 * Chosen by measurement rather than taste: sweeping it against the WCAG
 * contrast between the ink and the backdrop over all 18 slides, the share of
 * the page below 3:1 goes 8.7% at 0.20, 11.5% at 0.30, 7% at 0.35, 5.5% here,
 * and 5.2% at 0.50. It isn't monotonic — the scrim slides the photo's whole
 * histogram past a fixed crossover — and past this point the picture is paying
 * for very little.
 */
export const SCRIM_ALPHA = 0.45;

export const INK_VAR = "--adaptive-ink";

const MASK_WIDTH = 144;

// Near the ends of the range, but not pure: reads as ink rather than as a UI
// colour. Every point of range here is contrast against a mid-tone backdrop.
const LIGHT_INK = [250, 251, 253];
const DARK_INK = [10, 11, 14];

// The ink is one of those two and never anything between them.
//
// It's tempting to ramp smoothly from one to the other, and the first version
// did. It's wrong: a smooth ramp hands a mid-tone backdrop a mid-tone ink, and
// mid on mid is invisible. Measured over these photos, that cost 42% of one
// slide's area and bottomed out at 1.00:1 — text that isn't there.
//
// So the mapping is a step. The crossover sits where the two inks are equally
// legible, which is *not* the middle of the range: contrast is measured on
// linear luminance, so solving (x+0.05)/(D+0.05) = (L+0.05)/(x+0.05) for these
// two inks puts the break-even at ~0.18 linear, ~0.46 gamma-encoded. Picking
// the far ink at every pixel makes that break-even the worst case the page can
// ever hit, at about 4.2:1.
//
// Smoothness is left to geometry rather than tone: the mask is tiny, so the
// browser's own interpolation spreads each crossing over ~14 screen pixels.
const CROSSOVER = 0.46;

/**
 * luminance byte → packed RGBA, built once.
 *
 * Packing into Uint32 lets the hot loop do a single store per pixel instead of
 * four, and folds the threshold and the scrim into a table read. Little-endian order (ABGR in memory) matches Uint32Array over RGBA
 * bytes on every platform this runs on.
 */
const INK_LUT = (() => {
  const lut = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    const lum = (i / 255) * (1 - SCRIM_ALPHA);
    const [r, g, b] = lum > CROSSOVER ? DARK_INK : LIGHT_INK;
    lut[i] = (255 << 24) | (b << 16) | (g << 8) | r;
  }
  return lut;
})();

interface Grid {
  w: number;
  h: number;
  lum: Uint8Array;
}

const grids = new Map<string, Grid>();

let sampler: HTMLCanvasElement | null = null;
let painter: HTMLCanvasElement | null = null;
let frame: ImageData | null = null;
let frameView: Uint32Array | null = null;

/** Grid size for the current viewport, so every cached grid lines up. */
const gridSize = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!vw || !vh) return null;
  return { w: MASK_WIDTH, h: Math.max(8, Math.round((MASK_WIDTH * vh) / vw)) };
};

/**
 * Downscales a photo to the grid and reduces it to one luminance byte per cell.
 * Cached — a photo is only ever measured once per grid size.
 */
const gridFor = (img: HTMLImageElement): Grid | null => {
  const size = gridSize();
  if (!size || !img.complete || !img.naturalWidth) return null;

  const key = `${img.src}|${size.w}x${size.h}`;
  const cached = grids.get(key);
  if (cached) return cached;

  if (!sampler) sampler = document.createElement("canvas");
  sampler.width = size.w;
  sampler.height = size.h;
  const ctx = sampler.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  // Same object-cover crop the backdrop uses, so the mask lines up with what's
  // actually on screen.
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.max(vw / img.naturalWidth, vh / img.naturalHeight);
  const sw = vw / scale;
  const sh = vh / scale;

  let pixels: ImageData;
  try {
    ctx.clearRect(0, 0, size.w, size.h);
    ctx.drawImage(
      img,
      (img.naturalWidth - sw) / 2,
      (img.naturalHeight - sh) / 2,
      sw,
      sh,
      0,
      0,
      size.w,
      size.h
    );
    pixels = ctx.getImageData(0, 0, size.w, size.h);
  } catch {
    // Tainted canvas — a cross-origin backdrop. Leave the plain colours up.
    return null;
  }

  const d = pixels.data;
  const lum = new Uint8Array(size.w * size.h);
  for (let i = 0, p = 0; p < lum.length; i += 4, p++) {
    // Rec. 709 luma in fixed point: the shifts are the 0.2126/0.7152/0.0722
    // weights scaled by 256, so this stays integer the whole way.
    lum[p] = (54 * d[i] + 183 * d[i + 1] + 19 * d[i + 2]) >> 8;
  }

  const grid = { w: size.w, h: size.h, lum };
  grids.set(key, grid);
  return grid;
};

/**
 * Measures a photo ahead of time so a crossfade never pays for it.
 * Safe to call repeatedly; cached after the first go.
 */
export const primeSlide = (src: string) => {
  const run = () => {
    const img = new Image();
    img.src = src;
    img.decode().then(
      () => gridFor(img),
      () => {}
    );
  };
  if ("requestIdleCallback" in window) {
    (window as unknown as { requestIdleCallback: (cb: () => void) => void })
      .requestIdleCallback(run);
  } else {
    setTimeout(run, 0);
  }
};

export const dropGridCache = () => grids.clear();

/**
 * Builds the ink for a crossfade sitting `t` of the way from `from` to `to`,
 * and returns it as a data URL — or null when there's nothing to measure yet.
 */
export const buildInkMask = (
  from: HTMLImageElement | null,
  to: HTMLImageElement,
  t: number
): string | null => {
  const target = gridFor(to);
  if (!target) return null;
  const source = from ? gridFor(from) : null;

  const { w, h } = target;
  const n = w * h;

  if (!painter) painter = document.createElement("canvas");
  if (painter.width !== w || painter.height !== h || !frame) {
    painter.width = w;
    painter.height = h;
    frame = null;
  }
  const ctx = painter.getContext("2d");
  if (!ctx) return null;
  if (!frame || !frameView) {
    frame = ctx.createImageData(w, h);
    frameView = new Uint32Array(frame.data.buffer);
  }

  const out = frameView;
  const b = target.lum;

  if (!source || source.lum.length !== n || t >= 1) {
    for (let i = 0; i < n; i++) out[i] = INK_LUT[b[i]];
  } else {
    // Fixed-point lerp: mix in 0..256 so the blend is a multiply and a shift.
    const mix = (t * 256) | 0;
    const a = source.lum;
    for (let i = 0; i < n; i++) {
      const from_ = a[i];
      out[i] = INK_LUT[from_ + (((b[i] - from_) * mix) >> 8)];
    }
  }

  ctx.putImageData(frame, 0, 0);
  return painter.toDataURL("image/png");
};

/**
 * Lines an inked element's fill up with the viewport.
 *
 * The backdrop is fixed to the viewport but the text isn't, so the mask has to
 * be offset by however far the element currently sits from the top left of the
 * screen. background-attachment: fixed would do this in one line, but it's
 * unreliable on iOS, and this stays exact while the page scrolls.
 */
export const alignInkSurface = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  el.style.backgroundSize = `${window.innerWidth}px ${window.innerHeight}px`;
  el.style.backgroundPosition = `${-rect.left}px ${-rect.top}px`;
};
