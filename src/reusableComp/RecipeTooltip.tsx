import { Tooltip } from "@/components/ui/tooltip";
import { IconWithTooltip } from "./IconWithTooltip";
import { Recipe } from "@/interfaces";

export const RecipeTooltip = (props: { recipe: Recipe; rate: number }) => {
  if (!props.recipe) {
    return "";
  }
  const ingredients = props.recipe.ingredients;
  return (
    <Tooltip
      tooltip={
        <div className="flex items-center whitespace-nowrap">
          {ingredients.map((ingredient, i) => {
            const ingredientRate =
              (props.rate * ingredient.amount) / props.recipe.product.amount;
            const notLastIngredient = i < ingredients.length - 1;
            return (
              <div key={i} className="flex items-center">
                {`${Math.round(ingredientRate * 100) / 100}/min`}
                <IconWithTooltip item={ingredient.name} />
                {notLastIngredient && <div className="mx-1">+</div>}
              </div>
            );
          })}
          {`--------->     ${Math.round(props.rate * 100) / 100}/min`}
          <IconWithTooltip item={props.recipe.product.name} />
        </div>
      }
    >
      {props.recipe.displayName}
    </Tooltip>
  );
};
