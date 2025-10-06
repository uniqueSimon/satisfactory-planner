import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocalStorage } from "./reusableComp/useLocalStorage";
import { AlternateRecipes } from "./components/AlternateRecipes";
import allProductsJson from "./gameData/allProducts.json";
import allRecipesJson from "./gameData/allRecipes.json";
import displayNamesJson from "./gameData/displayNames.json";
import { Cluster } from "./interfaces";
import { LocalStorage } from "./components/localStorage/LocalStorage";
import { NaviagationBar } from "./NavigationBar";
import { Home } from "./Home";

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
    <div className="flex flex-col h-screen">
      <Router>
        <NaviagationBar />
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
              <AlternateRecipes
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
    </div>
  );
};
