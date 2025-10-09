import { ProductNodeNested, Recipe } from "@/interfaces";
import { RecipeSelector } from "./RecipeSelector";
import { IconWithTooltip } from "@/reusableComp/IconWithTooltip";

export const ProductNode = (props: {
  productNode: ProductNodeNested;
  availableRecipes: Recipe[];
  onSelectRecipe: (id: string, recipe: string) => void;
  onClearRecipe: (id: string) => void;
}) => {
  const { id, name, buildRecipe } = props.productNode;
  const recipes = props.availableRecipes.filter((x) => x.product.name === name);
  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-2 border border-gray-200 text-center">
      <div className="flex gap-2 items-center">
        <IconWithTooltip item={name} />
      </div>
      <div className="w-full h-0.5 bg-gray-300" />
      <RecipeSelector
        selectedRecipe={buildRecipe}
        availableRecipes={recipes}
        onClear={() => props.onClearRecipe(id)}
        onSelect={(recipe) => props.onSelectRecipe(id, recipe)}
      />
    </div>
  );
};
