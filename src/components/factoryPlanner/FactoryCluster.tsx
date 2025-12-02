import { v4 as uuidv4 } from "uuid";
import { Button, Card, Input } from "antd";
import { AccumulatedRates } from "./AccumulatedRates";
import { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Factory } from "./Factory";
import { RateBalance } from "./accumulateRates";
import { Pencil, Save, X } from "lucide-react";
import { Cluster, SavedFactory } from "@/interfaces";

const useDropable = (
  cluster: SavedFactory[],
  onDropIntoCluster: (sourceId: string) => void
) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current!;
    const cleanupDropTarget = dropTargetForElements({
      element,
      canDrop: ({ source }) => !cluster.some((x) => x.id === source.data.id),
      onDrop: ({ source }) => onDropIntoCluster(source.data.id as string),
    });
    return () => {
      cleanupDropTarget();
    };
  }, [cluster]);
  return ref;
};

export const FactoryCluster = (props: {
  cluster: Cluster;
  rateBalance: RateBalance[];
  showResources: boolean;
  hoveredFactoryId?: string | null;
  updateCluster: (cluster: Cluster) => void;
  setHoveredFactoryId: (id?: string | null) => void;
  onDropIntoCluster: (sourceId: string) => void;
  onRemoveCluster: () => void;
  loadedFactory: SavedFactory | null;
  setLoadedFactory: (factory: SavedFactory | null) => void;
  setNewInCluster: (clusterId: string) => void;
}) => {
  const [hoveredAccumulatedProduct, setHoveredAccumulatedProduct] = useState<
    string | null
  >(null);
  const refDropable = useDropable(
    props.cluster.factories,
    props.onDropIntoCluster
  );
  const hoveredFactory = props.cluster.factories.find(
    (x) => x.id === props.hoveredFactoryId
  );
  const onMoveCard = (
    sourceId: string,
    targetId: string,
    closestEdge: "left" | "right"
  ) => {
    const sourceIndex = props.cluster.factories.findIndex(
      (x) => x.id === sourceId
    );
    const targetIndex = props.cluster.factories.findIndex(
      (x) => x.id === targetId
    );
    if (sourceIndex === -1) {
      //comes from another factory cluster
      return;
    }
    const insertionIndex =
      closestEdge === "left" ? targetIndex : targetIndex + 1;
    const firstPart = props.cluster.factories
      .slice(0, insertionIndex)
      .filter((x) => x.id !== sourceId);
    const lastPart = props.cluster.factories
      .slice(insertionIndex)
      .filter((x) => x.id !== sourceId);
    props.updateCluster({
      ...props.cluster,
      factories: [
        ...firstPart,
        props.cluster.factories[sourceIndex],
        ...lastPart,
      ],
    });
  };
  const onAddFactory = () => {
    const id = uuidv4();
    const initialFactory: SavedFactory = {
      id,
      productNodes: [
        {
          id,
          children: [],
          name: "",
          rate: 0,
          type: "ROOT",
        },
      ],
    };
    props.setLoadedFactory(initialFactory);
    props.setNewInCluster(props.cluster.id);
  };
  return (
    <Card
      title={
        <div className="flex justify-between">
          <EditableTitle
            title={props.cluster.title}
            submit={(title) => props.updateCluster({ ...props.cluster, title })}
          />
          <Button onClick={props.onRemoveCluster}>
            <X />
          </Button>
        </div>
      }
    >
      <div
        ref={refDropable}
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {props.cluster.factories.map((factory) => (
            <Factory
              key={factory.id}
              factory={factory}
              hoveredAccumulatedProduct={hoveredAccumulatedProduct}
              selected={props.loadedFactory?.id === factory.id}
              isHovered={props.hoveredFactoryId === factory.id}
              setLoadedFactory={props.setLoadedFactory}
              setHoveredFactoryId={props.setHoveredFactoryId}
              onDrop={onMoveCard}
            />
          ))}
          <div style={{ border: "solid", borderColor: "white" }}>
            <Button onClick={onAddFactory}>+ new</Button>
          </div>
        </div>
      </div>
      <AccumulatedRates
        showResources={props.showResources}
        rateBalance={props.rateBalance}
        cluster={props.cluster.factories}
        selectedFactory={props.loadedFactory}
        hoveredFactory={hoveredFactory}
        setHoveredAccumulatedProduct={setHoveredAccumulatedProduct}
      />
    </Card>
  );
};

const EditableTitle = (props: {
  title: string;
  submit: (title: string) => void;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [current, setCurrent] = useState(props.title);
  return editMode ? (
    <div className="flex gap-2 items-center">
      <Input
        style={{ width: 300 }}
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />
      <Save
        className="cursor-pointer transition-colors duration-200 hover:bg-gray-200"
        onClick={() => {
          props.submit(current);
          setEditMode(false);
        }}
      />
    </div>
  ) : (
    <div className="flex gap-2 items-center">
      {props.title}
      <Pencil
        className="cursor-pointer transition-colors duration-200 hover:bg-gray-200"
        onClick={() => setEditMode(true)}
      />
    </div>
  );
};
