import { v4 as uuidv4 } from "uuid";
import { ProductNode } from "@/interfaces";

export const reattachSubTree = (productNodes: ProductNode[], id: string) => {
  const pointers = productNodes.filter((p) => p.subRootPointer === id)!;
  const subRoot = productNodes.find((n) => n.id === id)!;

  const nodesToAdd: ProductNode[] = [];

  for (const pointer of pointers) {
    const newNodes = setNewChildIds(
      pointer.id,
      { ...subRoot, type: "NORMAL" },
      productNodes
    );
    nodesToAdd.push(...newNodes);
  }

  return [
    ...productNodes.filter((n) => n.subRootPointer !== id),
    ...nodesToAdd,
  ];
};

const setNewChildIds = (
  pointerId: string,
  subRoot: ProductNode,
  productNodes: ProductNode[]
) => {
  const newNodes: ProductNode[] = [];

  const changeNodeIdRecursively = (node: ProductNode, newId: string) => {
    const newChildIds: string[] = [];
    for (const childId of node.children) {
      const childNode = productNodes.find((node) => node.id === childId)!;
      const newChildId = uuidv4();
      newChildIds.push(newChildId);
      changeNodeIdRecursively(childNode, newChildId);
    }
    newNodes.push({ ...node, id: newId, children: newChildIds });
  };

  changeNodeIdRecursively(subRoot, pointerId);

  return newNodes;
};
