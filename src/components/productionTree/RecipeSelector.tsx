import { Plus, RotateCcw, Trash } from "lucide-react";
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
import { Tooltip } from "@/components/ui/tooltip";
import { NumberBubble } from "@/reusableComp/NumberBubble";
import { useEditMode } from "@/context/TreeSettingsContext";

export const RecipeToAdd = (props: {
  recipes: RecipeWithWeight[];
  rate: number;
  onSelect: (recipe: string) => void;
}) => (
  <DropdownMenu>
    <Tooltip tooltip="Add recipe">
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 p-0 text-gray-500 hover:text-gray-800"
        >
          <Plus size={16} />
        </Button>
      </DropdownMenuTrigger>
    </Tooltip>

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
  showWeights: boolean;
  onClear: () => void;
  onSelectNew: (recipe: string) => void;
}) => {
  const { editMode } = useEditMode();
  const { recipe, weight } = props.recipes.find(
    (r) => r.recipe.recipeName === props.selectedRecipe
  )!;
  const producedIn = productDisplayNameMapping.get(recipe.producedIn);
  const machineCount =
    props.rate / ((recipe.product.amount / recipe.time) * 60);
  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-0.5 mb-1 bg-gray-400" />
      <div className="text-xs pt-1">{machineCount.toFixed(1)}</div>
      <div className="relative">
        <NumberBubble show={props.showWeights} number={weight * props.rate}>
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
        </NumberBubble>
      </div>
      {editMode && (
        <div className="flex">
          <Tooltip tooltip="Delete recipe with all its ingredients">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0 text-gray-500 hover:text-gray-800"
              onClick={props.onClear}
            >
              <Trash size={16} />
            </Button>
          </Tooltip>
          {props.recipes.length > 1 && (
            <DropdownMenu>
              <Tooltip tooltip="Change recipe">
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 p-0 text-gray-500 hover:text-gray-800"
                  >
                    <RotateCcw size={16} />
                  </Button>
                </DropdownMenuTrigger>
              </Tooltip>
              <DropdownMenuContent align="start">
                <div className="text-xs border-b pb-1">Change recipe to:</div>
                {props.recipes
                  .filter((r) => r.recipe.recipeName !== props.selectedRecipe)
                  .map(({ recipe, weight }) => (
                    <DropdownMenuItem
                      key={recipe.recipeName}
                      onClick={() => props.onSelectNew(recipe.recipeName)}
                    >
                      <Icon item={recipe.producedIn} />
                      <div className="ml-2">{recipe.displayName}</div>
                      {props.showWeights && (
                        <div className="text-xs pt-1">
                          ({(weight * props.rate).toFixed(1)})
                        </div>
                      )}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </div>
  );
};
