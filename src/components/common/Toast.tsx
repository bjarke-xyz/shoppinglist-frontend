import React, { useEffect } from "react";

interface IToastProps {
  message: string;
}

const Toast: React.FC<IToastProps> = (props) => {
  useEffect(() => {
    // eslint-disable-next-line no-alert
    alert(props.message);
  });

  return <></>;
};

export default Toast;
