import { Tooltip } from "antd";
import { IconWithTooltip } from "./IconWithTooltip";
import { Recipe } from "@/interfaces";

export const RecipeTooltip = (props: { recipe: Recipe; rate: number }) => {
  if (!props.recipe) {
    return "";
  }
  const ingredients = props.recipe.ingredients;
  return (
    <Tooltip
      styles={{ root: { whiteSpace: "nowrap", maxWidth: "none" } }}
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          {ingredients.map((ingredient, i) => {
            const ingredientRate =
              (props.rate * ingredient.amount) / props.recipe.product.amount;
            const notLastIngredient = i < ingredients.length - 1;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                {`${Math.round(ingredientRate * 100) / 100}/min`}
                <IconWithTooltip item={ingredient.name} />
                {notLastIngredient && <div style={{ margin: 5 }}>+</div>}
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
