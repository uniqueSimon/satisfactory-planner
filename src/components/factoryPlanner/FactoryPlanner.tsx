import { v4 as uuidv4 } from "uuid";
import { Form, Switch, Typography } from "antd";
import { CustomCard } from "@/reusableComp/CustomCard";
import { useState } from "react";
import { FactoryCluster } from "./FactoryCluster";
import { accumulateRates } from "./accumulateRates";
import { SquarePlus } from "lucide-react";
import { Button } from "@/reusableComp/Button";
import { Cluster, SavedFactory } from "@/interfaces";

export const FactoryPlanner = (props: {
  savedFactories: Cluster[];
  setSavedFactories: (newValue: Cluster[]) => void;
  loadedFactory: SavedFactory | null;
  setLoadedFactory: (factory: SavedFactory | null) => void;
  setNewInCluster: (clusterId: string) => void;
}) => {
  const [hoveredFactoryId, setHoveredFactoryId] = useState<string | null>();
  const [showResources, setShowResources] = useState(false);
  const combinedSavedFactories = props.savedFactories
    .map((x) => x.factories)
    .flat();
  const rateBalance = accumulateRates(props.savedFactories);
  return (
    <div className="p-4 flex-1 overflow-auto pointer-events-auto">
      <Typography.Title>Satisfactory Planner</Typography.Title>
      <CustomCard>
        <Form.Item label="Show resources" style={{ margin: 0 }}>
          <Switch checked={showResources} onChange={setShowResources} />
        </Form.Item>
        {props.savedFactories.map((cluster, index) => (
          <FactoryCluster
            key={index}
            setNewInCluster={props.setNewInCluster}
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
            setLoadedFactory={props.setLoadedFactory}
            setHoveredFactoryId={setHoveredFactoryId}
            loadedFactory={props.loadedFactory}
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
              { id: uuidv4(), title: "New Cluster", factories: [] },
            ])
          }
        >
          <SquarePlus />
          Add factory cluster
        </Button>
      </CustomCard>
    </div>
  );
};
