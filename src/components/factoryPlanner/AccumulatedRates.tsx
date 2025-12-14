import { IconWithTooltip } from "@/reusableComp/IconWithTooltip";
import { Collapse } from "@/components/ui/collapse";
import { Tooltip } from "@/components/ui/tooltip";
import { RateBalance } from "./accumulateRates";
import { maxRates } from "@/calculateProductWeights";
import { SavedFactory } from "@/interfaces";

const getRelevantProducts = (
  selectedFactory: SavedFactory,
  _cluster: SavedFactory[]
): string[] => {
  const nodes = selectedFactory.productNodes;
  const leaves = nodes.filter(
    (n) => n.children.length === 0 && !n.subRootPointer
  );
  const leaveProducts = leaves.map((l) => l.name);

  const root = nodes.find((node) => node.type === "ROOT")!;
  /* 
  const otherCluster = cluster.find((factory) => {
    const leavesOther = factory.productNodes.filter(
      (n) => n.children.length === 0 && !n.subRootPointer
    );
    return leavesOther.some((x) => x.name === root.name);
  });
  const rootOther = otherCluster
    ? otherCluster.productNodes.find((node) => node.type === "ROOT")!
    : undefined;
 */
  return [...leaveProducts, root.name];
};

export const AccumulatedRates = (props: {
  cluster: SavedFactory[];
  rateBalance: RateBalance[];
  showResources: boolean;
  selectedFactory: SavedFactory | null;
  hoveredFactory?: SavedFactory;
  setHoveredAccumulatedProduct: (product: string | null) => void;
}) => {
  const allResources = [...maxRates.keys()];
  const filtered = props.rateBalance.filter(
    (x) => props.showResources || !allResources.includes(x.product)
  );
  const relevantProducts = props.selectedFactory
    ? getRelevantProducts(props.selectedFactory, props.cluster)
    : [];

  const relevantProductsHovered = props.hoveredFactory
    ? getRelevantProducts(props.hoveredFactory, props.cluster)
    : [];

  return (
    <Collapse title="Accumulated product rates">
      <div className="border border-gray-300">
        <div className="flex flex-wrap">
          {filtered.map((productRate, i) => {
            const isResource = allResources.includes(productRate.product);
            const notEnough =
              productRate.rate + productRate.rateFromOtherClusters < 0;
            const relevantForClicked = relevantProducts.includes(
              productRate.product
            );
            const relevantForHovered = relevantProductsHovered.includes(
              productRate.product
            );
            return (
              <div
                key={productRate.product}
                onMouseEnter={() =>
                  props.setHoveredAccumulatedProduct(productRate.product)
                }
                onMouseLeave={() =>
                  props.setHoveredAccumulatedProduct(null)
                }
                className="flex items-center mr-1 border-2 rounded-lg"
                style={{
                  color: isResource
                    ? "lightgrey"
                    : notEnough
                    ? "red"
                    : undefined,
                  borderStyle:
                    relevantForHovered && !relevantForClicked
                      ? "dotted"
                      : "solid",
                  borderColor:
                    relevantForClicked || relevantForHovered
                      ? "grey"
                      : "white",
                }}
              >
                <Tooltip
                  tooltip={
                    isResource
                      ? ""
                      : `${
                          productRate.rate < 0 ? "Produced" : "Needed"
                        }: ${Math.abs(
                          Math.round(
                            productRate.rateFromOtherClusters * 100
                          ) / 100
                        )}/min`
                  }
                >
                  {`${Math.round(productRate.rate * 100) / 100}/min`}
                </Tooltip>
                <IconWithTooltip item={productRate.product} />
                {i < filtered.length - 1 ? "," : ""}
              </div>
            );
          })}
        </div>
      </div>
    </Collapse>
  );
};
