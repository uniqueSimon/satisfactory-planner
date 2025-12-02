import React from "react";
import { ProductNodeNested, Weights } from "@/interfaces";
import { ProductNode } from "./ProductNode";
import { LineBetween } from "./LineBetween";
import { useUpdatingRef } from "@/reusableComp/useUpdatingRef";

export const RecursiveTree = (props: {
  ref?: React.RefObject<HTMLDivElement | null>;
  node: ProductNodeNested;
  weights: Weights;
  showWeights: boolean;
  onSelectRecipe: (id: string, recipe: string) => void;
  onSelectNew: (id: string, recipe: string) => void;
  onClearRecipe: (id: string) => void;
  onDetachSubtree: (id: string) => void;
  container: HTMLElement | null;
}) => {
  const { ref, divEle } = useUpdatingRef();

  const hasChildren = props.node.children.length > 0;
  const label = `${props.node.rate.toFixed(1)} /min`;

  const from = props.ref?.current ?? null;
  return (
    <div className="flex flex-col items-center">
      <LineBetween
        container={props.container}
        from={from}
        to={divEle}
        label={label}
      />
      <div ref={ref}>
        <ProductNode {...props} showWeights={props.showWeights} />
      </div>

      {hasChildren && (
        <div className="flex mt-8 justify-center">
          {props.node.children!.map((child) => (
            <div key={child.id} className="mx-4">
              <RecursiveTree {...props} node={child} ref={ref} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
