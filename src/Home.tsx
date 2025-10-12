import { useState } from "react";
import { Cluster } from "./interfaces";
import { useResizeDrawer } from "./components/factoryDetails/useResizeDrawer";
import { twMerge } from "tailwind-merge";
import { Typography } from "antd";
import { FactoryPlanner } from "./components/factoryPlanner/FactoryPlanner";
import { Drawer } from "./Drawer";

export const Home = (props: {
  savedFactories: Cluster[];
  setSavedFactories: (newValue: Cluster[]) => void;
}) => {
  const [clickedFactoryId, setClickedFactoryId] = useState<string | null>(null);
  const { height, isDragging, handleMouseDown } = useResizeDrawer();

  return (
    <>
      <FactoryPlanner
        clickedFactoryId={clickedFactoryId}
        savedFactories={props.savedFactories}
        setClickedFactoryId={setClickedFactoryId}
        setSavedFactories={props.setSavedFactories}
      />
      <div
        onMouseDown={handleMouseDown}
        className="h-2 bg-gray-400 cursor-row-resize"
      />
      <div
        className={twMerge(
          "bg-gray-200",
          !isDragging && "transition-all duration-300 ease-in-out"
        )}
        style={{ height: clickedFactoryId ? height : 0 }}
      >
        {clickedFactoryId && (
          <Drawer
            clickedFactoryId={clickedFactoryId}
            setClickedFactoryId={setClickedFactoryId}
            savedFactories={props.savedFactories}
            setSavedFactories={props.setSavedFactories}
          />
        )}
      </div>
    </>
  );
};
