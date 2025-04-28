import { Form, Switch } from "antd";
import { CustomCard } from "@/reusableComp/CustomCard";
import { useState } from "react";
import { FactoryCluster } from "./FactoryCluster";
import { recalculateFactoryInputs } from "./recalculateFactoryInputs";
import { accumulateRates } from "./accumulateRates";
import { SquarePlus } from "lucide-react";
import { Button } from "@/reusableComp/Button";
import { Cluster } from "@/interfaces";

export const FactoryPlanner = (props: {
  savedFactories: Cluster[];
  setSavedFactories: (newValue: Cluster[]) => void;
  clickedFactoryId: number | null;
  setClickedFactoryId: (factoryId: number | null) => void;
}) => {
  const [hoveredFactoryId, setHoveredFactoryId] = useState<number | null>();
  const [showResources, setShowResources] = useState(false);
  const combinedSavedFactories = props.savedFactories
    .map((x) => x.factories)
    .flat();
  const rateBalance = accumulateRates(props.savedFactories);
  return (
    <CustomCard title="Factory planner">
      <Button
        onClick={() =>
          props.setSavedFactories(
            props.savedFactories.map((cluster) => ({
              ...cluster,
              factories: recalculateFactoryInputs(cluster.factories),
            }))
          )
        }
      >
        Recalculate factory inputs
      </Button>
      <Form.Item label="Show resources" style={{ margin: 0 }}>
        <Switch checked={showResources} onChange={setShowResources} />
      </Form.Item>
      {props.savedFactories.map((cluster, index) => (
        <FactoryCluster
          key={index}
          cluster={cluster}
          hoveredFactoryId={hoveredFactoryId}
          showResources={showResources}
          updateCluster={(cluster) =>
            props.setSavedFactories(
              props.savedFactories.map((prevCluster, i) =>
                i === index ? cluster : prevCluster
              )
            )
          }
          rateBalance={rateBalance[index]}
          setHoveredFactoryId={setHoveredFactoryId}
          selectedFactoryId={props.clickedFactoryId}
          onChooseFactory={props.setClickedFactoryId}
          onDropIntoCluster={(sourceId) => {
            const sourceFactory = combinedSavedFactories.find(
              (x) => x.id === sourceId
            )!;
            const withoutSource = props.savedFactories.map((cluster) => ({
              ...cluster,
              factories: cluster.factories.filter((x) => x.id !== sourceId),
            }));
            props.setSavedFactories(
              withoutSource.map((cluster, i) =>
                index === i
                  ? {
                      ...cluster,
                      factories: [...cluster.factories, sourceFactory],
                    }
                  : cluster
              )
            );
          }}
          onRemoveCluster={() =>
            props.setSavedFactories(
              props.savedFactories.filter((_, i) => i !== index)
            )
          }
        />
      ))}
      <Button
        onClick={() =>
          props.setSavedFactories([
            ...props.savedFactories,
            { title: "New Cluster", factories: [] },
          ])
        }
      >
        <SquarePlus />
        Add factory cluster
      </Button>
    </CustomCard>
  );
};
