import React, { createContext, useContext, ReactNode } from "react";
import { Recipe } from "@/interfaces";
import { useLocalStorage } from "./reusableComp/useLocalStorage";
import allRecipesJson from "./gameData/allRecipes.json";

interface RecipesContextType {
  availableRecipes: Recipe[];
  foundAltRecipes: string[];
  setFoundAltRecipes: React.Dispatch<React.SetStateAction<string[]>>;
}

const allRecipes = allRecipesJson;

const RecipesContext = createContext<RecipesContextType | undefined>(undefined);

export const RecipesProvider = (props: { children: ReactNode }) => {
  const [foundAltRecipes, setFoundAltRecipes] = useLocalStorage<string[]>(
    "found-alt-recipes",
    []
  );
  const availableRecipes = allRecipes.filter(
    (x) => !x.isAlternate || foundAltRecipes.includes(x.recipeName)
  );

  return (
    <RecipesContext.Provider
      value={{ foundAltRecipes, availableRecipes, setFoundAltRecipes }}
    >
      {props.children}
    </RecipesContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipesProvider");
  }
  return context;
};
