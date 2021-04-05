import React from "react";

interface IAlertProps {
  title: string;
  body: string;
  color: "red" | "yellow" | "green";
  className?: string;
}

const Alert: React.FC<IAlertProps> = (props) => (
  <>
    <div
      role="alert"
      // eslint-disable-next-line prettier/prettier
      className={`bg-${props.color}-100 border border-${props.color}-400 text-${props.color}-700 px-4 py-3 rounded relative ${props.className ?? ""}`}
    >
      <strong className="font-bold">{props.title}</strong>{" "}
      <span className="block sm:inline">{props.body}</span>
    </div>
  </>
);

export default Alert;
