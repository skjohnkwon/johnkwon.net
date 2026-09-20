import React from "react";

// The whole app lives in one inset panel: centred, gutters down both sides and
// across the top and bottom, so the photo frames it. Everything inside is flat
// — sections are separated by hairlines, not by cards stacked on each other.
const Shell: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="relative z-10 mx-auto mt-6 w-[94%] max-w-[80rem] overflow-hidden rounded-2xl backdrop-blur-3xl backdrop-saturate-150 sm:mt-8 lg:w-[88%]">
    {children}
  </div>
);

export default Shell;
