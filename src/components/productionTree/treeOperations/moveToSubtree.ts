import { v4 as uuidv4 } from "uuid";
import { ProductNode, Recipe } from "@/interfaces";
import { getDescendantIds } from "./common";

export const moveToSubtree = (
  productNodes: ProductNode[],
  id: string,
  availableRecipes: Recipe[]
) => {
  const current = productNodes.find((p) => p.id === id)!;

  // Check if for that product a subtree already exists
  const existingSubRoot = productNodes.find(
    (p) => p.type === "SUB_ROOT" && p.name === current.name
  );
  if (existingSubRoot) {
    return joinToExistingSubTree(
      productNodes,
      current,
      existingSubRoot,
      availableRecipes
    );
  }

  const subRootId = uuidv4();
  const newSubRoot: ProductNode = {
    ...current,
    id: subRootId,
    type: "SUB_ROOT",
  };
  return [
    ...productNodes.map((p) =>
      p.id === id ? convertToPointer(p, subRootId) : p
    ),
    newSubRoot,
  ];
};

const convertToPointer = (node: ProductNode, pointer: string): ProductNode => ({
  ...node,
  subRootPointer: pointer,
  buildRecipe: undefined,
  children: [],
});

const joinToExistingSubTree = (
  productNodes: ProductNode[],
  current: ProductNode,
  subRoot: ProductNode,
  availableRecipes: Recipe[]
) => {
  const subRootId = subRoot.id;
  const childrenToRemove = getDescendantIds(productNodes, current.id);
  const newRate = subRoot.rate + current.rate;
  const newNodes = productNodes
    .filter((p) => !childrenToRemove.includes(p.id))
    .map((p) =>
      p.id === current.id
        ? convertToPointer(p, subRootId)
        : p.id === subRootId
        ? { ...p, rate: newRate }
        : p
    );
  return recalcDescendantRates(newNodes, availableRecipes, subRootId);
};

const recalcDescendantRates = (
  nodes: ProductNode[],
  availableRecipes: Recipe[],
  nodeId: string
): ProductNode[] => {
  const updatedNodes = [...nodes];
  const node = updatedNodes.find((n) => n.id === nodeId);
  if (!node || !node.buildRecipe) return updatedNodes;

  const recipe = availableRecipes.find(
    (r) => r.recipeName === node.buildRecipe
  )!;

  for (const ingredient of recipe.ingredients) {
    const ingredientRate =
      (ingredient.amount / recipe.product.amount) * node.rate;
    const child = updatedNodes.find(
      (n) => node.children.includes(n.id) && n.name === ingredient.name
    )!;
    child.rate = ingredientRate;

    recalcDescendantRates(updatedNodes, availableRecipes, child.id);
  }

  return updatedNodes;
};
