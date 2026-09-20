import { useLayoutEffect, type RefObject } from "react";
import { alignInkSurface } from "./adaptiveInk";

/**
 * Keeps an inked element's fill registered to the viewport as the page scrolls,
 * resizes, or reflows.
 */
export const useInkSurface = (ref: RefObject<HTMLElement>) => {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const sync = () => {
      frame = 0;
      alignInkSurface(el);
    };
    // Scroll fires far faster than paint; one alignment per frame is plenty.
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(el);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, [ref]);
};
