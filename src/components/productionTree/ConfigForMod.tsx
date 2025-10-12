import { ProductNode } from "@/interfaces";
import { useRecipes } from "@/RecipesContext";
import { Button } from "@/reusableComp/Button";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

interface FactoryRow {
  machineCount: number;
  producedIn: string;
  recipeName: string;
  underclock?: number;
}
export const ConfigForMod = (props: { nodes: ProductNode[] }) => {
  const { availableRecipes } = useRecipes();
  const [copied, setCopied] = useState(false);
  useEffect(() => setCopied(false), [props]);

  const factoryRows: FactoryRow[] = [];

  const recursion = (node: ProductNode) => {
    const recipe = availableRecipes.find(
      (x) => x.recipeName === node.buildRecipe
    );
    if (!recipe) return;

    const machineCount = node.buildRecipe
      ? node.rate / ((recipe.product.amount / recipe.time) * 60)
      : 0;
    const producedIn = recipe.producedIn.replace("Mk1", "");
    const recipeName = recipe.recipeName;
    const rounded_up = Math.ceil(machineCount);
    const underclock =
      rounded_up === machineCount
        ? undefined
        : Math.round(((machineCount * 100) / rounded_up) * 10000) / 10000;
    factoryRows.push({
      machineCount: rounded_up,
      producedIn,
      recipeName,
      underclock,
    });

    for (const child of node.children) {
      const childNode = props.nodes.find((n) => n.id === child)!;
      recursion(childNode);
    }
  };

  const root = props.nodes.find((n) => n.type === "ROOT")!;
  const subRoots = props.nodes.filter((n) => n.type === "SUB_ROOT")!;

  recursion(root);
  subRoots.forEach((s) => recursion(s));

  const exportString = `/FactorySpawner ${factoryRows
    .map((x) => {
      const base = `${x.machineCount} ${x.producedIn} ${x.recipeName}`;
      return x.underclock ? `${base} ${x.underclock}` : base;
    })
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
