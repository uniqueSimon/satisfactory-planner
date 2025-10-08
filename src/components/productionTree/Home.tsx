import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import Tree from "react-d3-tree";
import { ProductNodeModel, ProductNodeNested, Recipe } from "../../interfaces";
import { buildTree, getDescendantIds, onRecipeSelect } from "./treeUtils";
import { ProductionSetupForm } from "./ProductionSetupForm";
import { ProductNode } from "./ProductNode";

export const Home = (props: { availableRecipes: Recipe[] }) => {
  const [productNodes, setProductNodes] = useState<ProductNodeModel[]>([]);
  console.log("productNodes", productNodes);
  const tree = productNodes.length > 0 ? buildTree(productNodes) : null;

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
  const handleSelectRecipe = (id: string, recipe: string) => {
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
        <Tree
          data={tree}
          translate={{ x: 400, y: 300 }}
          orientation="vertical"
          renderCustomNodeElement={({ nodeDatum }) => (
            <ProductNode
              nodeDatum={nodeDatum as unknown as ProductNodeNested}
              availableRecipes={props.availableRecipes}
              handleSelectRecipe={handleSelectRecipe}
              onClearRecipe={onClearRecipe}
            />
          )}
          collapsible={false}
        />
      )}
    </div>
  );
};
