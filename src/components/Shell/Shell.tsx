import React, { useRef } from "react";
import { useInkSurface } from "@/lib/useInkSurface";

// The app sits straight on the photo — no panel. `data-ink` hands the whole
// subtree over to the adaptive fill, so every glyph is painted with the inverse
// of whatever is behind it. See lib/adaptiveInk.
const Shell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useInkSurface(ref);

  return (
    <div
      ref={ref}
      data-ink
      className="relative z-10 mx-auto mt-6 w-[94%] max-w-[80rem] sm:mt-8 lg:w-[88%]"
    >
      {children}
    </div>
  );
};

export default Shell;
