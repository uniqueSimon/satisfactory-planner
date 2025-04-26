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
import { Cluster } from "./interfaces";

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
  const [clickedFactoryId, setClickedFactoryId] = useState<number>();
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
  return (
    <div className="border-solid p-10 rounded-md bg-white">
      <Typography.Title>Satisfactory Production Optimizer</Typography.Title>
      <Form>
        <ExportLocalStorage
          foundAltRecipes={foundAltRecipes}
          savedFactories={savedFactories}
        />
        <ImportLocalStorage
          setFoundAltRecipes={setFoundAltRecipes}
          setSavedFactories={setSavedFactories}
        />
        <FactoryPlanner
          clickedFactoryId={clickedFactoryId}
          savedFactories={savedFactories}
          setClickedFactoryId={setClickedFactoryId}
          setSavedFactories={setSavedFactories}
        />
        {selectedSavedSettings && (
          <FactoryDetails
            availableRecipes={availableRecipes}
            savedFactory={selectedSavedSettings}
            weights={weights}
            setSavedFactory={(savedFactory) =>
              setSavedFactories(
                savedFactories.map((cluster) => ({
                  ...cluster,
                  factories: cluster.factories.map((factory) =>
                    factory.id === clickedFactoryId ? savedFactory : factory
                  ),
                }))
              )
            }
          />
        )}
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
  );
};
