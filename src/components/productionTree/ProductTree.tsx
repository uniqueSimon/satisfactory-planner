import React, { useRef, useEffect } from "react";
import { ProductNodeNested, Recipe } from "@/interfaces";
import { ProductNode } from "./ProductNode";
import { LineBetween } from "./LineBetween";

export const ProductTree = ({
  data,
  availableRecipes,
  onSelectRecipe,
  onClearRecipe,
}: {
  data: ProductNodeNested;
  availableRecipes: Recipe[];
  onSelectRecipe: (id: string, recipe: string) => void;
  onClearRecipe: (id: string) => void;
}) => {
  // One shared ref map for all nodes
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  console.log('nodeRefs',nodeRefs)
  return (
    <div className="relative flex justify-center">
      <RecursiveTree
        node={data}
        availableRecipes={availableRecipes}
        onSelectRecipe={onSelectRecipe}
        onClearRecipe={onClearRecipe}
        nodeRefs={nodeRefs.current}
      />
      {/* Render all lines once at the root level */}
      <LinesLayer node={data} nodeRefs={nodeRefs.current} />
    </div>
  );
};

const RecursiveTree = ({
  node,
  availableRecipes,
  onSelectRecipe,
  onClearRecipe,
  nodeRefs,
}: {
  node: ProductNodeNested;
  availableRecipes: Recipe[];
  onSelectRecipe: (id: string, recipe: string) => void;
  onClearRecipe: (id: string) => void;
  nodeRefs: Map<string, HTMLDivElement>;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Register ref in the map
  useEffect(() => {
    if (ref.current) nodeRefs.set(node.id, ref.current);
    return () => {
      nodeRefs.delete(node.id);
    };
  }, [node.id, ref.current]);

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center relative">
      <div ref={ref}>
        <ProductNode
          availableRecipes={availableRecipes}
          onSelectRecipe={onSelectRecipe}
          onClearRecipe={onClearRecipe}
          productNode={node}
        />
      </div>

      {hasChildren && (
        <div className="flex mt-8 justify-center">
          {node.children!.map((child) => (
            <div key={child.id} className="mx-4">
              <RecursiveTree
                node={child}
                availableRecipes={availableRecipes}
                onSelectRecipe={onSelectRecipe}
                onClearRecipe={onClearRecipe}
                nodeRefs={nodeRefs}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/** Draw lines between all parent-child pairs */
const LinesLayer = ({
  node,
  nodeRefs,
}: {
  node: ProductNodeNested;
  nodeRefs: Map<string, HTMLDivElement>;
}) => {
  console.log('node.children.length',node.children.length)
  if (!node.children || node.children.length === 0) return null;

  return (
    <>
      {node.children.map((child) => (
        <React.Fragment key={child.id}>
          <LineBetween
            from={nodeRefs.get(node.id) ?? null}
            to={nodeRefs.get(child.id) ?? null}
            label={`${child.rate.toFixed(1)} /min`}
          />
          <LinesLayer node={child} nodeRefs={nodeRefs} />
        </React.Fragment>
      ))}
    </>
  );
};
