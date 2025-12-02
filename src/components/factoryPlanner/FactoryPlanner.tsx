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
  setSavedFactories: (newValue: React.SetStateAction<Cluster[]>) => void;
  loadedFactory: SavedFactory | null;
  setLoadedFactory: (factory: SavedFactory | null) => void;
  setNewInCluster: (clusterId: string) => void;
}) => {
  const [hoveredFactoryId, setHoveredFactoryId] = useState<string | null>();
  const [showResources, setShowResources] = useState(false);

  const rateBalance = accumulateRates(props.savedFactories);

  const onDropIntoCluster = (sourceId: string, clusterIndex: number) => {
    props.setSavedFactories((currentFactories) => {
      const sourceFactory = currentFactories
        .flatMap((x) => x.factories)
        .find((x) => x.id === sourceId)!;
      const withoutSource = currentFactories.map((cluster) => ({
        ...cluster,
        factories: cluster.factories.filter((x) => x.id !== sourceId),
      }));
      return withoutSource.map((cluster, i) =>
        clusterIndex === i
          ? {
              ...cluster,
              factories: [...cluster.factories, sourceFactory],
            }
          : cluster
      );
    });
  };
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
              props.setSavedFactories((prev) =>
                prev.map((prevCluster, i) =>
                  i === index ? cluster : prevCluster
                )
              )
            }
            rateBalance={rateBalance[index]}
            setLoadedFactory={props.setLoadedFactory}
            setHoveredFactoryId={setHoveredFactoryId}
            loadedFactory={props.loadedFactory}
            onDropIntoCluster={(sourceId) => onDropIntoCluster(sourceId, index)}
            onRemoveCluster={() =>
              props.setSavedFactories((prev) => prev.filter((_, i) => i !== index))
            }
          />
        ))}
        <Button
          onClick={() =>
            props.setSavedFactories((prev) => [
              ...prev,
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
