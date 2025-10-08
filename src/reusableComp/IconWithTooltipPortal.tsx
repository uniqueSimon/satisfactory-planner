import { createPortal } from "react-dom";
import { useState } from "react";
import { productDisplayNameMapping } from "@/App";

export const IconWithTooltipPortal = (props: { item: string }) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: rect.left + rect.width / 2,
      y: rect.top - 4,
    });
    setShow(true);
  };

  return (
    <div onMouseEnter={handleEnter} onMouseLeave={() => setShow(false)}>
      <img
        className="h-10"
        draggable={false}
        src={`items/desc-${props.item
          .toLowerCase()
          .replace("_", "-")}-c_64.png`}
      />
      {show &&
        coords &&
        createPortal(
          <div
            className="fixed -translate-x-1/2 -translate-y-full rounded-lg bg-gray-800 p-2 text-sm text-white shadow-lg"
            style={{ left: coords.x, top: coords.y }}
          >
            {productDisplayNameMapping.get(props.item)}
          </div>,
          document.body
        )}
    </div>
  );
};
