import React from "react";

interface IPageContainerProps {
  className?: string;
}

const PageContainer: React.FC<IPageContainerProps> = (props) => (
  <>
    <div
      className={`rounded shadow py-2 px-2 bg-white ${props.className ?? ""}`}
    >
      {props.children}
    </div>
  </>
);

export default PageContainer;
