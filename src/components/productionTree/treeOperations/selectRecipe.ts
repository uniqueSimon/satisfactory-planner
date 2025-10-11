import { v4 as uuidv4 } from "uuid";
import { ProductNode, Recipe } from "@/interfaces";

// Always called from leaf
export const selectRecipe = (
  productNodes: ProductNode[],
  id: string,
  buildRecipe: string,
  availableRecipes: Recipe[]
) => {
  const recipe = availableRecipes.find((x) => x.recipeName === buildRecipe)!;
  const node = productNodes.find((x) => x.id === id)!;

  const newChildren = recipe.ingredients.map((ingredient) => {
    const rate = (ingredient.amount / recipe.product.amount) * node.rate;
    return createChild(ingredient.name, rate);
  });

  const updatedNode: ProductNode = {
    ...node,
    buildRecipe,
    children: newChildren.map((c) => c.id),
  };

  return [
    ...productNodes.map((x) => (x.id === id ? updatedNode : x)),
    ...newChildren,
  ];
};

const createChild = (name: string, rate: number): ProductNode => {
  const children = [] as string[];
  const id = uuidv4();
  const type = "NORMAL";
  return { id, name, rate, type, children };
};
