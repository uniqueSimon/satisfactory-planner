import { useEffect, useRef } from "react";

export const useRefInMap = (
  key: string,
  nodeRefs: Map<string, HTMLDivElement>
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      nodeRefs.set(key, ref.current);
    }
    return () => {
      nodeRefs.delete(key);
    };
  }, [key, ref.current]);

  return ref;
};
