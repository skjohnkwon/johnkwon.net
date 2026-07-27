import React from "react";
import { Link } from "react-router-dom";
import PlatformIcons, {
  type PlatformId,
} from "@/components/PlatformIcons/PlatformIcons";

interface Props {
  title: string;
  description: string;
  // Internal route to the project's detail page (e.g. "/projects/easy-manga").
  to: string;
  // Shown as icons in the card header; the name lives in the tooltip.
  platforms?: PlatformId[];
}

const Card = (props: Props) => {
  return (
    <Link
      to={props.to}
      className="w-80 h-full rounded overflow-hidden cursor-pointer hover:transform hover:scale-[1.02] transition-transform block border border-gray-300 dark:border-gray-700 dark:bg-gray-800 generic-hover"
    >
      <div className="px-6 py-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <div className="font-bold text-xl dark:generic-hover">
            {props.title}
          </div>
          {props.platforms && props.platforms.length > 0 && (
            <PlatformIcons platforms={props.platforms} />
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-300 text-sm">
          {props.description}
        </p>
        <span className="mt-auto pt-4 text-xs text-blue-500 dark:text-blue-300">
          view project →
        </span>
      </div>
    </Link>
  );
};

export default Card;
