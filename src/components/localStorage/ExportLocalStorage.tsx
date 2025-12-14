import { Cluster } from "@/interfaces";
import { Button } from "@/components/ui/button";

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
  return <Button onClick={handleClick}>Export local storage</Button>;
};
