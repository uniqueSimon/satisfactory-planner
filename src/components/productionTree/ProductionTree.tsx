import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import { ProductNode, SavedFactory } from "../../interfaces";
import { ProductionSetupForm } from "./ProductionSetupForm";
import { RecursiveTree } from "./RecursiveTree";
import { buildTree } from "./treeOperations/buildTree";
import { selectRecipe } from "./treeOperations/selectRecipe";
import { clearRecipe } from "./treeOperations/clearRecipe";
import { moveToSubtree } from "./treeOperations/moveToSubtree";
import { useRecipes } from "@/RecipesContext";
import { ConfigForMod } from "./ConfigForMod";
import { updateTreeRates } from "./treeOperations/updateTreeRates";
import { calculateProductWeights, maxRates } from "@/calculateProductWeights";
import { useLocalStorage } from "@/reusableComp/useLocalStorage";
import { WeightingPoints } from "./WeightingPoints";

export const ProductionTree = (props: {
  savedFactory: SavedFactory;
  setProductNodes: (nodes: ProductNode[]) => void;
}) => {
  const { availableRecipes } = useRecipes();
  const nodes = props.savedFactory.productNodes;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const root = nodes.find((node) => node.type === "ROOT");

  const forest = nodes.length > 0 && root?.name ? buildTree(nodes) : null;

  const rootRecipe = root?.buildRecipe
    ? availableRecipes.find((r) => r.recipeName === root.buildRecipe)
    : undefined;

  const setProductToProduce = (product: string) => {
    const baseRecipe = availableRecipes.find(
      (r) => r.product.name === product && !r.isAlternate
    )!;
    const rateOneMachine = (baseRecipe.product.amount / baseRecipe.time) * 60;
    props.setProductNodes([
      {
        id: uuidv4(),
        name: product,
        rate: rateOneMachine,
        type: "ROOT",
        children: [],
      },
    ]);
  };
  const setOutputRate = (rate: number) => {
    const updated = updateTreeRates(nodes, rate, root!, availableRecipes);
    props.setProductNodes(updated);
  };
  const onSelectRecipe = (id: string, recipe: string) => {
    const updated = selectRecipe(nodes, id, recipe, availableRecipes);
    props.setProductNodes(updated);
  };
  const onClearRecipe = (id: string) => {
    const updated = clearRecipe(nodes, id);
    props.setProductNodes(updated);
  };
  const onDetachSubtree = (id: string) => {
    const updated = moveToSubtree(nodes, id, availableRecipes);
    props.setProductNodes(updated);
  };

  const allResources = [...maxRates.keys()];
  const [excludedResources, setExcludedResources] = useLocalStorage<string[]>(
    "excluded-resources",
    []
  );
  const [showWeights, setShowWeights] = useLocalStorage<boolean>(
    "showWeights",
    false
  );
  const weights = calculateProductWeights(excludedResources);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="w-full bg-gray-50">
        <ProductionSetupForm
          product={root?.name ?? ""}
          rate={root?.rate ?? 0}
          rootRecipe={rootRecipe}
          setProduct={setProductToProduce}
          setRate={setOutputRate}
        />
        <WeightingPoints
          showWeights={showWeights}
          setShowWeights={setShowWeights}
          resources={allResources}
          value={excludedResources}
          onChange={setExcludedResources}
        />
        <ConfigForMod nodes={nodes} />
        {forest && (
          <div ref={containerRef} className="relative flex flex-wrap">
            <div className="mb-10">
              <RecursiveTree
                node={forest.mainTree}
                onClearRecipe={onClearRecipe}
                onSelectRecipe={onSelectRecipe}
                onDetachSubtree={onDetachSubtree}
                container={containerRef.current}
                weights={weights}
                showWeights={showWeights}
              />
            </div>
            {forest.subTrees.map((subTree, i) => (
              <div key={i} className="mb-10">
                <RecursiveTree
                  node={subTree}
                  onClearRecipe={onClearRecipe}
                  onSelectRecipe={onSelectRecipe}
                  onDetachSubtree={onDetachSubtree}
                  container={containerRef.current}
                  weights={weights}
                  showWeights={showWeights}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
