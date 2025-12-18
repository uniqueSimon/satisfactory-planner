import { v4 as uuidv4 } from "uuid";
import { ProductNode } from "@/interfaces";

export const moveToSubtree = (productNodes: ProductNode[], id: string) => {
  const current = productNodes.find((p) => p.id === id)!;

  // Check if for that product a subtree already exists
  const existingSubRoot = productNodes.find(
    (p) => p.type === "SUB_ROOT" && p.name === current.name
  );
  if (existingSubRoot) {
    return productNodes.map((p) =>
      p.id === id ? convertToPointer(p, existingSubRoot.id) : p
    );
  }

  const subRootId = uuidv4();
  const newSubRoot: ProductNode = {
    ...current,
    id: subRootId,
    type: "SUB_ROOT",
  };
  return [
    ...productNodes.map((p) =>
      p.id === id ? convertToPointer(p, subRootId) : p
    ),
    newSubRoot,
  ];
};

const convertToPointer = (node: ProductNode, pointer: string): ProductNode => ({
  ...node,
  subRootPointer: pointer,
  buildRecipe: undefined,
  children: [],
});
