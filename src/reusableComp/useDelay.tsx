import { useEffect, useState } from "react";

export const useDelay = (trigger: any, delay: number) => {
  const [delayReached, setDelayReached] = useState(false);
  useEffect(() => {
    setDelayReached(false);
    const id = setTimeout(() => {
      setDelayReached(true);
    }, delay);
    return () => {
      clearTimeout(id);
    };
  }, [trigger]);
  return delayReached;
};
