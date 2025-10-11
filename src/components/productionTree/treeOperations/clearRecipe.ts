import { ProductNode } from "@/interfaces";
import { getDescendantIds } from "./common";

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
  type: n.type === "ROOT" ? "ROOT" : "LEAF",
  children: [],
});
