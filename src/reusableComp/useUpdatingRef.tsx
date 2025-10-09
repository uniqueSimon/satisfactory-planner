import { useEffect, useRef, useState } from "react";

export const useUpdatingRef = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [divEle, setDivEle] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    setDivEle(ref.current);
  }, [ref]);
  return { ref, divEle };
};
