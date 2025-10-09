import React, { useEffect, useState } from "react";

interface LineBetweenProps {
  from: HTMLElement | null;
  to: HTMLElement | null;
  label?: string;
}

export const LineBetween: React.FC<LineBetweenProps> = ({
  from,
  to,
  label,
}) => {
  const [coords, setCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });

  console.log('from',from)
  console.log('to',to)
  useEffect(() => {
    if (!from || !to) return;
    const update = () => {
      const f = from.getBoundingClientRect();
      const t = to.getBoundingClientRect();
      setCoords({
        x1: f.left + f.width / 2,
        y1: f.bottom,
        x2: t.left + t.width / 2,
        y2: t.top,
      });
      console.log({
        x1: f.left + f.width / 2,
        y1: f.bottom,
        x2: t.left + t.width / 2,
        y2: t.top,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [from, to]);

  if (!from || !to) return null;

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <line
        x1={coords.x1}
        y1={coords.y1}
        x2={coords.x2}
        y2={coords.y2}
        stroke="#888"
        strokeWidth={1.5}
      />
      {label && (
        <text
          x={(coords.x1 + coords.x2) / 2}
          y={(coords.y1 + coords.y2) / 2 - 4}
          textAnchor="middle"
          fill="#444"
          fontSize="10"
        >
          {label}
        </text>
      )}
    </svg>
  );
};
