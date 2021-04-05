import React from "react";

interface IEmojiHeaderProps {
  src: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

const EmojiHeader: React.FC<IEmojiHeaderProps> = (props) => (
  <div className="p-8">
    <img src={props.src} alt="Logo" className="mx-auto h-20 w-auto" />
    <h2 className="mt-6 text-center text-3xl text-gray-900">{props.title}</h2>
    {props.subtitle && (
      <p className="mt-2 text-center text-sm text-gray-600">{props.subtitle}</p>
    )}
  </div>
);

export default EmojiHeader;
