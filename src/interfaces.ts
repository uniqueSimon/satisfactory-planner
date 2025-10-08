export interface Cluster {
  title: string;
  factories: SavedFactory[];
}

export interface SavedFactory {
  id: number;
  productToProduce: string;
  wantedOutputRate: number;
  selectedRecipes: string[];
  dedicatedProducts: string[];
  input: { product: string; rate: number }[];
}

export interface ProductNodeModel {
  id: string;
  name: string;
  rate: number;
  type: "ROOT" | "NORMAL" | "LEAF" | "SUB_ROOT";
  parent?: string;
  children: string[];
  buildRecipe?: string;
}

export interface ProductNodeNested {
  name: string;
  attributes: {
    name: string;
    rate: number;
    buildRecipe?: string;
  };
  children?: ProductNodeNested[];
}
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

export interface TreeResults {
  rate: number;
  machineCount: number;
  recipe?: Recipe;
  type?: "RESOURCE" | "MULTIPLE";
}
