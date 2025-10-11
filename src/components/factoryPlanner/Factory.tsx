import { SavedFactory } from "@/interfaces";
import { IconWithTooltip } from "@/reusableComp/IconWithTooltip";
import { useDraggable } from "@/reusableComp/useDraggable";
import { twMerge } from "tailwind-merge";
import { DetailedView } from "./DetailedView";
import { Button } from "@/reusableComp/Button";

export const Factory = (props: {
  factory: SavedFactory;
  selected: boolean;
  isHovered: boolean;
  hoveredAccumulatedProduct: string | null;
  onSelect: (id: string) => void;
  setHoveredFactoryId: (id: string | null) => void;
  onDrop: (
    sourceId: string,
    targetId: string,
    closestEdge: "left" | "right"
  ) => void;
}) => {
  const ref = useDraggable(props.factory.id, props.onDrop);
  const hoveredIsOutput = false;
  //props.factory.productToProduce === props.hoveredAccumulatedProduct;
  const hoveredIsInput = false; /* props.factory.input.some(
    (x) => x.product === props.hoveredAccumulatedProduct
  ); */
  const productNodes = props.factory.productNodes;
  const root = productNodes.find((node) => node.type === "ROOT")!;

  return (
    <div
      ref={ref}
      className={twMerge(
        "border-2",
        hoveredIsOutput
          ? "border-dashed"
          : hoveredIsInput
          ? "border-dotted"
          : "border-solid",
        props.selected || hoveredIsOutput || hoveredIsInput
          ? ""
          : "border-white"
      )}
    >
      <Button
        onMouseEnter={() => props.setHoveredFactoryId(props.factory.id)}
        onMouseLeave={() => props.setHoveredFactoryId(null)}
        onClick={() => props.onSelect(props.factory.id)}
      >
        <div className="flex items-center">
          {Math.round(root?.rate * 100) / 100}/min
          <IconWithTooltip item={root.name} />
        </div>
      </Button>
      {props.isHovered && (
        <div className="fixed bottom-4 right-4 z-100 bg-gray-200 rounded border-2">
          <DetailedView savedSetting={props.factory} />
        </div>
      )}
    </div>
  );
};
