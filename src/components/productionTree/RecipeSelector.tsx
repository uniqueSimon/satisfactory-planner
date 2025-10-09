import { MoreHorizontal, Plus } from "lucide-react";
import { Recipe } from "../../interfaces";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { productDisplayNameMapping } from "@/App";
import { Icon } from "@/reusableComp/Icon";
import { Tooltip } from "@/reusableComp/Tooltip";

interface Props {
  selectedRecipe?: string;
  availableRecipes: Recipe[];
  onSelect: (recipe: string) => void;
  onClear: () => void;
}

export const RecipeSelector = (props: Props) => {
  // --- Case 1: No recipe selected ---
  if (!props.selectedRecipe) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition">
            <Plus size={16} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          {props.availableRecipes.map((recipe) => (
            <DropdownMenuItem
              key={recipe.recipeName}
              onClick={() => props.onSelect(recipe.recipeName)}
            >
              <Icon item={recipe.producedIn} />
              {recipe.displayName}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // --- Case 2: Recipe selected ---
  const currentRecipe = props.availableRecipes.find(
    (r) => r.recipeName === props.selectedRecipe
  )!;
  const producedIn = productDisplayNameMapping.get(currentRecipe.producedIn);
  return (
    <div className="flex flex-col items-center gap-2">
      <Tooltip
        tooltip={
          <div>
            <div className="font-bold">{producedIn}</div>
            {currentRecipe.displayName}
          </div>
        }
      >
        <Icon item={currentRecipe.producedIn} />
      </Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 p-0 text-gray-500 hover:text-gray-800"
          >
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="z-[9999]">
          <DropdownMenuItem onClick={() => props.onClear()}>
            Remove recipe
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
