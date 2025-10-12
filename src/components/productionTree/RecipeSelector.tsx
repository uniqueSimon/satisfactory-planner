import { MoreHorizontal, Plus } from "lucide-react";
import { NodeType, Recipe } from "../../interfaces";
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
  availableRecipes: Recipe[];
  onSelect: (recipe: string) => void;
}) => (
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

export const RecipeSelected = (props: {
  selectedRecipe: string;
  availableRecipes: Recipe[];
  nodeType: NodeType;
  rate: number;
  onClear: () => void;
  onDetachSubtree: () => void;
}) => {
  const currentRecipe = props.availableRecipes.find(
    (r) => r.recipeName === props.selectedRecipe
  )!;
  const producedIn = productDisplayNameMapping.get(currentRecipe.producedIn);
  const machineCount =
    props.rate / ((currentRecipe.product.amount / currentRecipe.time) * 60);
  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-0.5 mb-1 bg-gray-400" />
      <div className="text-xs pt-1">{machineCount.toFixed(1)}</div>
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
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => props.onClear()}>
            Remove recipe
          </DropdownMenuItem>
          {props.nodeType !== "ROOT" && props.nodeType !== "SUB_ROOT" && (
            <DropdownMenuItem onClick={() => props.onDetachSubtree()}>
              Create / Join to subtree
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
