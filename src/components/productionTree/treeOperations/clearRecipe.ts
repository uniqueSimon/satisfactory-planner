import { ProductNode } from "@/interfaces";

export const clearRecipe = (
  productNodes: ProductNode[],
  id: string
): ProductNode[] => {
  const idsToRemove = getDescendantIds(productNodes, id);

  return productNodes
    .filter((n) => !idsToRemove.includes(n.id))
    .map((n) => (n.id === id ? updateNode(n) : n));
};

const updateNode = (n: ProductNode): ProductNode => ({
  ...n,
  buildRecipe: undefined,
  children: [],
});

const getDescendantIds = (
  nodes: ProductNode[],
  nodeId: string
): string[] => {
  const node = nodes.find((n) => n.id === nodeId)!;
  return node.children.flatMap((childId) => [
    childId,
    ...getDescendantIds(nodes, childId),
  ]);
};
