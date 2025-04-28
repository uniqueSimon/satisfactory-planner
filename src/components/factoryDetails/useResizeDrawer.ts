import { useLocalStorage } from "@/reusableComp/useLocalStorage";
import { useEffect, useState } from "react";

export const useResizeDrawer = () => {
  const [initialDrawerHeight, setInitialDrawerHeight] = useLocalStorage<number>(
    "initial-drawer-height",
    300
  );
  const [height, setHeight] = useState(initialDrawerHeight);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newHeight = window.innerHeight - e.clientY;
      // min 100px, max full screen
      setHeight(Math.max(100, Math.min(newHeight, window.innerHeight)));
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    setInitialDrawerHeight(height);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);
  return { isDragging, height, handleMouseDown };
};
