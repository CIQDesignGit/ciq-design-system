import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * Detects whether an element's content is overflowing (CSS truncate clipping),
 * so tooltips only show when the label is actually cut off.
 */
export function useIsTruncated<T extends HTMLElement>(
  ref: RefObject<T | null>,
  deps: readonly unknown[]
): boolean {
  const [isTruncated, setIsTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    setIsTruncated(el ? el.scrollWidth > el.clientWidth : false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return isTruncated;
}
