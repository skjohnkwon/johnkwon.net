import React, { useRef } from "react";
import { useInkSurface } from "@/lib/useInkSurface";

// Sits on the photo below the content, and takes the same adaptive fill.
const Footer: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  useInkSurface(ref);

  return (
    <footer
      ref={ref}
      data-ink
      className="relative z-10 mx-auto mb-6 mt-2 w-[94%] max-w-[80rem] px-6 text-xs text-gray-900/80 sm:mb-8 sm:px-10 lg:w-[88%] dark:text-white/75"
    >
      <a
        href="https://github.com/skjohnkwon/johnkwon.net"
        target="_blank"
        rel="noreferrer"
      >
        vite + react + typescript + tailwindcss + shadcn/ui deployed on aws
        amplify
      </a>
    </footer>
  );
};

export default Footer;
