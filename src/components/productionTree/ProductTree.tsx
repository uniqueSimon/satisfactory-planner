import React, { useRef } from "react";
import { ProductNodeNested, Recipe } from "@/interfaces";
import { ProductNode } from "./ProductNode";
import { LineBetween } from "./LineBetween";
import { useDelay } from "@/reusableComp/useDelay";
import { useRefInMap } from "@/reusableComp/useRefInMap";

export const ProductTree = (props: {
  data: ProductNodeNested;
  availableRecipes: Recipe[];
  onSelectRecipe: (id: string, recipe: string) => void;
  onClearRecipe: (id: string) => void;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const readyForLines = useDelay(props.data, 1);

  return (
    <div ref={containerRef} className="relative">
      <RecursiveTree
        node={props.data}
        availableRecipes={props.availableRecipes}
        onSelectRecipe={props.onSelectRecipe}
        onClearRecipe={props.onClearRecipe}
        nodeRefs={nodeRefs.current}
      />
      {readyForLines && (
        <RecursiveLines
          nodeRefs={nodeRefs.current}
          container={containerRef.current}
          node={props.data}
        />
      )}
    </div>
  );
};

const RecursiveTree = (props: {
  node: ProductNodeNested;
  availableRecipes: Recipe[];
  nodeRefs: Map<string, HTMLDivElement>;
  onSelectRecipe: (id: string, recipe: string) => void;
  onClearRecipe: (id: string) => void;
}) => {
  const ref = useRefInMap(props.node.id, props.nodeRefs);
  const hasChildren = props.node.children.length > 0;
  
  return (
    <div className="flex flex-col items-center">
      <div ref={ref}>
        <ProductNode {...props} />
      </div>

      {hasChildren && (
        <div className="flex mt-8 justify-center">
          {props.node.children!.map((child) => (
            <div key={child.id} className="mx-4">
              <RecursiveTree {...props} node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/** Draw lines between all parent-child pairs */
const RecursiveLines = (props: {
  node: ProductNodeNested;
  nodeRefs: Map<string, HTMLDivElement>;
  container: HTMLDivElement | null;
}) => {
  if (props.node.children.length === 0) return null;
  return (
    <>
      {props.node.children.map((child) => (
        <React.Fragment key={child.id}>
          <LineBetween
            from={props.nodeRefs.get(props.node.id) ?? null}
            to={props.nodeRefs.get(child.id) ?? null}
            label={`${child.rate.toFixed(1)} /min`}
            container={props.container}
          />
          <RecursiveLines
            node={child}
            nodeRefs={props.nodeRefs}
            container={props.container}
          />
        </React.Fragment>
      ))}
    </>
  );
};
