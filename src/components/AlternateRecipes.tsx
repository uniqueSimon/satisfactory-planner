import { Button, Table } from "antd";
import { allProducts, allRecipes } from "@/App";
import { IconWithTooltip } from "@/reusableComp/IconWithTooltip";
import { Button as MyButton } from "@/reusableComp/Button";
import { Recipe } from "@/interfaces";

export const AlternateRecipes = (props: {
  foundAltRecipes: string[];
  setFoundAltRecipes: (foundAltRecipes: string[]) => void;
}) => {
  const recipePerProduct = allProducts.map((product) => {
    const recipes = allRecipes.filter((x) => x.product.name === product);
    const baseRecipe = recipes.find((x) => !x.isAlternate);
    const alternateRecipes = recipes.filter((x) => x.isAlternate);
    return {
      product,
      baseRecipe,
      alternateRecipes,
    };
  });
  return (
    <div style={{ border: "solid grey", borderRadius: 8 }}>
      <MyButton
        onClick={() =>
          props.setFoundAltRecipes(allRecipes.map((x) => x.recipeName))
        }
      >
        Select all
      </MyButton>
      <MyButton onClick={() => props.setFoundAltRecipes([])}>
        Deselect all
      </MyButton>
      <Table
        pagination={false}
        size="small"
        columns={[
          { dataIndex: "tier" },
          {
            dataIndex: "product",
            render: (product: string) => <IconWithTooltip item={product} />,
          },
          {
            dataIndex: "baseRecipe",
            render: (recipe: Recipe) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "solid grey",
                  borderRadius: 8,
                }}
              >
                {recipe?.ingredients.map((ingredient) => (
                  <IconWithTooltip
                    key={`${ingredient.name}${ingredient.amount > 0}`}
                    item={ingredient.name}
                  />
                )) ?? null}
              </div>
            ),
          },
          {
            dataIndex: "altRecipes",
            render: (recipes: Recipe[]) => {
              return (
                <div style={{ display: "flex" }}>
                  {recipes.map((recipe) => {
                    const selected = props.foundAltRecipes.includes(
                      recipe.recipeName
                    );
                    return (
                      <Button
                        key={recipe.recipeName}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          borderStyle: "solid",
                          borderColor: selected ? "blue" : undefined,
                          borderWidth: 2,
                        }}
                        onClick={() =>
                          props.setFoundAltRecipes(
                            !selected
                              ? [...props.foundAltRecipes, recipe.recipeName]
                              : [
                                  ...props.foundAltRecipes.filter(
                                    (x) => x !== recipe.recipeName
                                  ),
                                ]
                          )
                        }
                      >
                        {recipe.ingredients.map((ingredient) => (
                          <IconWithTooltip
                            key={`${ingredient.name}${ingredient.amount > 0}`}
                            item={ingredient.name}
                          />
                        ))}
                        {recipe.displayName.replace("Alternate:", "")}
                      </Button>
                    );
                  })}
                </div>
              );
            },
          },
        ]}
        dataSource={recipePerProduct
          .sort((a, b) => (a.baseRecipe?.tier ?? 0) - (b.baseRecipe?.tier ?? 0))
          .map((group) => ({
            key: group.product,
            tier: group.baseRecipe?.tier,
            product: group.product,
            baseRecipe: group.baseRecipe,
            altRecipes: group.alternateRecipes,
          }))}
      />
    </div>
  );
};
