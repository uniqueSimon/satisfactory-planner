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

export type NodeType =
  | "ROOT"
  | "NORMAL"
  | "LEAF"
  | "SUB_ROOT"
  | "SUB_ROOT_POINTER";

interface ProductNodeCommon {
  id: string;
  name: string;
  rate: number;
  type: NodeType;
  buildRecipe?: string;
  subRootPointer?: string;
}
export interface ProductNode extends ProductNodeCommon {
  children: string[];
}

export interface ProductForest {
  mainTree: ProductNodeNested;
  subTrees: ProductNodeNested[];
}

export interface ProductNodeNested extends ProductNodeCommon {
  children: ProductNodeNested[];
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
