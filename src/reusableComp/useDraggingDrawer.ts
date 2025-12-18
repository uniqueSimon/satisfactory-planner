import { useEffect, useState } from "react";

export const useDraggingDrawer = () => {
  const [drawerWidth, setDrawerWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth > 200 && e.clientX > 280) {
          setDrawerWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return { drawerWidth, isDragging, setIsDragging };
};
