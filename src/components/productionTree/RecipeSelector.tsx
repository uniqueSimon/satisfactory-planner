import { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { Recipe } from "../../interfaces";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconWithTooltipPortal } from "@/reusableComp/IconWithTooltipPortal";

interface Props {
  selectedRecipe?: string;
  availableRecipes: Recipe[];
  onSelect: (recipe: string) => void;
  onClear: () => void;
}

export const RecipeSelector = (props: Props) => {
  const [open, setOpen] = useState(false);

  // --- Case 1: No recipe selected ---
  if (!props.selectedRecipe) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            <Plus size={16} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {props.availableRecipes.map((recipe) => (
            <DropdownMenuItem
              key={recipe.recipeName}
              onClick={() => {
                setOpen(false);
                props.onSelect(recipe.recipeName);
              }}
            >
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
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-2 text-sm">
        <IconWithTooltipPortal item={currentRecipe.producedIn} />
        {currentRecipe.displayName}
      </span>
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
          <DropdownMenuItem onClick={() => {}}>Change recipe…</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
