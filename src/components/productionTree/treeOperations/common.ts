import { ProductNode } from "@/interfaces";

export const getDescendantIds = (
  nodes: ProductNode[],
  nodeId: string
): string[] => {
  const node = nodes.find((n) => n.id === nodeId)!;
  const connectedNodes = [
    ...node.children,
    ...(node.subRootPointer ? [node.subRootPointer] : []),
  ];

  return connectedNodes.flatMap((childId) => [
    childId,
    ...getDescendantIds(nodes, childId),
  ]);
};
