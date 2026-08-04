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
// Photos stay sharp. This only takes the top off them so the panels sitting on
// top have something to separate from — the frosting happens in the glass.
const DIM = 0.24;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The photos are painted to a canvas rather than <img> tags because the glass
 * panels need something they can sample as a texture. This canvas is both the
 * thing you see and the thing they refract — GlassStage blurs its own sampled
 * copy, so the panels frost without touching what's on screen.
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

    let index = Math.floor(Math.random() * slides.length);
    let current: HTMLImageElement | null = null;
    let outgoing: HTMLImageElement | null = null;
    let fadeStart = 0;
    let frame = 0;
    let lastGlassRefresh = 0;

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
      return true;
    };

    const drawCover = (img: HTMLImageElement, alpha: number) => {
      if (!img.complete || img.naturalWidth === 0) return;
      const scale = Math.max(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight
      );
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      ctx.globalAlpha = 1;
    };

    const paint = (mix: number, refreshGlass = true) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (outgoing) drawCover(outgoing, 1);
      if (current) drawCover(current, outgoing ? mix : 1);

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
        outgoing = fade ? current : null;
        current = img;
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
      if (resize()) paint(1);
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
