import { ProductNode, Recipe } from "@/interfaces";

/** Calculates the rate of the root product if the rate of some ingredient changes. */
export const calculateRootRate = (
  nodes: ProductNode[],
  targetNodeId: string,
  newRate: number,
  availableRecipes: Recipe[]
): number => {
  const currentNode = nodes.find((n) => n.id === targetNodeId)!;
  const parent = nodes.find((n) => n.children.includes(targetNodeId));

  if (parent) {
    const recipe = availableRecipes.find(
      (r) => r.recipeName === parent.buildRecipe
    )!;
    const ingredient = recipe.ingredients.find(
      (x) => x.name === currentNode.name
    )!;
    const parentRate = (recipe.product.amount / ingredient.amount) * newRate;
    return calculateRootRate(nodes, parent.id, parentRate, availableRecipes);
  }
  const leavesWithPointer = nodes.filter(
    (n) => n.subRootPointer === targetNodeId
  );
  if (leavesWithPointer.length > 0) {
    const oldTotalRate = leavesWithPointer.reduce(
      (prev, cur) => prev + cur.rate,
      0
    );
    const firstPointerNode = leavesWithPointer[0];
    const ratio = firstPointerNode.rate / oldTotalRate;
    return calculateRootRate(
      nodes,
      firstPointerNode.id,
      ratio * newRate,
      availableRecipes
    );
  }
  return newRate;
};
