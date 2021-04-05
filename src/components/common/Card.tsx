import React from "react";

interface ICardProps {
  className?: string;
}

const Card: React.FC<ICardProps> = (props) => (
  <>
    <div
      className={`rounded shadow py-2 px-2 bg-white ${props.className ?? ""}`}
    >
      {props.children}
    </div>
  </>
);

export default Card;
