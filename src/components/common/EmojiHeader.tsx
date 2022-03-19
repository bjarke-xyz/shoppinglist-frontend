import React from "react";

interface IEmojiHeaderProps {
  src: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  horiz?: boolean;
  small?: boolean;
}

const EmojiHeader: React.FC<IEmojiHeaderProps> = (props) => (
  <div
    className={`${props.small ? "" : "p-8"} flex ${
      props.horiz ? "flex-row items-center" : "flex-col"
    }`}
  >
    <img
      src={props.src}
      alt="Logo"
      className={`mx-auto ${props.small ? "h-8" : "h-20"} w-auto`}
    />
    <h2
      className={`${props.small ? "" : "mt-6"} text-center ${
        props.small ? "text-md" : "text-3xl"
      } text-gray-900`}
    >
      {props.title}
    </h2>
    {props.subtitle && !props.small && (
      <p className="mt-2 text-center text-sm text-gray-600">{props.subtitle}</p>
    )}
  </div>
);

export default EmojiHeader;
