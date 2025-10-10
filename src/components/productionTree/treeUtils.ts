import { v4 as uuidv4 } from "uuid";
import {
  ProductForest,
  ProductNode,
  ProductNodeNested,
  Recipe,
} from "../../interfaces";

export const createChild = (name: string, rate: number): ProductNode => {
  const children = [] as string[];
  const id = uuidv4();
  const type = "LEAF";
  return { id, name, rate, type, children };
};

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

export const onRecipeSelect = (
  id: string,
  buildRecipe: string,
  productNodes: ProductNode[],
  availableRecipes: Recipe[]
) => {
  const idsToRemove = getDescendantIds(productNodes, id);
  const fullRecipe = availableRecipes.find((x) => x.recipeName === buildRecipe);
  const currentNode = productNodes.find((x) => x.id === id)!;
  const newChildren: ProductNode[] =
    fullRecipe?.ingredients.map((ingredient) => {
      const ingredientRate =
        (ingredient.amount / fullRecipe.product.amount) * currentNode.rate;
      return createChild(ingredient.name, ingredientRate);
    }) ?? [];
  return [
    ...productNodes
      .filter((x) => !idsToRemove.includes(x.id))
      .map((x) =>
        x.id === id
          ? {
              ...x,
              buildRecipe,
              children: newChildren.map((x) => x.id),
              type: x.type === "LEAF" ? "NORMAL" : x.type,
            }
          : x
      ),
    ...newChildren,
  ];
};

export const detachSubtree = (
  id: string,
  productNodes: ProductNode[],
  availableRecipes: Recipe[]
) => {
  const current = productNodes.find((p) => p.id === id)!;

  // Check if for that product a subtree already exists
  const existingSubRoot = productNodes.find(
    (p) => p.type === "SUB_ROOT" && p.name === current.name
  );
  if (existingSubRoot) {
    const subRootId = existingSubRoot.id;
    const childrenToRemove = getDescendantIds(productNodes, id);
    const newRate = existingSubRoot.rate + current.rate;
    const newNodes = productNodes
      .filter((p) => !childrenToRemove.includes(p.id))
      .map((p) =>
        p.id === id
          ? convertToPointer(p, subRootId)
          : p.id === subRootId
          ? { ...p, rate: newRate }
          : p
      );
    return recalcDescendantRates(newNodes, availableRecipes, subRootId);
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
  type: "SUB_ROOT_POINTER",
  subRootPointer: pointer,
  buildRecipe: undefined,
  children: [],
});

export const recalcDescendantRates = (
  nodes: ProductNode[],
  availableRecipes: Recipe[],
  nodeId: string
): ProductNode[] => {
  const updatedNodes = [...nodes];
  const node = updatedNodes.find((n) => n.id === nodeId);
  if (!node || !node.buildRecipe) return updatedNodes;

  const recipe = availableRecipes.find(
    (r) => r.recipeName === node.buildRecipe
  )!;

  for (const ingredient of recipe.ingredients) {
    const ingredientRate =
      (ingredient.amount / recipe.product.amount) * node.rate;
    const child = updatedNodes.find(
      (n) => node.children.includes(n.id) && n.name === ingredient.name
    )!;
    child.rate = ingredientRate;

    recalcDescendantRates(updatedNodes, availableRecipes, child.id);
  }

  return updatedNodes;
};
