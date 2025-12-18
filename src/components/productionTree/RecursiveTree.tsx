import React from "react";
import { ProductNodeNested, Weights } from "@/interfaces";
import { ProductNode } from "./ProductNode";
import { LineBetween } from "./LineBetween";
import { useUpdatingRef } from "@/reusableComp/useUpdatingRef";

export const RecursiveTree = (props: {
  ref?: React.RefObject<HTMLDivElement | null>;
  node: ProductNodeNested;
  weights: Weights;
  onSelectRecipe: (id: string, recipe: string) => void;
  onSelectNew: (id: string, recipe: string) => void;
  onClearRecipe: (id: string) => void;
  onUpdateRate: (nodeId: string, newRate: number) => void;
  container: HTMLElement | null;
  onMoveToSubtree: (id: string) => void;
  onReattachSubtree: (id: string) => void;
}) => {
  const { ref, divEle } = useUpdatingRef();

  const hasChildren = props.node.children.length > 0;

  const from = props.ref?.current ?? null;
  return (
    <div className="flex flex-col items-center">
      <LineBetween
        container={props.container}
        from={from}
        to={divEle}
        rate={props.node.rate}
        onRateChange={(newRate) => props.onUpdateRate(props.node.id, newRate)}
      />
      <div ref={ref}>
        <ProductNode {...props} />
      </div>

      {hasChildren && (
        <div className="flex mt-8 justify-center">
          {props.node.children!.map((child) => (
            <div key={child.id} className="min-w-20">
              <RecursiveTree {...props} node={child} ref={ref} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
