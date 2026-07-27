import React from "react";
import {
  BrainCircuit,
  Code2,
  Globe,
  Monitor,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export type PlatformId = "desktop" | "ios" | "web" | "python" | "ml";

// `label` is the short name shown next to the icon on detail pages; `title` is
// the fuller version used for the hover tooltip and screen readers, since the
// cards show the icon alone.
export const platformMeta: Record<
  PlatformId,
  { label: string; title: string; Icon: LucideIcon }
> = {
  desktop: {
    label: "Desktop",
    title: "Desktop · Windows / macOS / Linux",
    Icon: Monitor,
  },
  ios: { label: "iOS", title: "iOS", Icon: Smartphone },
  web: { label: "Web", title: "Web", Icon: Globe },
  python: { label: "Python", title: "Python", Icon: Code2 },
  ml: { label: "Data / ML", title: "Data / ML", Icon: BrainCircuit },
};

interface Props {
  platforms: PlatformId[];
  // Detail pages have the room for the name; the cards don't.
  showLabels?: boolean;
}

const PlatformIcons = ({ platforms, showLabels = false }: Props) => (
  <div className="flex items-center gap-1.5">
    {platforms.map((id) => {
      const { label, title, Icon } = platformMeta[id];
      return (
        <span
          key={id}
          title={title}
          className={`flex items-center gap-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 ${
            showLabels ? "px-2.5 py-1" : "p-1.5"
          }`}
        >
          <Icon className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
          {showLabels ? (
            <span className="text-[11px] uppercase tracking-wide">{label}</span>
          ) : (
            <span className="sr-only">{title}</span>
          )}
        </span>
      );
    })}
  </div>
);

export default PlatformIcons;
