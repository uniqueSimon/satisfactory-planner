import { ProductNode } from "@/interfaces";
import { getDescendantIds } from "./common";

export const clearRecipe = (
  productNodes: ProductNode[],
  id: string
): ProductNode[] => {
  const idsToRemove = getDescendantIds(productNodes, id);

  const current = productNodes.find((p) => p.id === id)!;

  if (current.type === "SUB_ROOT") {
    return deleteSubRoot(productNodes, current);
  }
  return productNodes
    .filter((n) => !idsToRemove.includes(n.id))
    .map((n) => (n.id === id ? updateNode(n) : n));
};

const updateNode = (n: ProductNode): ProductNode => ({
  ...n,
  buildRecipe: undefined,
  children: [],
});

/** delete sub-root and remove its pointers */
const deleteSubRoot = (productNodes: ProductNode[], current: ProductNode) => {
  const idsToRemove = getDescendantIds(productNodes, current.id);
  const withCurrent = [...idsToRemove, current.id];
  const pointers = productNodes.filter((p) => p.subRootPointer === current.id)!;
  return productNodes
    .filter((n) => !withCurrent.includes(n.id))
    .map((n) =>
      pointers.some((p) => p.id === n.id)
        ? { ...n, subRootPointer: undefined }
        : n
    );
};
