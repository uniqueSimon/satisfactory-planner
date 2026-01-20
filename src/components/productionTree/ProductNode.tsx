import { useState } from "react";
import { ProductNodeNested, Weights } from "@/interfaces";
import { RecipeSelected, RecipeToAdd } from "./RecipeSelector";
import { IconWithTooltip } from "@/reusableComp/IconWithTooltip";
import { cn } from "@/lib/utils";
import { useRecipes } from "@/RecipesContext";
import { NumberBubble } from "@/reusableComp/NumberBubble";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Tooltip } from "../ui/tooltip";
import { useEditMode } from "@/context/TreeSettingsContext";

export const ProductNode = (props: {
  node: ProductNodeNested;
  weights: Weights;
  onSelectRecipe: (id: string, recipe: string) => void;
  onSelectNew: (id: string, recipe: string) => void;
  onClearRecipe: (id: string) => void;
  onUpdateRate: (nodeId: string, newRate: number) => void;
  onMoveToSubtree: (id: string) => void;
  onReattachSubtree: (id: string) => void;
}) => {
  const { editMode, showWeights } = useEditMode();
  const { availableRecipes } = useRecipes();
  const { id, name, buildRecipe, rate, type, subRootPointer } = props.node;
  const recipes = availableRecipes.filter((x) => x.product.name === name);

  const [isEditingRate, setIsEditingRate] = useState(false);
  const [editRateValue, setEditRateValue] = useState("");

  const handleRateClick = () => {
    if (!editMode) return;
    setEditRateValue(rate.toFixed(1));
    setIsEditingRate(true);
  };

  const handleRateSubmit = () => {
    const numValue = parseFloat(editRateValue);
    if (!isNaN(numValue) && numValue > 0) {
      props.onUpdateRate(id, numValue);
    }
    setIsEditingRate(false);
  };

  const handleRateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRateSubmit();
    } else if (e.key === "Escape") {
      setIsEditingRate(false);
    }
  };

  const productWeights = props.weights.get(name);
  const minWeight = productWeights
    ? Math.min(...productWeights.map((x) => x.weight))
    : Infinity;
  const productWeight = props.weights.get(name)!;

  const recipesWithWeights = recipes.map((recipe) => ({
    recipe,
    weight: productWeight.find((x) => x.recipeName === recipe.recipeName)!
      .weight,
  }));
  return (
    <div
      className={cn(
        "flex flex-col items-center bg-white shadow-lg rounded-xl px-2 border border-gray-200 text-center",
        subRootPointer && "bg-gray-300"
      )}
    >
      {(type === "SUB_ROOT" || type === "ROOT") && (
        isEditingRate ? (
          <input
            type="number"
            step="0.1"
            value={editRateValue}
            onChange={(e) => setEditRateValue(e.target.value)}
            onBlur={handleRateSubmit}
            onKeyDown={handleRateKeyDown}
            autoFocus
            className="text-xs w-16 text-center px-1 py-0.5 mt-1 border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary"
          />
        ) : (
          <div
            className={`text-xs pt-1 ${editMode ? "cursor-pointer hover:bg-gray-100 px-1 rounded" : ""}`}
            onClick={handleRateClick}
          >
            {`${rate.toFixed(1)} /min`}
          </div>
        )
      )}
      <NumberBubble show={showWeights} number={minWeight * rate}>
        <IconWithTooltip item={name} />
      </NumberBubble>
      {editMode && (
        <>
          {type === "SUB_ROOT" ? (
            <Tooltip tooltip="Reattach subtree">
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 p-0 text-gray-500 hover:text-gray-800"
                onClick={() => props.onReattachSubtree(id)}
              >
                <ArrowLeft size={16} />
              </Button>
            </Tooltip>
          ) : type !== "ROOT" && !subRootPointer ? (
            <Tooltip tooltip="Move to or create subtree">
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 p-0 text-gray-500 hover:text-gray-800"
                onClick={() => props.onMoveToSubtree(id)}
              >
                <ArrowRight size={16} />
              </Button>
            </Tooltip>
          ) : null}
        </>
      )}
      {buildRecipe ? (
        <RecipeSelected
          recipes={recipesWithWeights}
          rate={props.node.rate}
          nodeType={props.node.type}
          selectedRecipe={buildRecipe}
          showWeights={showWeights}
          onClear={() => props.onClearRecipe(id)}
          onSelectNew={(recipe) => props.onSelectNew(id, recipe)}
          onRateChange={(newRate) => props.onUpdateRate(id, newRate)}
        />
      ) : subRootPointer || recipes.length === 0 || !editMode ? null : (
        <RecipeToAdd
          rate={props.node.rate}
          recipes={recipesWithWeights}
          onSelect={(recipe) => props.onSelectRecipe(id, recipe)}
        />
      )}
    </div>
  );
};
