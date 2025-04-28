import { Cluster } from "@/interfaces";
import { twMerge } from "tailwind-merge";

export const ImportLocalStorage = (props: {
  setSavedFactories: (savedFactories: Cluster[]) => void;
  setFoundAltRecipes: (foundAltRecipes: string[]) => void;
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = JSON.parse(e.target!.result as string);
        props.setSavedFactories(json.savedFactories);
        props.setFoundAltRecipes(json.foundAltRecipes);
      };
      reader.readAsText(file);
    }
  };
  return (
    <div className="group relative cursor-pointer">
      <label
        htmlFor="file-upload"
        className={twMerge(
          "bg-white text-black border-gray-300 border-1 px-3 py-1 rounded-lg shadow-md",
          "hover:text-blue-500 hover:border-blue-500 hover:shadow-lg",
          "transition-all duration-300"
        )}
      >
        Upload File
      </label>
      <input
        id="file-upload"
        className="hidden"
        type="file"
        accept=".json"
        onChange={handleFileUpload}
      />
      <div
        className={twMerge(
          "absolute text-center max-w-48 text-wrap left-1/2 bottom-full mb-2 w-max -translate-x-1/2 transform rounded-lg bg-gray-800 p-2 text-sm text-white transition-all",
          "opacity-0 scale-0 group-hover:scale-100 group-hover:opacity-100"
        )}
      >
        Imports saved factories and found alternate recipes from a json-file
      </div>
    </div>
  );
};
