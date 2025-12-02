import { useEffect, useState } from "react";

interface Coordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  w: number;
  h: number;
}

/**
 * Draws a straight SVG line + optional label between `from` and `to`.
 * Coordinates are relative to `container`.
 */
export const LineBetween = (props: {
  from: HTMLElement | null;
  to: HTMLElement | null;
  container: HTMLElement | null;
  label?: string;
}) => {
  const [coords, setCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    if (!props.from || !props.to || !props.container) return;

    const update = () => {
      const cRect = props.container!.getBoundingClientRect();
      const f = props.from!.getBoundingClientRect();
      const t = props.to!.getBoundingClientRect();

      setCoords({
        x1: f.left + f.width / 2 - cRect.left,
        y1: f.bottom - cRect.top,
        x2: t.left + t.width / 2 - cRect.left,
        y2: t.top - cRect.top,
        w: cRect.width,
        h: cRect.height,
      });
    };

    const mo = new MutationObserver(update);
    mo.observe(props.container, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    update();

    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, [props.from, props.to, props.container]);

  if (!coords) return null;

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      width={coords.w}
      height={coords.h}
      viewBox={`0 0 ${coords.w} ${coords.h}`}
      style={{ overflow: "visible" }}
    >
      <line
        x1={coords.x1}
        y1={coords.y1}
        x2={coords.x2}
        y2={coords.y2}
        stroke="#888"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {props.label && (
        <text
          x={(coords.x1 + 2 * coords.x2) / 3}
          y={(coords.y1 + coords.y2) / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="10"
          fill="#444"
          stroke="white"
          strokeWidth="8"
          paintOrder="stroke"
        >
          {props.label}
        </text>
      )}
    </svg>
  );
};
