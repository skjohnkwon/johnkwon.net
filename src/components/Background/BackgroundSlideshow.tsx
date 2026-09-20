import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  INK_VAR,
  SCRIM_ALPHA,
  buildInkMask,
  dropGridCache,
  primeSlide,
} from "@/lib/adaptiveInk";

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
// How often the ink is rebuilt while a crossfade is running. Every frame would
// be wasteful for a 96px picture; this is fine enough to read as continuous.
const INK_STEP_MS = 120;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Two stacked covers crossfading into each other, and the ink the page's text is
 * painted with, rebuilt from whatever those covers currently add up to.
 *
 * The ink is regenerated through the crossfade rather than swapped at the end of
 * it, so the type changes colour at exactly the pace the photo does — see
 * lib/adaptiveInk.
 */
const BackgroundSlideshow: React.FC = () => {
  const [index, setIndex] = useState(() => {
    if (import.meta.env.DEV) {
      // ?slide=n pins one photo, so a backdrop can be looked at on purpose
      // rather than waited for. Stripped from the production bundle.
      const pinned = new URLSearchParams(window.location.search).get("slide");
      if (pinned !== null) return Number(pinned) % slides.length;
    }
    return Math.floor(Math.random() * slides.length);
  });
  const [previous, setPrevious] = useState<number | null>(null);
  const indexRef = useRef(index);
  indexRef.current = index;
  const incomingRef = useRef<HTMLImageElement>(null);
  const outgoingRef = useRef<HTMLImageElement>(null);

  // A crossfade only ever needs a couple of dozen distinct masks; asking for
  // more just burns encodes nobody can see.
  const INK_STEPS = 24;
  const lastStep = useRef(-1);

  const paintInk = useCallback((progress: number) => {
    const incoming = incomingRef.current;
    if (!incoming) return;

    const step = Math.round(Math.min(1, Math.max(0, progress)) * INK_STEPS);
    if (step === lastStep.current) return;
    lastStep.current = step;

    const mask = buildInkMask(outgoingRef.current, incoming, step / INK_STEPS);
    if (!mask) return;

    const root = document.documentElement;
    root.style.setProperty(INK_VAR, `url("${mask}")`);
    // Only hand the page over to the ink once there is ink to use; before that
    // the plain colours stay up.
    root.classList.add("ink-ready");
  }, []);

  useEffect(() => {
    if (slides.length < 2 || prefersReducedMotion()) return;

    const timer = window.setInterval(() => {
      const next = (indexRef.current + 1) % slides.length;
      setPrevious(indexRef.current);
      setIndex(next);
      // Decode *and* measure the one after it during idle time, so the next
      // crossfade is pure arithmetic over two cached grids.
      primeSlide(slides[(next + 1) % slides.length]);
    }, HOLD_MS);

    return () => window.clearInterval(timer);
  }, []);

  // Follow the crossfade: same span, same shape, so the ink and the picture
  // arrive together.
  useEffect(() => {
    if (previous === null) {
      paintInk(1);
      return;
    }
    lastStep.current = -1;
    const started = performance.now();
    const timer = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - started) / FADE_MS);
      paintInk(t);
      if (t >= 1) window.clearInterval(timer);
    }, INK_STEP_MS);
    paintInk(0);
    return () => window.clearInterval(timer);
  }, [index, previous, paintInk]);

  // The crop changes with the viewport, so every cached grid is stale and the
  // mask has to be rebuilt from scratch.
  useEffect(() => {
    const onResize = () => {
      dropGridCache();
      lastStep.current = -1;
      paintInk(1);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paintInk]);

  if (slides.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 bg-gray-300 dark:bg-gray-950"
    >
      {previous !== null && (
        <img
          key={`out-${previous}`}
          ref={outgoingRef}
          src={slides[previous]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <img
        key={`in-${index}`}
        ref={incomingRef}
        src={slides[index]}
        alt=""
        // Decoded late on a cold cache, so build the ink on load as well.
        onLoad={() => paintInk(previous === null ? 1 : 0)}
        className="absolute inset-0 h-full w-full animate-in object-cover fade-in"
        style={{ animationDuration: `${FADE_MS}ms` }}
        onAnimationEnd={() => setPrevious(null)}
      />
      {/* Takes the top off the photo. The ink accounts for this too. */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: SCRIM_ALPHA }}
      />
    </div>
  );
};

export default BackgroundSlideshow;
