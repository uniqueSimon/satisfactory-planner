import { ProductNode } from "@/interfaces";

export const getDescendantIds = (
  nodes: ProductNode[],
  nodeId: string
): string[] => {
  const node = nodes.find((n) => n.id === nodeId);
  return node
    ? node.children.flatMap((childId) => [
        childId,
        ...getDescendantIds(nodes, childId),
      ])
    : [];
};
