import { v4 as uuidv4 } from "uuid";
import { ProductNodeModel, ProductNodeNested, Recipe } from "../../interfaces";

export const createChild = (
  name: string,
  rate: number,
  parent: string
): ProductNodeModel => {
  const children = [] as string[];
  const id = uuidv4();
  const type = "LEAF";
  return { id, name, rate, type, children, parent };
};

export const getDescendantIds = (
  nodes: ProductNodeModel[],
  nodeId: string
): string[] => {
  const children = nodes.filter((n) => n.parent === nodeId);
  return children.flatMap((child) => [
    child.id,
    ...getDescendantIds(nodes, child.id),
  ]);
};

export const buildTree = (nodes: ProductNodeModel[]): ProductNodeNested => {
  const root = nodes.find((n) => n.type === "ROOT")!;

  const build = (node: ProductNodeModel): ProductNodeNested => ({
    ...node,
    children: node.children.map((cid) => {
      const childNode = nodes.find((n) => n.id === cid)!;
      return build(childNode);
    }),
  });

  return build(root);
};

export const onRecipeSelect = (
  id: string,
  buildRecipe: string,
  productNodes: ProductNodeModel[],
  availableRecipes: Recipe[]
) => {
  const idsToRemove = getDescendantIds(productNodes, id);
  const fullRecipe = availableRecipes.find((x) => x.recipeName === buildRecipe);
  const currentNode = productNodes.find((x) => x.id === id)!;
  const newChildren: ProductNodeModel[] =
    fullRecipe?.ingredients.map((ingredient) => {
      const ingredientRate =
        (ingredient.amount / fullRecipe.product.amount) * currentNode.rate;
      return createChild(ingredient.name, ingredientRate, id);
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
