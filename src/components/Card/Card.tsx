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
      className="w-80 h-80 rounded overflow-hidden shadow-lg cursor-pointer hover:transform hover:scale-105 transition-transform block"
    >
      {/* If you have an image, you can include it here */}
      {/* {props.image && (
          <img
            className="w-full h-32 object-cover"
            src={props.image}
            alt={props.title}
          />
        )} */}
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{props.title}</div>
        <p className="text-gray-700 text-base">{props.description}</p>
      </div>
    </a>
  );
};

export default Card;
