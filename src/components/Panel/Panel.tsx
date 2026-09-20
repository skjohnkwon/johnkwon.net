import React from "react";

interface PanelProps {
  children?: React.ReactNode;
  className?: string;
}

// The photo backdrop stays sharp, so the panels carry the contrast themselves:
// near-opaque paper with a hairline edge, and no filter over the photo.
const Panel: React.FC<PanelProps> = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-black/10 bg-white/90 shadow-lg shadow-black/10 dark:border-white/10 dark:bg-gray-950/85 dark:shadow-black/40 ${className}`}
  >
    {children}
  </div>
);

export default Panel;
