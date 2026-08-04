import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  GlassStage,
  LAYER_Z,
  type GlassLayer,
} from "@/lib/liquidGlass/GlassStage";

interface GlassContextValue {
  stage: GlassStage | null;
  supported: boolean;
}

const GlassContext = createContext<GlassContextValue>({
  stage: null,
  supported: false,
});

export const useGlass = () => useContext(GlassContext);

// Frosted white in light mode, smoked in dark, so the same panels can carry
// dark text over a bright photo and light text over a dim one.
const TINTS = {
  light: { top: [1, 1, 1], bottom: [0.9, 0.91, 0.94] },
  dark: { top: [0.1, 0.12, 0.17], bottom: [0.02, 0.03, 0.06] },
};

export const GlassProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stage, setStage] = useState<GlassStage | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const instance = new GlassStage();
    const host = hostRef.current;

    if (host) {
      for (const [layer, renderer] of Object.entries(instance.layers)) {
        const { canvas } = renderer;
        canvas.className = "pointer-events-none fixed inset-0 h-full w-full";
        canvas.style.zIndex = String(LAYER_Z[layer as GlassLayer]);
        host.appendChild(canvas);
      }
    }
    setStage(instance);

    const onChange = () => instance.requestRender();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);

    // The toggle flips a class on <html>; the glass has to follow it.
    const applyTint = () => {
      const dark = document.documentElement.classList.contains("dark");
      const tint = dark ? TINTS.dark : TINTS.light;
      instance.setTint(tint.top, tint.bottom);
    };
    applyTint();
    const observer = new MutationObserver(applyTint);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    if (import.meta.env.DEV) {
      // Handy for measuring a forced render from the console; stripped in prod.
      (window as unknown as { __glass?: GlassStage }).__glass = instance;
    }

    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
      observer.disconnect();
      instance.destroy();
    };
  }, []);

  const value = useMemo(
    () => ({ stage, supported: Boolean(stage?.supported) }),
    [stage]
  );

  return (
    <GlassContext.Provider value={value}>
      <div ref={hostRef} aria-hidden="true" />
      {children}
    </GlassContext.Provider>
  );
};

interface GlassProps {
  children?: React.ReactNode;
  className?: string;
  /** Corner radius in px, or "pill" for a fully rounded capsule. */
  radius?: number | "pill";
  /** 0 = clear glass, 1 = opaque tint. Higher means more readable text. */
  tintOpacity?: number;
  /** Bulges the centre as well as the rim. Reads well on small pills. */
  warp?: boolean;
  /** "overlay" for panels that sit above the page, like the fixed nav. */
  layer?: GlassLayer;
}

const Glass: React.FC<GlassProps> = ({
  children,
  className = "",
  radius = 24,
  tintOpacity = 0.5,
  warp = false,
  layer = "content",
}) => {
  const { stage, supported } = useGlass();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!stage || !element) return;

    const handle = stage.register(layer, element, {
      borderRadius: radius,
      tintOpacity,
      warp,
    });
    // Panels reflow with the text inside them, and the glass has to follow.
    const observer = new ResizeObserver(() => stage.requestRender());
    observer.observe(element);

    return () => {
      observer.disconnect();
      handle.unregister();
    };
  }, [stage, layer, radius, tintOpacity, warp]);

  return (
    <div
      ref={ref}
      style={{ borderRadius: radius === "pill" ? 9999 : radius }}
      className={`relative ${
        // Without WebGL there is no refraction to draw, so fall back to the
        // plain frosted-pane version rather than to nothing at all.
        supported
          ? ""
          : "border border-white/50 bg-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md dark:border-white/15 dark:bg-gray-950/45"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Glass;
