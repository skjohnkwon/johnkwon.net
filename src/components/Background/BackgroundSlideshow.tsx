import React, { useEffect, useRef } from "react";
import { useGlass } from "@/components/Glass/Glass";
import type { GlassStage } from "@/lib/liquidGlass/GlassStage";

// Every .webp in assets/bg is a slide. Dropping a new scan in there is the whole
// workflow — no list to keep in sync.
const modules = import.meta.glob<string>("../../assets/bg/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});
const slides = Object.keys(modules)
  .sort()
  .map((path) => modules[path]);

const HOLD_MS = 7000;
const FADE_MS = 2500;
// The glass resamples the backdrop whenever it changes; during a crossfade that
// would mean a full texture upload every frame for no visible gain.
const GLASS_REFRESH_MS = 60;

// Slides are composited through half-size buffers. Scaling those back up is
// most of the blur and costs nothing, so the gaussian on top can be modest —
// and it means the expensive filtered draw happens once per slide rather than
// once per crossfade frame.
const BUFFER_SCALE = 0.5;
const BLUR_CSS_PX = 18;
const DIM = 0.24;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The photos are painted to a canvas rather than <img> tags because the glass
 * panels need something they can sample as a texture. This canvas is both the
 * thing you see and the thing they refract, so the blur and the dim below apply
 * to both — the panels refract the same soft image that's on screen.
 */
const BackgroundSlideshow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { stage } = useGlass();
  const stageRef = useRef<GlassStage | null>(null);

  useEffect(() => {
    stageRef.current = stage;
    stage?.setBackdrop(canvasRef.current);
    return () => stage?.setBackdrop(null);
  }, [stage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || slides.length === 0) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let index = Math.floor(Math.random() * slides.length);
    let currentImage: HTMLImageElement | null = null;
    let front = 0;
    let outgoing: HTMLCanvasElement | null = null;
    let fadeStart = 0;
    let frame = 0;
    let lastGlassRefresh = 0;

    const buffers = [
      document.createElement("canvas"),
      document.createElement("canvas"),
    ];

    const cache = new Map<number, HTMLImageElement>();
    const load = (i: number) => {
      let img = cache.get(i);
      if (!img) {
        img = new Image();
        img.src = slides[i];
        cache.set(i, img);
      }
      return img;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(window.innerWidth * dpr);
      const height = Math.round(window.innerHeight * dpr);
      if (canvas.width === width && canvas.height === height) return false;
      canvas.width = width;
      canvas.height = height;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      for (const buffer of buffers) {
        buffer.width = Math.max(1, Math.round(width * BUFFER_SCALE));
        buffer.height = Math.max(1, Math.round(height * BUFFER_SCALE));
      }
      return true;
    };

    /** Cover-fit one slide into a buffer, blurred, at buffer resolution. */
    const renderSlide = (img: HTMLImageElement, buffer: HTMLCanvasElement) => {
      const bctx = buffer.getContext("2d");
      if (!bctx || !img.complete || img.naturalWidth === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const blur = BLUR_CSS_PX * dpr * BUFFER_SCALE;

      bctx.setTransform(1, 0, 0, 1, 0, 0);
      bctx.clearRect(0, 0, buffer.width, buffer.height);
      // Not every engine supports canvas filters (Safari only got them in 16.4).
      // Where it's missing the upscale still softens the image, just less.
      if ("filter" in bctx) bctx.filter = `blur(${blur}px)`;

      // Overscan by the blur radius, so the edges sample real pixels instead of
      // fading into transparency.
      const bleed = blur * 2;
      const scale = Math.max(
        (buffer.width + bleed * 2) / img.naturalWidth,
        (buffer.height + bleed * 2) / img.naturalHeight
      );
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      bctx.drawImage(img, (buffer.width - w) / 2, (buffer.height - h) / 2, w, h);
      if ("filter" in bctx) bctx.filter = "none";
    };

    const paint = (mix: number, refreshGlass = true) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (outgoing) {
        ctx.globalAlpha = 1;
        ctx.drawImage(outgoing, 0, 0, canvas.width, canvas.height);
      }
      ctx.globalAlpha = outgoing ? mix : 1;
      ctx.drawImage(buffers[front], 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      ctx.fillStyle = `rgba(0, 0, 0, ${DIM})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!refreshGlass) return;
      const now = performance.now();
      if (now - lastGlassRefresh >= GLASS_REFRESH_MS) {
        lastGlassRefresh = now;
        stageRef.current?.refresh();
      }
    };

    const settle = () => {
      outgoing = null;
      paint(1, false);
      stageRef.current?.refresh();
    };

    const step = () => {
      const t = Math.min(1, (performance.now() - fadeStart) / FADE_MS);
      paint(t * t * (3 - 2 * t));
      if (t < 1) {
        frame = requestAnimationFrame(step);
      } else {
        frame = 0;
        settle();
      }
    };

    const show = (next: number, fade: boolean) => {
      const img = load(next);
      const begin = () => {
        const incoming = 1 - front;
        renderSlide(img, buffers[incoming]);
        outgoing = fade ? buffers[front] : null;
        front = incoming;
        currentImage = img;
        index = next;
        load((next + 1) % slides.length);
        if (!fade) {
          settle();
          return;
        }
        fadeStart = performance.now();
        if (!frame) frame = requestAnimationFrame(step);
      };
      img.decode().then(begin, begin);
    };

    resize();
    show(index, false);

    const onResize = () => {
      if (!resize()) return;
      // Buffers were resized, which cleared them; the fade can't be salvaged.
      outgoing = null;
      if (currentImage) renderSlide(currentImage, buffers[front]);
      paint(1);
    };
    window.addEventListener("resize", onResize);

    const timer =
      slides.length > 1 && !prefersReducedMotion()
        ? window.setInterval(
            () => show((index + 1) % slides.length, true),
            HOLD_MS
          )
        : 0;

    return () => {
      if (timer) window.clearInterval(timer);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full bg-gray-300 dark:bg-gray-950"
    />
  );
};

export default BackgroundSlideshow;
