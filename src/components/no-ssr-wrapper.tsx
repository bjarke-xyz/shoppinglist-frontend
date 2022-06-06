import dynamic from "next/dynamic";
import React from "react";

const NoSSRWrapper: React.FC<{ children: React.ReactNode }> = (props: {
  children: React.ReactNode;
}) => {
  return <>{props.children}</>;
};

export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});
