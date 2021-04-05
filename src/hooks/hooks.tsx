import { MutableRefObject, useCallback, useEffect, useRef } from "react";

export const useToCaptureClickOutside = (
  isOpen: boolean,
  callBackOnClickOutside: () => void
): MutableRefObject<HTMLElement | null> => {
  const node = useRef<HTMLElement>(null);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (e.target instanceof Node && node.current?.contains(e.target)) {
        // Inside click
        return;
      }

      // Outside click
      callBackOnClickOutside();
    },
    [callBackOnClickOutside]
  );

  useEffect(() => {
    const mouseEvent = "mouseup";
    if (isOpen) {
      document.addEventListener(mouseEvent, handleClickOutside);
    } else {
      document.removeEventListener(mouseEvent, handleClickOutside);
    }

    return () => {
      document.removeEventListener(mouseEvent, handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return node;
};
