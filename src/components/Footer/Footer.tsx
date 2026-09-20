import React from "react";

// Sits on the photo underneath the panel, so it needs its own contrast.
const Footer: React.FC = () => (
  <footer className="relative z-10 mx-auto mb-6 mt-2 w-[94%] max-w-[80rem] px-6 sm:mb-8 sm:px-10 lg:w-[88%]">
    <a
      href="https://github.com/skjohnkwon/johnkwon.net"
      target="_blank"
      rel="noreferrer"
      className="text-shadow-photo text-xs text-white/75"
    >
      vite + react + typescript + tailwindcss + shadcn/ui deployed on aws
      amplify
    </a>
  </footer>
);

export default Footer;
