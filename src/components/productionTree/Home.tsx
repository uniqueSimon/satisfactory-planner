import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import Tree, { Point, TreeNodeDatum } from "react-d3-tree";
import { ProductNodeModel, ProductNodeNested, Recipe } from "../../interfaces";
import { buildTree, getDescendantIds, onRecipeSelect } from "./treeUtils";
import { ProductionSetupForm } from "./ProductionSetupForm";
import { ProductNode } from "./ProductNode";
import { ProductTree } from "./ProductTree";

const sampleTree: ProductNodeNested = {
  id: "1",
  name: "IronPlate",
  rate: 60,
  children: [
    {
      id: "2",
      name: "IronPlate",
      rate: 120,
      children: [
        {
          id: "3",
          name: "IronIngot",
          rate: 120,
          children: [],
        },
      ],
    },
    {
      id: "4",
      name: "IronIngot",
      rate: 120,
      children: [
        {
          id: "5",
          name: "OreIron",
          rate: 120,
          children: [],
        },
      ],
    },
  ],
};

export const Home = (props: { availableRecipes: Recipe[] }) => {
  const [productNodes, setProductNodes] = useState<ProductNodeModel[]>([]);
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
        <ProductTree
          data={tree}
          availableRecipes={props.availableRecipes}
          onClearRecipe={onClearRecipe}
          onSelectRecipe={onSelectRecipe}
        />
      )}
    </div>
  );
};
