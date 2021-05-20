import React from "react";
import PageContainer from "./PageContainer";
import EmojiHeader from "./EmojiHeader";

interface ILoadingProps {
  emoji?: boolean;
}

const Loading: React.FC<ILoadingProps> = (props) => (
  <PageContainer
    // eslint-disable-next-line prettier/prettier
    className={`mx-auto max-w-3xl h-72 animate-pulse ${
      !props.emoji && "bg-gray-200"
    }`}
  >
    {props.emoji && (
      <EmojiHeader src="/img/emoji/thinking-face.svg" title="Loading..." />
    )}
  </PageContainer>
);

export default Loading;
