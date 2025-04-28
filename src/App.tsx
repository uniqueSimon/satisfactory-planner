import { Form, Select, Typography } from "antd";
import { FactoryPlanner } from "./components/factoryPlanner/FactoryPlanner";
import { useLocalStorage } from "./reusableComp/useLocalStorage";
import { useState } from "react";
import { FactoryDetails } from "./components/factoryDetails/FactoryDetails";
import { calculateProductWeights, maxRates } from "./calculateProductWeights";
import { AlternateRecipes } from "./components/AlternateRecipes";
import allProductsJson from "./gameData/allProducts.json";
import allRecipesJson from "./gameData/allRecipes.json";
import displayNamesJson from "./gameData/displayNames.json";
import { ExportLocalStorage } from "./components/ExportLocalStorage";
import { ImportLocalStorage } from "./components/ImportLocalStorage";
import { Cluster, SavedFactory } from "./interfaces";
import { twMerge } from "tailwind-merge";
import { useResizeDrawer } from "./components/factoryDetails/useResizeDrawer";

export const allProducts = allProductsJson;
export const allRecipes = allRecipesJson;
export const productDisplayNameMapping = new Map(
  displayNamesJson as [string, string][]
);

export const App = () => {
  const [savedFactories, setSavedFactories] = useLocalStorage<Cluster[]>(
    "saved-factories",
    []
  );
  const [foundAltRecipes, setFoundAltRecipes] = useLocalStorage<string[]>(
    "found-alt-recipes",
    []
  );
  const [clickedFactoryId, setClickedFactoryId] = useState<number | null>(null);
  const [excludedResources, setExcludedResources] = useState([]);

  const combinedSavedFactories = savedFactories.map((x) => x.factories).flat();
  const selectedSavedSettings = combinedSavedFactories.find(
    (x) => x.id === clickedFactoryId
  );
  const allResources = [...maxRates.keys()];

  const weights = calculateProductWeights(excludedResources);

  const availableRecipes = allRecipes.filter(
    (x) => !x.isAlternate || foundAltRecipes.includes(x.recipeName)
  );

  const { height, isDragging, handleMouseDown } = useResizeDrawer();

  const onDelete = (id: number) => {
    setClickedFactoryId(null);
    setSavedFactories(
      savedFactories.map((cluster) => ({
        ...cluster,
        factories: cluster.factories.filter((x) => x.id !== id),
      }))
    );
  };
  const onCopy = (factory: SavedFactory) => {
    setSavedFactories([
      ...savedFactories,
      { title: "Copied", factories: [factory] },
    ]);
  };
  const onChangeFactory = (changedFactory: SavedFactory) =>
    setSavedFactories(
      savedFactories.map((cluster) => ({
        ...cluster,
        factories: cluster.factories.map((factory) =>
          factory.id === clickedFactoryId ? changedFactory : factory
        ),
      }))
    );
  return (
    <div className="flex flex-col h-screen">
      <div
        className={twMerge(
          "p-4 flex-1 overflow-auto",
          isDragging ? "pointer-events-none" : "pointer-events-auto"
        )}
      >
        <Typography.Title>Satisfactory Production Optimizer</Typography.Title>
        <div className="flex">
          <ExportLocalStorage
            foundAltRecipes={foundAltRecipes}
            savedFactories={savedFactories}
          />
          <ImportLocalStorage
            setFoundAltRecipes={setFoundAltRecipes}
            setSavedFactories={setSavedFactories}
          />
        </div>
        <FactoryPlanner
          clickedFactoryId={clickedFactoryId}
          savedFactories={savedFactories}
          setClickedFactoryId={setClickedFactoryId}
          setSavedFactories={setSavedFactories}
        />
        <Form>
          <Form.Item label="Resources to exclude from weighting points">
            <Select
              style={{ display: "block" }}
              mode="multiple"
              allowClear={true}
              options={allResources.map((x) => ({
                key: x,
                value: x,
                label: x,
              }))}
              value={excludedResources}
              onChange={setExcludedResources}
            />
          </Form.Item>
          <AlternateRecipes
            weights={weights}
            foundAltRecipes={foundAltRecipes}
            setFoundAltRecipes={setFoundAltRecipes}
          />
        </Form>
      </div>
      <div
        onMouseDown={handleMouseDown}
        className="h-2 bg-gray-400 cursor-row-resize"
      />
      <div
        className={twMerge(
          "bg-gray-200 overflow-auto",
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
            weights={weights}
            setSavedFactory={onChangeFactory}
          />
        )}
      </div>
    </div>
  );
};
