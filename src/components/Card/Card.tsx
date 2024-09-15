import React from "react";

interface Props {
  title: string;
  description: string;
  link: string;
}

const Card = (props: Props) => {
  return (
    <a
      href={props.link}
      className="w-80 h-72 rounded overflow-hidden cursor-pointer hover:transform hover:scale-[1.02] transition-transform block border border-gray-300"
      target="_blank"
    >
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{props.title}</div>
        <p className="text-gray-700 text-sm">{props.description}</p>
      </div>
    </a>
  );
};

export default Card;
