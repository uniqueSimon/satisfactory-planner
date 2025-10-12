import { ProductNode } from "@/interfaces";
import { useRecipes } from "@/RecipesContext";
import { Button } from "@/reusableComp/Button";
import { Collapse } from "@/reusableComp/Collapse";
import { Check, ClipboardPlus } from "lucide-react";
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
    <Collapse
      title={
        <div className="flex items-center gap-2">
          <div>Export to Factory Spawner</div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
          >
            {copied ? <Check /> : <ClipboardPlus />}
          </Button>
        </div>
      }
    >
      <pre className="bg-gray-900 text-gray-100 p-3 rounded-xl overflow-x-auto text-sm whitespace-pre-wrap">
        {exportString}
      </pre>
    </Collapse>
  );
};
