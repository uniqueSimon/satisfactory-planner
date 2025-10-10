import { ProductNodeNested, Recipe } from "@/interfaces";
import { RecipeSelected, RecipeToAdd } from "./RecipeSelector";
import { IconWithTooltip } from "@/reusableComp/IconWithTooltip";

export const ProductNode = (props: {
  node: ProductNodeNested;
  availableRecipes: Recipe[];
  onSelectRecipe: (id: string, recipe: string) => void;
  onClearRecipe: (id: string) => void;
}) => {
  const { id, name, buildRecipe } = props.node;
  const recipes = props.availableRecipes.filter((x) => x.product.name === name);
  return (
    <div className="flex flex-col items-center bg-white shadow-lg rounded-xl px-2 border border-gray-200 text-center">
      <IconWithTooltip item={name} />
      <div className="w-full h-0.5 mb-1 bg-gray-400" />
      {!buildRecipe ? (
        <RecipeToAdd
          availableRecipes={recipes}
          onSelect={(recipe) => props.onSelectRecipe(id, recipe)}
        />
      ) : (
        <RecipeSelected
          selectedRecipe={buildRecipe}
          availableRecipes={recipes}
          onClear={() => props.onClearRecipe(id)}
        />
      )}
    </div>
  );
};
