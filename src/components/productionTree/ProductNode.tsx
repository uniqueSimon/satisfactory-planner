import { ProductNodeNested, Recipe } from "@/interfaces";
import { IconWithTooltipPortal } from "@/reusableComp/IconWithTooltipPortal";
import { RecipeSelector } from "./RecipeSelector";

const width = 160;
const height = 100;

export const ProductNode = (props: {
  nodeDatum: ProductNodeNested;
  availableRecipes: Recipe[];
  handleSelectRecipe: (id: string, recipe: string) => void;
  onClearRecipe: (id: string) => void;
}) => {
  const id = props.nodeDatum.name;
  const { name, rate, buildRecipe } = props.nodeDatum.attributes;
  const recipes = props.availableRecipes.filter((x) => x.product.name === name);
  return (
    <foreignObject width={width} height={height} x={-width / 2} y={-height / 2}>
      <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-2 border border-gray-200 text-center">
        <div className="flex gap-2 items-center">
          <IconWithTooltipPortal item={name} />
          <div className="text-gray-500 mb-1">{rate} / min</div>
        </div>
        <div className="w-full h-0.5 bg-gray-300" />
        <RecipeSelector
          selectedRecipe={buildRecipe}
          availableRecipes={recipes}
          onClear={() => props.onClearRecipe(id)}
          onSelect={(recipe) => props.handleSelectRecipe(id, recipe)}
        />
      </div>
    </foreignObject>
  );
};
