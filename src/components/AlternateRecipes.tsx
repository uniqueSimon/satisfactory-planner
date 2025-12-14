import { allProducts, allRecipes } from "@/App";
import { IconWithTooltip } from "@/reusableComp/IconWithTooltip";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { useRecipes } from "@/RecipesContext";
import { cn } from "@/lib/utils";

export const AlternateRecipes = () => {
  const { foundAltRecipes, setFoundAltRecipes } = useRecipes();

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

  const allRecipeNames = allRecipes.map((x) => x.recipeName);
  const selectionState =
    foundAltRecipes.length === 0
      ? "none"
      : foundAltRecipes.length === allRecipeNames.length
      ? "all"
      : "some";

  const handleToggle = () => {
    if (selectionState === "all") {
      setFoundAltRecipes([]);
    } else {
      setFoundAltRecipes(allRecipeNames);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleToggle}
          className={cn(
            "relative inline-flex h-6 w-16 items-center rounded-full transition-colors",
            selectionState === "all"
              ? "bg-primary"
              : selectionState === "some"
              ? "bg-primary/50"
              : "bg-gray-300"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md",
              selectionState === "all"
                ? "translate-x-11"
                : selectionState === "some"
                ? "translate-x-6"
                : "translate-x-1"
            )}
          />
        </button>
        <span className="text-sm font-medium">
          {selectionState === "all"
            ? "All recipes selected"
            : selectionState === "some"
            ? "Some recipes selected"
            : "No recipes selected"}
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tier</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Base Recipe</TableHead>
            <TableHead>Alternate Recipes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipePerProduct
            .sort(
              (a, b) => (a.baseRecipe?.tier ?? 0) - (b.baseRecipe?.tier ?? 0)
            )
            .map((group) => (
              <TableRow key={group.product}>
                <TableCell>{group.baseRecipe?.tier}</TableCell>
                <TableCell>
                  <IconWithTooltip item={group.product} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center border border-gray-300 rounded-lg p-1">
                    {group.baseRecipe?.ingredients.map((ingredient) => (
                      <IconWithTooltip
                        key={`${ingredient.name}${ingredient.amount > 0}`}
                        item={ingredient.name}
                      />
                    )) ?? null}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {group.alternateRecipes.map((recipe) => {
                      const selected = foundAltRecipes.includes(
                        recipe.recipeName
                      );
                      return (
                        <button
                          key={recipe.recipeName}
                          className={cn(
                            "flex items-center gap-1 cursor-pointer border-2 rounded-md px-1",
                            selected ? "border-primary" : ""
                          )}
                          onClick={() =>
                            setFoundAltRecipes(
                              !selected
                                ? [...foundAltRecipes, recipe.recipeName]
                                : foundAltRecipes.filter(
                                    (x) => x !== recipe.recipeName
                                  )
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
                        </button>
                      );
                    })}
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
