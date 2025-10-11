import { ProductNodeNested } from "@/interfaces";
import { RecipeSelected, RecipeToAdd } from "./RecipeSelector";
import { IconWithTooltip } from "@/reusableComp/IconWithTooltip";
import { cn } from "@/lib/utils";
import { useRecipes } from "@/RecipesContext";

export const ProductNode = (props: {
  node: ProductNodeNested;
  onSelectRecipe: (id: string, recipe: string) => void;
  onClearRecipe: (id: string) => void;
  onDetachSubtree: (id: string) => void;
}) => {
  const { availableRecipes } = useRecipes();
  const { id, name, buildRecipe, rate, type, subRootPointer } = props.node;
  const recipes = availableRecipes.filter((x) => x.product.name === name);
  const label = `${rate.toFixed(1)} /min`;
  return (
    <div
      className={cn(
        "flex flex-col items-center bg-white shadow-lg rounded-xl px-2 border border-gray-200 text-center",
        subRootPointer && "bg-gray-300"
      )}
    >
      {(type === "SUB_ROOT" || type === "ROOT") && (
        <div className="text-xs pt-1">{label}</div>
      )}
      <IconWithTooltip item={name} />
      {buildRecipe ? (
        <RecipeSelected
          nodeType={props.node.type}
          selectedRecipe={buildRecipe}
          availableRecipes={recipes}
          onClear={() => props.onClearRecipe(id)}
          onDetachSubtree={() => props.onDetachSubtree(id)}
        />
      ) : subRootPointer || recipes.length === 0 ? null : (
        <RecipeToAdd
          availableRecipes={recipes}
          onSelect={(recipe) => props.onSelectRecipe(id, recipe)}
        />
      )}
    </div>
  );
};
