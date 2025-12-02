import { ProductNode, Recipe } from "@/interfaces";

export const updateTreeRates = (
  nodes: ProductNode[],
  rate: number,
  rootNode: ProductNode,
  availableRecipes: Recipe[]
): ProductNode[] => {
  const updatedNodes: ProductNode[] = [];

  const updateNodeRate = (rate: number, node: ProductNode) => {
    updatedNodes.push({ ...node, rate });

    if (node.subRootPointer) {
      const subRoot = nodes.find((n) => n.id === node.subRootPointer)!;
      const existing = updatedNodes.find((n) => n.id === node.subRootPointer);
      const currentRate = existing?.rate ?? 0;
      updateNodeRate(currentRate + rate, subRoot);
      return;
    } else if (node.children.length === 0) return;

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

  updateNodeRate(rate, rootNode);

  return removeDuplicates(updatedNodes);
};

const removeDuplicates = (nodes: ProductNode[]) => {
  const uniqueByHighestRate = Object.values(
    nodes.reduce((acc, obj) => {
      // if not seen yet or has higher rate, store this object
      if (!acc[obj.id] || obj.rate > acc[obj.id].rate) {
        acc[obj.id] = obj;
      }
      return acc;
    }, {} as Record<string, ProductNode>)
  );
  return uniqueByHighestRate;
};
