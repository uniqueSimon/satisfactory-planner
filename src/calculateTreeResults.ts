import { Recipe, TreeResults } from "./interfaces";

export const calculateTreeResults = (
  productToProduce: string,
  wantedOutputRate: number,
  selectedRecipes: string[],
  availableRecipes: Recipe[],
) => {
  const productRates = new Map<string, TreeResults>();
  
  const recursion = (product: string, rate: number) => {
    const recipe = availableRecipes.find(
      (x) =>
        x.product.name === product && selectedRecipes.includes(x.recipeName)
    );

    const numberOfMachines = recipe
      ? rate / ((recipe.product.amount / recipe.time) * 60)
      : 0;

    const existingProd = productRates.get(product);
    existingProd
      ? productRates.set(product, {
          ...existingProd,
          rate: existingProd.rate + rate,
          machineCount: existingProd.machineCount + numberOfMachines,
          type: recipe ? "MULTIPLE" : "RESOURCE",
        })
      : productRates.set(product, {
          rate,
          recipe: recipe,
          machineCount: numberOfMachines,
          type: recipe ? undefined : "RESOURCE",
        });

    if (recipe) {
      for (const ingredient of recipe.ingredients) {
        const ingredientRate =
          (ingredient.amount / recipe.product.amount) * rate;
        recursion(ingredient.name, ingredientRate);
      }
    }
  };
  recursion(productToProduce, wantedOutputRate);

  return productRates;
};
