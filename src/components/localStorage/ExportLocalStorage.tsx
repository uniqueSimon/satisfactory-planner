import { Cluster } from "@/interfaces";
import { Button } from "@/reusableComp/Button";
import { twMerge } from "tailwind-merge";

const exportJson = (json: {
  savedFactories: Cluster[];
  foundAltRecipes: string[];
}) => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(json)
  )}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "data.json";
  link.click();
};

export const ExportLocalStorage = (props: {
  savedFactories: Cluster[];
  foundAltRecipes: string[];
}) => {
  const handleClick = () => exportJson(props);
  return (
    <Button onClick={handleClick}>
      <div className="group relative cursor-pointer">
        Export local storage
        <div
          className={twMerge(
            "absolute max-w-48 text-wrap left-1/2 bottom-full mb-2 w-max -translate-x-1/2 transform rounded-lg bg-gray-800 p-2 text-sm text-white transition-all",
            "opacity-0 scale-0 group-hover:scale-100 group-hover:opacity-100"
          )}
        >
          Stores saved factories and found alternate recipes in a json-file
        </div>
      </div>
    </Button>
  );
};
