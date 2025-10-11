import { v4 as uuidv4 } from "uuid";
import { useRef, useState } from "react";
import { ProductNode, Recipe } from "../../interfaces";
import { ProductionSetupForm } from "./ProductionSetupForm";
import { RecursiveTree } from "./RecursiveTree";
import { buildTree } from "./treeOperations/buildTree";
import { selectRecipe } from "./treeOperations/selectRecipe";
import { clearRecipe } from "./treeOperations/clearRecipe";
import { moveToSubtree } from "./treeOperations/moveToSubtree";
import { useRecipes } from "@/RecipesContext";

export const ProductionTree = () => {
  const { availableRecipes } = useRecipes();
  const [productNodes, setProductNodes] = useState<ProductNode[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const forest = productNodes.length > 0 ? buildTree(productNodes) : null;

  const root = productNodes.find((node) => node.type === "ROOT");
  const rootRecipe = root?.buildRecipe
    ? availableRecipes.find((r) => r.recipeName === root.buildRecipe)
    : undefined;

  const setProductToProduce = (product: string) => {
    const baseRecipe = availableRecipes.find(
      (r) => r.product.name === product && !r.isAlternate
    )!;
    const rateOneMachine = (baseRecipe.product.amount / baseRecipe.time) * 60;
    setProductNodes([
      {
        id: uuidv4(),
        name: product,
        rate: rateOneMachine,
        type: "ROOT",
        children: [],
      },
    ]);
  };
  const setOutputRate = (rate: number) =>
    setProductNodes((prev) => {
      const root = prev.find((p) => p.type === "ROOT")!;
      const oldRate = root.rate;
      const increase = rate / oldRate;
      return prev.map((x) => ({ ...x, rate: x.rate * increase }));
    });
  const onSelectRecipe = (id: string, recipe: string) => {
    setProductNodes((prev) => selectRecipe(prev, id, recipe, availableRecipes));
  };
  const onClearRecipe = (id: string) => {
    setProductNodes((prev) => clearRecipe(prev, id));
  };
  const onDetachSubtree = (id: string) => {
    setProductNodes((prev) => moveToSubtree(prev, id, availableRecipes));
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
      {forest && (
        <div ref={containerRef} className="relative flex">
          <div>
            <RecursiveTree
              node={forest.mainTree}
              onClearRecipe={onClearRecipe}
              onSelectRecipe={onSelectRecipe}
              onDetachSubtree={onDetachSubtree}
              container={containerRef.current}
            />
          </div>
          {forest.subTrees.map((subTree, i) => (
            <div key={i}>
              <RecursiveTree
                node={subTree}
                onClearRecipe={onClearRecipe}
                onSelectRecipe={onSelectRecipe}
                onDetachSubtree={onDetachSubtree}
                container={containerRef.current}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
