import gameDataRecipes from "./gameDataRecipes.json";
import { recipeSchematicMapping } from "./recipeSchematicMapping";
import { nuclearRecipes, coalRecipes, fuelRecipes } from "./generatorRecipes";
import { productFormMapping } from "./getProductDisplayNames";

export interface Recipe {
  recipeName: string;
  displayName: string;
  product: { name: string; amount: number };
  ingredients: { name: string; amount: number }[];
  time: number;
  isAlternate: boolean;
  producedIn: string;
  tier: number;
}

const ALLOWED_MACHINES = new Set([
  "SmelterMk1",
  "ConstructorMk1",
  "AssemblerMk1",
  "FoundryMk1",
  "ManufacturerMk1",
  "Blender",
  "OilRefinery",
  "Converter",
  "QuantumEncoder",
  "HadronCollider",
  "GeneratorNuclear",
  "GeneratorCoal",
  "GeneratorFuel",
  "Packager",
]);

const EXCLUDED_CATEGORIES = new Set(["Buildings", "Vehicle"]);

const convertRateUnits = (productName: string, rate: number) => {
  const form = productFormMapping.get(productName);
  return form === "RF_LIQUID" || form === "RF_GAS" ? rate / 1000 : rate;
};
const getProductAndAmount = (rawString: string) => {
  const prodMatching =
    /BlueprintGeneratedClass.*\.(?:Desc|BP)_(.*)_C'",Amount=(\d+)/.exec(
      rawString
    );

  if (!prodMatching) {
    throw new Error(`Failed to parse product from: ${rawString}`);
  }

  const [_, name, originalAmount] = prodMatching;
  return { name, amount: convertRateUnits(name, +originalAmount) };
};

const getIngredients = (rawString: string) => {
  const splittedIngredients = rawString.split("),(");
  const ingredients: { name: string; amount: number }[] = [];

  for (const rawIngredient of splittedIngredients) {
    const ingredientMatching =
      /\.(?:Desc|BP)_([A-Za-z_0-9]*)_C'",Amount=(\d+)/.exec(rawIngredient);

    if (ingredientMatching) {
      const [_, name, rateStr] = ingredientMatching;
      ingredients.push({ name, amount: convertRateUnits(name, +rateStr) });
    }
  }

  return ingredients;
};

const shouldIncludeRecipe = (fullName: string): boolean => {
  const categoryMatching =
    /BlueprintGeneratedClass \/Game\/FactoryGame\/(?:Recipes|Equipment)\/(.*)/.exec(
      fullName
    );

  if (!categoryMatching) {
    return false;
  }

  const category = categoryMatching[1];
  return ![...EXCLUDED_CATEGORIES].some((excluded) =>
    category.includes(excluded)
  );
};

const createRecipe = (
  recipeName: string,
  displayName: string,
  products: { name: string; amount: number }[],
  ingredients: { name: string; amount: number }[],
  time: number,
  producedIn: string,
  schematic: { tier: number; isAlternate: boolean }
): Recipe | null => {
  if (products.length === 0) {
    console.warn(`Recipe ${recipeName} has no products`);
    return null;
  }

  if (products.length === 1) {
    return {
      recipeName,
      displayName,
      product: products[0],
      ingredients,
      time,
      producedIn,
      tier: schematic.tier,
      isAlternate: schematic.isAlternate,
    };
  }

  if (products.length === 2) {
    return {
      recipeName,
      displayName,
      product: products[0],
      ingredients: [
        ...ingredients,
        { name: products[1].name, amount: -products[1].amount },
      ],
      time,
      producedIn,
      tier: schematic.tier,
      isAlternate: schematic.isAlternate,
    };
  }

  console.warn(
    `Recipe ${recipeName} has unexpected product count:`,
    products.length
  );
  return null;
};

const allRecipes: Recipe[] = [];

for (const item of gameDataRecipes) {
  const recipeName = item.ClassName.split("_").slice(1, -1).join("_");
  const displayName = item.mDisplayName;
  const fullName = item.FullName;

  if (!shouldIncludeRecipe(fullName)) {
    continue;
  }

  try {
    const ingredients = getIngredients(item.mIngredients);
    const time = +item.mManufactoringDuration;
    const producedIn = item.mProducedIn.split("/")[5];

    if (!ALLOWED_MACHINES.has(producedIn)) {
      continue;
    }

    const splittedProducts = item.mProduct.split("),(");
    const products = splittedProducts.map((product) =>
      getProductAndAmount(product)
    );

    const schematic = recipeSchematicMapping.get(recipeName);
    if (!schematic) {
      console.warn(`No schematic found for recipe: ${recipeName}`);
      continue;
    }

    const recipe = createRecipe(
      recipeName,
      displayName,
      products,
      ingredients,
      time,
      producedIn,
      schematic
    );

    if (recipe) {
      allRecipes.push(recipe);
    }
  } catch (error) {
    console.error(`Error processing recipe ${recipeName}:`, error);
  }
}

allRecipes.push(...nuclearRecipes, ...coalRecipes, ...fuelRecipes);

const extractUniqueProducts = (recipes: Recipe[]): string[] => {
  const productSet = new Set(recipes.map((recipe) => recipe.product.name));
  return Array.from(productSet).sort();
};

const allProducts = extractUniqueProducts(allRecipes);

console.log(
  `Extracted ${allRecipes.length} recipes and ${allProducts.length} unique products`
);

export { allRecipes, allProducts };
