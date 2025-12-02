import { SavedFactory } from "@/interfaces";
import { IconWithTooltip } from "@/reusableComp/IconWithTooltip";

export const DetailedView = (props: { savedSetting: SavedFactory }) => {
  const nodes = props.savedSetting.productNodes;
  const leaves = nodes.filter(
    (n) => n.children.length === 0 && !n.subRootPointer
  );
  const root = nodes.find((node) => node.type === "ROOT")!;

  return (
    <div style={{ display: "flex" }}>
      <div>
        {leaves.map((x) => {
          return (
            <div key={x.id} style={{ display: "flex", margin: 10 }}>
              <IconWithTooltip item={x.name} />
              <RateWithArrow rate={x.rate} />
            </div>
          );
        })}
      </div>
      <IconWithRate
        rate={root.rate}
        product={root.name}
        insufficientOutput={false}
      />
    </div>
  );
};

const IconWithRate = (props: {
  rate: number;
  product: string;
  insufficientOutput: boolean;
}) => (
  <div
    key={props.product}
    style={{
      color: props.insufficientOutput ? "red" : undefined,
      border: "solid grey",
      borderWidth: 0.5,
      borderRadius: 8,
      padding: "10px 40px",
      margin: 3,
    }}
  >
    <div>{`${Math.round(props.rate * 100) / 100}/min`}</div>
    <IconWithTooltip item={props.product} height={60} />
  </div>
);
const RateWithArrow = (props: { rate: number; availableRate?: number }) => (
  <div>
    <div style={{ marginBottom: -10 }}>
      {`${Math.round(props.rate * 100) / 100}/min`}
      {props.availableRate && (
        <span
          style={{
            color: props.availableRate < props.rate ? "red" : undefined,
          }}
        >{` (${Math.round(props.availableRate * 100) / 100}/min)`}</span>
      )}
    </div>
    <div>{"---------->"}</div>
  </div>
);
