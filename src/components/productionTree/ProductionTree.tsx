import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";
import { ProductNode, SavedFactory } from "../../interfaces";
import { ProductionSetupForm } from "./ProductionSetupForm";
import { RecursiveTree } from "./RecursiveTree";
import { buildTree } from "./treeOperations/buildTree";
import { selectRecipe } from "./treeOperations/selectRecipe";
import { clearRecipe } from "./treeOperations/clearRecipe";
import { moveToSubtree } from "./treeOperations/moveToSubtree";
import { useRecipes } from "@/RecipesContext";
import { Button } from "@/reusableComp/Button";
import { Icon } from "@/reusableComp/Icon";
import { productDisplayNameMapping } from "@/App";
import { Copy, Trash, X } from "lucide-react";
import { ConfigForMod } from "./ConfigForMod";

export const ProductionTree = (props: {
  savedFactory: SavedFactory;
  setProductNodes: (nodes: ProductNode[]) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  onCopy: (newFactory: SavedFactory) => void;
}) => {
  const { availableRecipes } = useRecipes();
  const nodes = props.savedFactory.productNodes;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const forest = nodes.length > 0 ? buildTree(nodes) : null;

  const root = nodes.find((node) => node.type === "ROOT");
  const rootRecipe = root?.buildRecipe
    ? availableRecipes.find((r) => r.recipeName === root.buildRecipe)
    : undefined;

  const setProductToProduce = (product: string) => {
    const baseRecipe = availableRecipes.find(
      (r) => r.product.name === product && !r.isAlternate
    )!;
    const rateOneMachine = (baseRecipe.product.amount / baseRecipe.time) * 60;
    props.setProductNodes([
      {
        id: uuidv4(),
        name: product,
        rate: rateOneMachine,
        type: "ROOT",
        children: [],
      },
    ]);
  };
  const setOutputRate = (rate: number) => {
    const root = nodes.find((p) => p.type === "ROOT")!;
    const oldRate = root.rate;
    const increase = rate / oldRate;
    const updated = nodes.map((x) => ({
      ...x,
      rate: x.rate * increase,
    }));
    props.setProductNodes(updated);
  };
  const onSelectRecipe = (id: string, recipe: string) => {
    const updated = selectRecipe(nodes, id, recipe, availableRecipes);
    props.setProductNodes(updated);
  };
  const onClearRecipe = (id: string) => {
    const updated = clearRecipe(nodes, id);
    props.setProductNodes(updated);
  };
  const onDetachSubtree = (id: string) => {
    const updated = moveToSubtree(nodes, id, availableRecipes);
    props.setProductNodes(updated);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-2 py-1 border-2 bg-gray-200 text-xl font-semibold">
        {root && (
          <div className="flex gap-2 items-center">
            <Icon item={root.name} />
            {productDisplayNameMapping.get(root.name)}
          </div>
        )}
        <div>
          <Button onClick={() => props.onDelete(props.savedFactory.id)}>
            <Trash />
          </Button>
          <Button
            onClick={() =>
              props.onCopy({ ...props.savedFactory, id: uuidv4() })
            }
          >
            <Copy />
          </Button>
          <Button onClick={props.onClose}>
            <X />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="w-full bg-gray-50">
          <ProductionSetupForm
            product={root?.name ?? ""}
            rate={root?.rate ?? 0}
            rootRecipe={rootRecipe}
            setProduct={setProductToProduce}
            setRate={setOutputRate}
          />
          <ConfigForMod nodes={nodes} />
          {forest && (
            <div ref={containerRef} className="relative flex">
              <div>
                <RecursiveTree
                  node={forest.mainTree}
                  onClearRecipe={onClearRecipe}
                  onSelectRecipe={onSelectRecipe}
                  onDetachSubtree={onDetachSubtree}
                  container={containerRef.current}
                />
              </div>
              {forest.subTrees.map((subTree, i) => (
                <div key={i}>
                  <RecursiveTree
                    node={subTree}
                    onClearRecipe={onClearRecipe}
                    onSelectRecipe={onSelectRecipe}
                    onDetachSubtree={onDetachSubtree}
                    container={containerRef.current}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
