import { MoreHorizontal, Plus } from "lucide-react";
import { NodeType, RecipeWithWeight } from "../../interfaces";
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

export const RecipeToAdd = (props: {
  recipes: RecipeWithWeight[];
  rate: number;
  onSelect: (recipe: string) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition">
        <Plus size={16} />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="start">
      {props.recipes.map(({ recipe, weight }) => (
        <DropdownMenuItem
          key={recipe.recipeName}
          onClick={() => props.onSelect(recipe.recipeName)}
        >
          <Icon item={recipe.producedIn} />
          <div>{recipe.displayName}</div>
          {Math.round(weight * props.rate * 100) / 100}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export const RecipeSelected = (props: {
  recipes: RecipeWithWeight[];
  selectedRecipe: string;
  nodeType: NodeType;
  rate: number;
  onClear: () => void;
  onDetachSubtree: () => void;
  onSelectNew: (recipe: string) => void;
}) => {
  const { recipe } = props.recipes.find(
    (r) => r.recipe.recipeName === props.selectedRecipe
  )!;
  const producedIn = productDisplayNameMapping.get(recipe.producedIn);
  const machineCount =
    props.rate / ((recipe.product.amount / recipe.time) * 60);
  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-0.5 mb-1 bg-gray-400" />
      <div className="text-xs pt-1">{machineCount.toFixed(1)}</div>
      <Tooltip
        tooltip={
          <div>
            <div className="font-bold">{producedIn}</div>
            {recipe.displayName}
          </div>
        }
      >
        <Icon item={recipe.producedIn} />
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
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => props.onClear()}>
            Remove recipe
          </DropdownMenuItem>
          {props.nodeType !== "ROOT" && props.nodeType !== "SUB_ROOT" && (
            <DropdownMenuItem onClick={() => props.onDetachSubtree()}>
              Create / Join to subtree
            </DropdownMenuItem>
          )}
          {/* Change recipe submenu */}
          {props.recipes.length > 1 && <div className="border-t my-1" />}
          {props.recipes
            .filter((r) => r.recipe.recipeName !== props.selectedRecipe)
            .map(({ recipe, weight }) => (
              <DropdownMenuItem
                key={recipe.recipeName}
                onClick={() => props.onSelectNew(recipe.recipeName)}
              >
                <Icon item={recipe.producedIn} />
                <div className="ml-2">Change to {recipe.displayName}</div>
                {Math.round(weight * props.rate * 100) / 100}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
