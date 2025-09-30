import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
import { Cluster, SavedFactory } from "./interfaces";
import { twMerge } from "tailwind-merge";
import { useResizeDrawer } from "./components/factoryDetails/useResizeDrawer";
import { LocalStorage } from "./components/localStorage/LocalStorage";

export const allProducts = allProductsJson;
export const allRecipes = allRecipesJson;
export const productDisplayNameMapping = new Map(
  displayNamesJson as [string, string][]
);

export const App = () => {
  const [foundAltRecipes, setFoundAltRecipes] = useLocalStorage<string[]>(
    "found-alt-recipes",
    []
  );
  const [savedFactories, setSavedFactories] = useLocalStorage<Cluster[]>(
    "saved-factories",
    []
  );
  return (
    <Router>
      <div className="p-4">
        <nav className="mb-4 space-x-4">
          <Link
            to="/satisfactory-planner/"
            className="text-blue-600 hover:underline"
          >
            Home
          </Link>
          <Link
            to="/satisfactory-planner/alt-recipes"
            className="text-blue-600 hover:underline"
          >
            Alternate recipes
          </Link>
          <Link
            to="/satisfactory-planner/local-storage"
            className="text-blue-600 hover:underline"
          >
            Local storage
          </Link>
        </nav>
      </div>

      <Routes>
        <Route
          path="/satisfactory-planner/"
          element={
            <Home
              foundAltRecipes={foundAltRecipes}
              setFoundAltRecipes={setFoundAltRecipes}
              savedFactories={savedFactories}
              setSavedFactories={setSavedFactories}
            />
          }
        />
        <Route
          path="/satisfactory-planner/alt-recipes"
          element={
            <AltRecipes
              foundAltRecipes={foundAltRecipes}
              setFoundAltRecipes={setFoundAltRecipes}
            />
          }
        />
        <Route
          path="/satisfactory-planner/local-storage"
          element={
            <LocalStorage
              foundAltRecipes={foundAltRecipes}
              savedFactories={savedFactories}
              setFoundAltRecipes={setFoundAltRecipes}
              setSavedFactories={setSavedFactories}
            />
          }
        />
      </Routes>
    </Router>
  );
};

const AltRecipes = (props: {
  foundAltRecipes: string[];
  setFoundAltRecipes: (recipes: string[]) => void;
}) => (
  <AlternateRecipes
    foundAltRecipes={props.foundAltRecipes}
    setFoundAltRecipes={props.setFoundAltRecipes}
  />
);

const Home = (props: {
  foundAltRecipes: string[];
  setFoundAltRecipes: (recipes: string[]) => void;
  savedFactories: Cluster[];
  setSavedFactories: (newValue: Cluster[]) => void;
}) => {
  const [clickedFactoryId, setClickedFactoryId] = useState<number | null>(null);
  const [excludedResources, setExcludedResources] = useState([]);

  const combinedSavedFactories = props.savedFactories
    .map((x) => x.factories)
    .flat();
  const selectedSavedSettings = combinedSavedFactories.find(
    (x) => x.id === clickedFactoryId
  );
  const allResources = [...maxRates.keys()];

  const weights = calculateProductWeights(excludedResources);

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
    <div className="flex flex-col h-screen">
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
        {/* <Form>
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
        </Form> */}
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
            weights={weights}
            setSavedFactory={onChangeFactory}
          />
        )}
      </div>
    </div>
  );
};
