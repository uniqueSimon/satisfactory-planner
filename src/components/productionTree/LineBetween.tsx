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
  rate: number;
  onRateChange: (newRate: number) => void;
}) => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (!props.from || !props.to || !props.container) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const update = () => {
      // Debounce updates to prevent infinite loops
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
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
      }, 10);
    };

    const mo = new MutationObserver(update);
    mo.observe(props.container, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    // Use ResizeObserver for more reliable updates
    const ro = new ResizeObserver(update);
    ro.observe(props.container);
    if (props.from) ro.observe(props.from);
    if (props.to) ro.observe(props.to);

    update();

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      mo.disconnect();
      ro.disconnect();
    };
  }, [props.from, props.to, props.container]);

  if (!coords) return null;

  const handleLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(String(props.rate));
    setIsEditing(true);
  };

  const handleSubmit = () => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue)) {
      props.onRateChange(numValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const labelX = (coords.x1 + 2 * coords.x2) / 3;
  const labelY = (coords.y1 + coords.y2) / 2;

  return (
    <>
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
        {!isEditing && (
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="10"
            fill="#444"
            stroke="white"
            strokeWidth="8"
            paintOrder="stroke"
            className="cursor-pointer pointer-events-auto"
            onClick={handleLabelClick}
          >
            {`${props.rate.toFixed(1)} /min`}
          </text>
        )}
      </svg>

      {isEditing && props.container && (
        <input
          type="number"
          step="0.1"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="absolute text-xs px-2 py-1 border-2 border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          style={{
            left: `${labelX}px`,
            top: `${labelY}px`,
            width: "60px",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            pointerEvents: "auto",
          }}
        />
      )}
    </>
  );
};
