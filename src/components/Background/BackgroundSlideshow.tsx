import React, { useEffect, useRef, useState } from "react";

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

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Two stacked covers crossfading into each other: the incoming slide fades up
 * over the outgoing one, which is dropped once the fade lands. The photos stay
 * sharp — only a flat scrim sits on top, to separate them from the panels.
 */
const BackgroundSlideshow: React.FC = () => {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * slides.length)
  );
  const [previous, setPrevious] = useState<number | null>(null);
  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    if (slides.length < 2 || prefersReducedMotion()) return;

    const timer = window.setInterval(() => {
      const next = (indexRef.current + 1) % slides.length;
      setPrevious(indexRef.current);
      setIndex(next);
      // Warm the one after it so the next fade starts on a decoded image.
      new Image().src = slides[(next + 1) % slides.length];
    }, HOLD_MS);

    return () => window.clearInterval(timer);
  }, []);

  if (slides.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 bg-gray-300 dark:bg-gray-950"
    >
      {previous !== null && (
        <img
          key={`out-${previous}`}
          src={slides[previous]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <img
        key={`in-${index}`}
        src={slides[index]}
        alt=""
        className="absolute inset-0 h-full w-full animate-in object-cover fade-in"
        style={{ animationDuration: `${FADE_MS}ms` }}
        onAnimationEnd={() => setPrevious(null)}
      />
      {/* Takes the top off the photo so the panels have something to sit on. */}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
};

export default BackgroundSlideshow;
