import { ProductNode, Recipe } from "@/interfaces";

export const updateTreeRates = (
  nodes: ProductNode[],
  availableRecipes: Recipe[],
  rate?: number
): ProductNode[] => {
  const updatedNodes: ProductNode[] = [];

  // Lists the sub roots with the number of pointers to them.
  const subRootConnections = new Map<string, number>();

  for (const node of nodes) {
    if (node.subRootPointer) {
      const existing = subRootConnections.get(node.subRootPointer);
      subRootConnections.set(node.subRootPointer, (existing ?? 0) + 1);
    }
  }

  const updateNodeRate = (rate: number, node: ProductNode) => {
    updatedNodes.push({ ...node, rate });

    if (node.subRootPointer) {
      const numberOfConnections = subRootConnections.get(node.subRootPointer)!;

      // Only process the subRoot if every pointer to it has been processed.
      // That way, the subRoot rate is known.
      if (numberOfConnections === 1) {
        const subRootRate = updatedNodes
          .filter((n) => n.subRootPointer === node.subRootPointer)
          .reduce((prev, cur) => prev + cur.rate, 0);
        const subRoot = nodes.find((n) => n.id === node.subRootPointer)!;
        updateNodeRate(subRootRate, subRoot);
        return;
      }
      subRootConnections.set(node.subRootPointer, numberOfConnections - 1);
      return;
    }

    if (node.children.length === 0) return;

    const recipe = availableRecipes.find(
      (r) => r.recipeName === node.buildRecipe
    )!;

    for (const childId of node.children) {
      const childNode = nodes.find((n) => n.id === childId)!;

      const ingredient = recipe.ingredients.find(
        (x) => x.name === childNode.name
      )!;

      const ingredientRate = (ingredient.amount / recipe.product.amount) * rate;
      updateNodeRate(ingredientRate, childNode);
    }
  };

  const rootNode = nodes.find((n) => n.type === "ROOT")!;
  updateNodeRate(rate ?? rootNode.rate, rootNode);

  return updatedNodes;
};
