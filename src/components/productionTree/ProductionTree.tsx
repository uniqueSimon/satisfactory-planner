import { v4 as uuidv4 } from "uuid";
import { useRef, useState } from "react";
import { ProductNodeModel, Recipe } from "../../interfaces";
import { buildTree, getDescendantIds, onRecipeSelect } from "./treeUtils";
import { ProductionSetupForm } from "./ProductionSetupForm";
import { RecursiveTree } from "./RecursiveTree";

export const ProductionTree = (props: { availableRecipes: Recipe[] }) => {
  const [productNodes, setProductNodes] = useState<ProductNodeModel[]>([]);
  const tree = productNodes.length > 0 ? buildTree(productNodes) : null;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const root = productNodes.find((node) => node.type === "ROOT");
  const rootRecipe = root?.buildRecipe
    ? props.availableRecipes.find((r) => r.recipeName === root.buildRecipe)
    : undefined;

  const setProductToProduce = (product: string) =>
    setProductNodes([
      { id: uuidv4(), name: product, rate: 60, type: "ROOT", children: [] },
    ]);
  const setOutputRate = (rate: number) =>
    setProductNodes((prev) => {
      const root = prev.find((p) => p.type === "ROOT")!;
      const oldRate = root.rate;
      const increase = rate / oldRate;
      return prev.map((x) => ({ ...x, rate: x.rate * increase }));
    });
  const onSelectRecipe = (id: string, recipe: string) => {
    setProductNodes((prev) =>
      onRecipeSelect(id, recipe, prev, props.availableRecipes)
    );
  };
  const onClearRecipe = (id: string) => {
    const idsToRemove = getDescendantIds(productNodes, id);
    setProductNodes((prev) =>
      prev
        .filter((n) => !idsToRemove.includes(n.id))
        .map((n) =>
          n.id === id
            ? {
                ...n,
                buildRecipe: undefined,
                type: n.type === "ROOT" ? "ROOT" : "LEAF",
                children: [],
              }
            : n
        )
    );
  };
  return (
    <div className="w-full bg-gray-50">
      <ProductionSetupForm
        product={root?.name ?? ""}
        rate={root?.rate ?? 0}
        rootRecipe={rootRecipe}
        setProduct={setProductToProduce}
        setRate={setOutputRate}
      />
      {tree && (
        <div ref={containerRef} className="relative">
          <RecursiveTree
            node={tree}
            availableRecipes={props.availableRecipes}
            onClearRecipe={onClearRecipe}
            onSelectRecipe={onSelectRecipe}
            container={containerRef.current}
          />
        </div>
      )}
    </div>
  );
};
