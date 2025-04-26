import { Form, Switch } from "antd";
import { CustomCard } from "@/reusableComp/CustomCard";
import { useState } from "react";
import { FactoryCluster } from "./FactoryCluster";
import { DetailedView } from "./DetailedView";
import { calculateFactoryDetails } from "./calculateFactoryDetails";
import { accumulateRates } from "./accumulateRates";
import { Copy, SquarePlus, Trash, X } from "lucide-react";
import { Button } from "@/reusableComp/Button";
import { Cluster } from "@/interfaces";

export const FactoryPlanner = (props: {
  savedFactories: Cluster[];
  setSavedFactories: (newValue: Cluster[]) => void;
  clickedFactoryId: number | undefined;
  setClickedFactoryId: (factoryId: number | undefined) => void;
}) => {
  const [hoveredFactoryId, setHoveredFactoryId] = useState<number | null>();
  const [showResources, setShowResources] = useState(false);
  const combinedSavedFactories = props.savedFactories
    .map((x) => x.factories)
    .flat();
  const selectedSavedSettings = combinedSavedFactories.find(
    (x) => x.id === props.clickedFactoryId
  );
  const rateBalance = accumulateRates(props.savedFactories);
  return (
    <CustomCard title="Factory planner">
      <Button
        onClick={() =>
          props.setSavedFactories(
            props.savedFactories.map((cluster) => ({
              ...cluster,
              factories: calculateFactoryDetails(cluster.factories),
            }))
          )
        }
      >
        Recalculate saved factories
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
      <div style={{ display: "flex" }}>
        {selectedSavedSettings && (
          <>
            <CustomCard>
              <Button
                onClick={() => {
                  props.setClickedFactoryId(undefined);
                  props.setSavedFactories(
                    props.savedFactories.map((cluster) => ({
                      ...cluster,
                      factories: cluster.factories.filter(
                        (x) => x.id !== props.clickedFactoryId
                      ),
                    }))
                  );
                }}
              >
                <Trash />
              </Button>
              <Button onClick={() => props.setClickedFactoryId(undefined)}>
                <X />
              </Button>
              <Button
                onClick={() => {
                  const timestamp = Date.now();
                  const clusterIndex = props.savedFactories.findIndex((x) =>
                    x.factories.some((y) => y.id === props.clickedFactoryId)
                  );
                  const source = props.savedFactories[
                    clusterIndex
                  ].factories.find((x) => x.id === props.clickedFactoryId)!;
                  props.setSavedFactories(
                    props.savedFactories.map((cluster, i) =>
                      i === clusterIndex
                        ? {
                            ...cluster,
                            factories: [
                              ...cluster.factories,
                              {
                                ...source,
                                id: timestamp,
                              },
                            ],
                          }
                        : cluster
                    )
                  );
                  props.setClickedFactoryId(timestamp);
                }}
              >
                <Copy />
              </Button>
              <DetailedView savedSetting={selectedSavedSettings} />
            </CustomCard>
          </>
        )}
        {hoveredFactoryId && hoveredFactoryId !== props.clickedFactoryId && (
          <CustomCard>
            <DetailedView
              savedSetting={
                combinedSavedFactories.find((x) => x.id === hoveredFactoryId)!
              }
            />
          </CustomCard>
        )}
      </div>
    </CustomCard>
  );
};
