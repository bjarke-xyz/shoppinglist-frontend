import React from "react";
import { FieldError } from "react-hook-form";
import { ExclamationIcon } from "./Icons";

interface IInputProps {
  label: string;
  name: string;
  type: string;
  reg?: React.LegacyRef<HTMLInputElement>;
  errors?: FieldError;
  className?: string;
  defaultValue?: string | number | readonly string[] | null;
  defaultChecked?: boolean | null;
}

const Input: React.FC<IInputProps> = (props) => (
  <>
    <div
      // eslint-disable-next-line prettier/prettier
      className={`${props.className ?? ''} outline rounded relative border-2  ${props.errors ? "border-red-400" : "focus-within:border-green-200"} `}
    >
      <div className="flex flex-row items-center">
        <input
          defaultValue={
            props.defaultValue === null ? undefined : props.defaultValue
          }
          defaultChecked={
            props.defaultChecked === null ? undefined : props.defaultChecked
          }
          ref={props.reg}
          type={props.type}
          name={props.name}
          placeholder=" "
          className="block relative z-20 p-2 w-full appearance-none focus:outline-none focus:ring-0 focus:border-transparent border-none bg-transparent"
        />
        <label
          htmlFor={props.name}
          className="absolute text-gray-400 top-0 p-2 z-10 bg-white duration-200 origin-0"
        >
          {props.label}
        </label>
        {props.errors && (
          <div className="text-red-400 relative h-8 w-8 z-20 mr-2 mt-2 float-right">
            {ExclamationIcon}
          </div>
        )}
      </div>
    </div>
  </>
);

export default Input;
