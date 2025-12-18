import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocalStorage } from "./reusableComp/useLocalStorage";
import { AlternateRecipes } from "./components/AlternateRecipes";
import allProductsJson from "./gameData/allProducts.json";
import allRecipesJson from "./gameData/allRecipes.json";
import displayNamesJson from "./gameData/displayNames.json";
import { Cluster } from "./interfaces";
import { LocalStorage } from "./components/localStorage/LocalStorage";
import { NaviagationBar } from "./NavigationBar";
import { RecipesProvider } from "./RecipesContext";
import { Home } from "./Home";
import { DirtyStateProvider } from "./DirtyStateContext";

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
  return (
    <div className="flex flex-col h-screen">
      <Router>
        <RecipesProvider>
          <DirtyStateProvider>
            <NaviagationBar />
            <Routes>
              <Route
                path="/satisfactory-planner/"
                element={
                  <Home
                    savedFactories={savedFactories}
                    setSavedFactories={setSavedFactories}
                  />
                }
              />
              <Route
                path="/satisfactory-planner/alt-recipes"
                element={<AlternateRecipes />}
              />
              <Route
                path="/satisfactory-planner/local-storage"
                element={
                  <LocalStorage
                    savedFactories={savedFactories}
                    setSavedFactories={setSavedFactories}
                  />
                }
              />
            </Routes>
          </DirtyStateProvider>
        </RecipesProvider>
      </Router>
    </div>
  );
};
