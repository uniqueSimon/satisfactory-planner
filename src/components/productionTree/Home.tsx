import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import Tree, { Point, TreeNodeDatum } from "react-d3-tree";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });

  useEffect(() => {
    // wait for tree to render
    const svg = containerRef.current?.querySelector("svg");
    if (!svg) return;

    const g = svg.querySelector("g");
    if (!g) return;

    const box = g.getBBox();
    const padding = 100;

    const width = box.width; // + padding * 2;
    const height = box.height; // + padding * 2;

    setDimensions({ width, height });
  }, [productNodes]);

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
        <div
          ref={containerRef}
          className="inline-block border rounded-lg bg-gray-50"
          style={{
            width: dimensions.width,
            height: dimensions.height,
          }}
        >
          <Tree
            ref={treeRef}
            data={tree}
            zoomable={false}
            draggable={false}
            translate={{ x: 80, y: 50 }}
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
        </div>
      )}
    </div>
  );
};
