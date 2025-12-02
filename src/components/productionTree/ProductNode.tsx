import { ProductNodeNested, Weights } from "@/interfaces";
import { RecipeSelected, RecipeToAdd } from "./RecipeSelector";
import { IconWithTooltip } from "@/reusableComp/IconWithTooltip";
import { cn } from "@/lib/utils";
import { useRecipes } from "@/RecipesContext";

export const ProductNode = (props: {
  node: ProductNodeNested;
  weights: Weights;
  showWeights: boolean;
  onSelectRecipe: (id: string, recipe: string) => void;
  onClearRecipe: (id: string) => void;
  onDetachSubtree: (id: string) => void;
}) => {
  const { availableRecipes } = useRecipes();
  const { id, name, buildRecipe, rate, type, subRootPointer } = props.node;
  const recipes = availableRecipes.filter((x) => x.product.name === name);
  const label = `${rate.toFixed(1)} /min`;

  const productWeights = props.weights.get(name);
  const minWeight = productWeights
    ? Math.min(...productWeights.map((x) => x.weight))
    : Infinity;
  const productWeight = props.weights.get(name)!;

  const recipesWithWeights = recipes.map((recipe) => ({
    recipe,
    weight: productWeight.find((x) => x.recipeName === recipe.recipeName)!
      .weight,
  }));
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
      {props.showWeights && (
        <div className="text-xs pt-1">({(minWeight * rate).toFixed(1)})</div>
      )}
      <IconWithTooltip item={name} />
      {buildRecipe ? (
        <RecipeSelected
          recipes={recipesWithWeights}
          rate={props.node.rate}
          nodeType={props.node.type}
          selectedRecipe={buildRecipe}
          showWeights={props.showWeights}
          onClear={() => props.onClearRecipe(id)}
          onDetachSubtree={() => props.onDetachSubtree(id)}
          onSelectNew={(recipe) => props.onSelectRecipe(id, recipe)}
        />
      ) : subRootPointer || recipes.length === 0 ? null : (
        <RecipeToAdd
          rate={props.node.rate}
          recipes={recipesWithWeights}
          onSelect={(recipe) => props.onSelectRecipe(id, recipe)}
        />
      )}
    </div>
  );
};
