import { productDisplayNameMapping } from "@/App";

export const IconWithTooltip = (props: {
  item: string;
  height?: number;
  customText?: string;
}) => (
  <div className="group relative z-50 overflow-visible">
    <div className="w-auto ml-0.5">
      <img
        className="h-10"
        draggable={false}
        src={`items/desc-${props.item
          .toLowerCase()
          .replace("_", "-")}-c_64.png`}
      />
    </div>
    <div className="absolute left-1/2 bottom-full mb-2 w-max -translate-x-1/2 scale-0 transform rounded-lg bg-gray-800 p-2 text-sm text-white opacity-0 shadow-lg transition-all group-hover:scale-100 group-hover:opacity-100 z-50">
      {props.customText ?? productDisplayNameMapping.get(props.item)}
    </div>
  </div>
);
