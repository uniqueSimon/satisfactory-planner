import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
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
import { calculateRootRate } from "./treeOperations/calculateRootRate";
import { calculateProductWeights, maxRates } from "@/calculateProductWeights";
import { useLocalStorage } from "@/reusableComp/useLocalStorage";
import { TreeSettings } from "./TreeSettings";
import { reattachSubTree } from "./treeOperations/reattachSubTree";
import { removeDisconnectedBranches } from "./treeOperations/removeDisconnectedBranches";

export const ProductionTree = (props: {
  savedFactory: SavedFactory;
  setProductNodes: (updater: (prev: ProductNode[]) => ProductNode[]) => void;
  setNewProduct: (node: ProductNode) => void;
}) => {
  const { availableRecipes } = useRecipes();
  const nodes = props.savedFactory.productNodes;
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(
    null
  );

  // Use callback ref to properly track when the container is mounted/unmounted
  const containerRef = (node: HTMLDivElement | null) => {
    setContainerElement(node);
  };

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
    props.setNewProduct({
      id: uuidv4(),
      name: product,
      rate: rateOneMachine,
      type: "ROOT",
      children: [],
    });
  };

  const onSetOutputRate = (rate: number) =>
    props.setProductNodes((currentNodes) =>
      updateTreeRates(currentNodes, availableRecipes, rate)
    );

  const onSelectRecipe = (id: string, recipe: string) =>
    props.setProductNodes((currentNodes) =>
      selectRecipe(currentNodes, id, recipe, availableRecipes)
    );

  const onSelectNew = (id: string, recipe: string) =>
    props.setProductNodes((currentNodes) => {
      const cleared = clearRecipe(currentNodes, id);
      return selectRecipe(cleared, id, recipe, availableRecipes);
    });

  const onClearRecipe = (id: string) =>
    props.setProductNodes((currentNodes) => {
      const remainingNodes = clearRecipe(currentNodes, id);
      return removeDisconnectedBranches(remainingNodes);
    });

  const onUpdateRate = (nodeId: string, newRate: number) =>
    props.setProductNodes((currentNodes) => {
      const rootRate = calculateRootRate(
        currentNodes,
        nodeId,
        newRate,
        availableRecipes
      );
      return updateTreeRates(currentNodes, availableRecipes, rootRate);
    });

  const onMoveToSubtree = (id: string) =>
    props.setProductNodes((currentNodes) => {
      const changedStructure = moveToSubtree(currentNodes, id);
      const remainingNodes = removeDisconnectedBranches(changedStructure);
      return updateTreeRates(remainingNodes, availableRecipes);
    });

  const onReattachSubtree = (id: string) =>
    props.setProductNodes((currentNodes) => {
      const newNodes = reattachSubTree(currentNodes, id);
      const remainingNodes = removeDisconnectedBranches(newNodes);
      return updateTreeRates(remainingNodes, availableRecipes);
    });

  const allResources = [...maxRates.keys()];
  const [excludedResources, setExcludedResources] = useLocalStorage<string[]>(
    "excluded-resources",
    []
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
          setRate={onSetOutputRate}
        />
        <ConfigForMod nodes={nodes} />
        <TreeSettings
          resources={allResources}
          excludedResources={excludedResources}
          setExcludedResources={setExcludedResources}
        />
        {forest && (
          <div ref={containerRef} className="relative flex flex-wrap">
            <div className="mb-10">
              <RecursiveTree
                node={forest.mainTree}
                onClearRecipe={onClearRecipe}
                onSelectRecipe={onSelectRecipe}
                onSelectNew={onSelectNew}
                onUpdateRate={onUpdateRate}
                container={containerElement}
                weights={weights}
                onMoveToSubtree={onMoveToSubtree}
                onReattachSubtree={onReattachSubtree}
              />
            </div>
            {forest.subTrees.map((subTree, i) => (
              <div key={i} className="mb-10">
                <RecursiveTree
                  node={subTree}
                  onClearRecipe={onClearRecipe}
                  onSelectRecipe={onSelectRecipe}
                  onSelectNew={onSelectNew}
                  onUpdateRate={onUpdateRate}
                  container={containerElement}
                  weights={weights}
                  onMoveToSubtree={onMoveToSubtree}
                  onReattachSubtree={onReattachSubtree}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
