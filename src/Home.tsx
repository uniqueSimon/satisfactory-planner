import { useState } from "react";
import { Cluster, SavedFactory } from "./interfaces";
import { allRecipes } from "./App";
import { useResizeDrawer } from "./components/factoryDetails/useResizeDrawer";
import { twMerge } from "tailwind-merge";
import { Typography } from "antd";
import { FactoryPlanner } from "./components/factoryPlanner/FactoryPlanner";
import { FactoryDetails } from "./components/factoryDetails/FactoryDetails";

export const Home = (props: {
  foundAltRecipes: string[];
  setFoundAltRecipes: (recipes: string[]) => void;
  savedFactories: Cluster[];
  setSavedFactories: (newValue: Cluster[]) => void;
}) => {
  const [clickedFactoryId, setClickedFactoryId] = useState<number | null>(null);

  const combinedSavedFactories = props.savedFactories
    .map((x) => x.factories)
    .flat();
  const selectedSavedSettings = combinedSavedFactories.find(
    (x) => x.id === clickedFactoryId
  );

  const availableRecipes = allRecipes.filter(
    (x) => !x.isAlternate || props.foundAltRecipes.includes(x.recipeName)
  );

  const { height, isDragging, handleMouseDown } = useResizeDrawer();

  const onDelete = (id: number) => {
    setClickedFactoryId(null);
    props.setSavedFactories(
      props.savedFactories.map((cluster) => ({
        ...cluster,
        factories: cluster.factories.filter((x) => x.id !== id),
      }))
    );
  };
  const onCopy = (factory: SavedFactory) => {
    props.setSavedFactories([
      ...props.savedFactories,
      { title: "Copied", factories: [factory] },
    ]);
  };
  const onChangeFactory = (changedFactory: SavedFactory) =>
    props.setSavedFactories(
      props.savedFactories.map((cluster) => ({
        ...cluster,
        factories: cluster.factories.map((factory) =>
          factory.id === clickedFactoryId ? changedFactory : factory
        ),
      }))
    );
  return (
    <>
      <div
        className={twMerge(
          "p-4 flex-1 overflow-auto",
          isDragging ? "pointer-events-none" : "pointer-events-auto"
        )}
      >
        <Typography.Title>Satisfactory Planner</Typography.Title>
        <FactoryPlanner
          clickedFactoryId={clickedFactoryId}
          savedFactories={props.savedFactories}
          setClickedFactoryId={setClickedFactoryId}
          setSavedFactories={props.setSavedFactories}
        />
      </div>
      <div
        onMouseDown={handleMouseDown}
        className="h-2 bg-gray-400 cursor-row-resize"
      />
      <div
        className={twMerge(
          "bg-gray-200",
          !isDragging && "transition-all duration-300 ease-in-out"
        )}
        style={{ height: selectedSavedSettings ? height : 0 }}
      >
        {selectedSavedSettings && (
          <FactoryDetails
            onClose={() => setClickedFactoryId(null)}
            onDelete={onDelete}
            onCopy={onCopy}
            availableRecipes={availableRecipes}
            savedFactory={selectedSavedSettings}
            setSavedFactory={onChangeFactory}
          />
        )}
      </div>
    </>
  );
};
