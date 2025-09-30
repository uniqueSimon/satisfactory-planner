import { Cluster } from "@/interfaces";
import { ExportLocalStorage } from "./ExportLocalStorage";
import { ImportLocalStorage } from "./ImportLocalStorage";

export const LocalStorage = (props: {
  savedFactories: Cluster[];
  setSavedFactories: (newValue: Cluster[]) => void;
  foundAltRecipes: string[];
  setFoundAltRecipes: (recipes: string[]) => void;
}) => (
  <div className="flex">
    <ExportLocalStorage
      foundAltRecipes={props.foundAltRecipes}
      savedFactories={props.savedFactories}
    />
    <ImportLocalStorage
      setFoundAltRecipes={props.setFoundAltRecipes}
      setSavedFactories={props.setSavedFactories}
    />
  </div>
);
