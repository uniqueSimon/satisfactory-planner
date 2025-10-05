import { useEffect, useState } from "react";
import { Recipe, TreeResults } from "@/interfaces";
import { Check, Copy } from "lucide-react";
import { Button } from "@/reusableComp/Button";

export const FactoryConfigExport = (props: {
  productToProduce: string;
  wantedOutputRate: number;
  selectedRecipes: string[];
  availableRecipes: Recipe[];
  dedicatedProducts: string[];
}) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => setCopied(false), [props]);

  const factoryRows: string[] = [];

  const dedicatedProductRates = new Map<string, number>();

  const recursion = (product: string, rate: number, isDedicated: boolean) => {
    const recipe = props.availableRecipes.find(
      (x) =>
        x.product.name === product &&
        props.selectedRecipes.includes(x.recipeName)
    );

    const machineCount = recipe
      ? rate / ((recipe.product.amount / recipe.time) * 60)
      : 0;

    if (recipe) {
      const recipeName = recipe.recipeName;
      const producedIn = recipe.producedIn.replace("Mk1", "");

      const rounded_up = Math.ceil(machineCount);
      const base = `${rounded_up} ${producedIn} ${recipeName}`;
      if (rounded_up === machineCount) {
        factoryRows.push(base);
      } else {
        const clock_speed =
          Math.round(((machineCount * 100) / rounded_up) * 10000) / 10000;
        factoryRows.push(`${base} ${clock_speed}`);
      }

      for (const ingredient of recipe.ingredients) {
        const ingredientRate =
          (ingredient.amount / recipe.product.amount) * rate;
        if (props.dedicatedProducts.includes(ingredient.name) && !isDedicated) {
          const existing = dedicatedProductRates.get(ingredient.name);
          dedicatedProductRates.set(
            ingredient.name,
            (existing ?? 0) + ingredientRate
          );
        } else {
          recursion(ingredient.name, ingredientRate, isDedicated);
        }
      }
    }
  };
  recursion(props.productToProduce, props.wantedOutputRate, false);

  for (const product of props.dedicatedProducts) {
    recursion(product, dedicatedProductRates.get(product)!, true);
  }

  const exportString = `/FactorySpawner ${[...factoryRows]
    .reverse()
    .join(", ")}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportString);
    setCopied(true);
  };

  return (
    <div className="flex p-2 gap-2">
      <h2>Export to Factory Spawner</h2>
      <Button onClick={handleCopy}>
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy to Clipboard
          </>
        )}
      </Button>
      <pre className="bg-gray-900 text-gray-100 p-3 rounded-xl overflow-x-auto text-sm whitespace-pre-wrap">
        {exportString}
      </pre>
    </div>
  );
};
