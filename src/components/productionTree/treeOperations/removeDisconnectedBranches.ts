import { ProductNode } from "@/interfaces";

export const removeDisconnectedBranches = (nodes: ProductNode[]) => {
  const remainingNodes: ProductNode[] = [];
  const rootNode = nodes.find((n) => n.type === "ROOT")!;

  const collectNodeWithChildren = (node: ProductNode) => {
    remainingNodes.push(node);
    if (
      node.subRootPointer &&
      !remainingNodes.some((n) => n.id === node.subRootPointer)
    ) {
      const subRoot = nodes.find((n) => n.id === node.subRootPointer)!;
      collectNodeWithChildren(subRoot);
    }
    for (const childId of node.children) {
      const child = nodes.find((n) => n.id === childId)!;
      collectNodeWithChildren(child);
    }
  };

  collectNodeWithChildren(rootNode);

  return remainingNodes;
};
