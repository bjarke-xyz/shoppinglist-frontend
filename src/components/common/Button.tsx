/* eslint-disable prettier/prettier */
/* eslint-disable react/button-has-type */
import styled from "@emotion/styled";
import React from "react";


interface IButtonProps {
  label?: string;
  onClick: () => void;
  outline?: boolean;
  type?: "button" | "reset" | "submit";
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  danger?: boolean;
  className?: string;
}

const CircleSvgWrapper = styled.svg`
  fill: transparent;
  stroke-width: 10;
  stroke-linecap: round;
  transform-origin: 50% 50%;
  stroke-dashoffset: 75;
  stroke-dasharray: 283;
`;


const Button: React.FC<IButtonProps> = (props) => (
  <button
    type={props.type ?? "button"}
    className={`flex justify-center border-2 focus:outline-none active:ring active:ring-opacity-70 text-white text-sm py-2.5 px-5 rounded  hover:shadow-sm w-full ${props.disabled
      ? "bg-gray-300 text-gray-400 border-gray-400 active:ring-0 active:ring-opacity-0" :
      props.outline
        ? props.danger ? "bg-red-50 border-red-200 hover:bg-red-100 active:ring-red-200 text-gray-600" : "bg-green-50 border-green-200 hover:bg-green-100 active:ring-green-200 text-gray-600"
        : props.danger ? "bg-red-400 border-red-600 hover:bg-red-500 active:ring-red-200" : "bg-green-400 border-green-600 hover:bg-green-500 active:ring-green-200"
      } ${props.disabled ? 'cursor-not-allowed' : ''} ${props.className ?? ''}`}
    onClick={props.disabled ? () => { } : props.onClick}
    disabled={props.disabled || props.loading}
  >
    <div className="flex flex-row items-center space-x-2">
      <div>
        {props.loading &&
          <CircleSvgWrapper className="animate-spin h-6 w-6 stroke-current text-white" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" />
          </CircleSvgWrapper>}
        {!props.loading && props.icon && <div className="h-6 w-6">{props.icon}</div>}
      </div>
      {props.label &&
        <div className="uppercase">
          {props.label}
        </div>
      }
    </div>
  </button>
);

export default Button;
