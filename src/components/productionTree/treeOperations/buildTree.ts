import { ProductForest, ProductNode, ProductNodeNested } from "@/interfaces";

export const buildTree = (nodes: ProductNode[]): ProductForest => {
  const root = nodes.find((n) => n.type === "ROOT")!;
  const subRoots = nodes.filter((n) => n.type === "SUB_ROOT")!;

  const build = (node: ProductNode): ProductNodeNested => ({
    ...node,
    children: node.children.map((cid) => {
      const childNode = nodes.find((n) => n.id === cid)!;
      return build(childNode);
    }),
  });

  const mainTree = build(root);
  const subTrees = subRoots.map((s) => build(s));

  return { mainTree, subTrees };
};
