import { v4 as uuidv4 } from "uuid";
import { Cluster, SavedFactory } from "./interfaces";
import { ProductionTree } from "./components/productionTree/ProductionTree";
import { Button } from "@/components/ui/button";
import { Copy, Save, Trash, X } from "lucide-react";
import { Icon } from "./reusableComp/Icon";
import { productDisplayNameMapping } from "./App";

export const Drawer = (props: {
  savedFactories: Cluster[];
  setSavedFactories: (
    newValue: Cluster[] | ((prev: Cluster[]) => Cluster[])
  ) => void;
  loadedFactory: SavedFactory;
  setLoadedFactory: (factory: SavedFactory | null) => void;
  newInCluster: string | null;
}) => {
  const nodes = props.loadedFactory.productNodes;
  const root = nodes.find((node) => node.type === "ROOT");

  const onDelete = () => {
    props.setLoadedFactory(null);
    props.setSavedFactories((prev) =>
      prev.map((cluster) => ({
        ...cluster,
        factories: cluster.factories.filter(
          (x) => x.id !== props.loadedFactory.id
        ),
      }))
    );
  };
  const onCopy = () => {
    props.setSavedFactories((prev) => [
      ...prev,
      {
        id: uuidv4(),
        title: "Copied",
        factories: [{ ...props.loadedFactory, id: uuidv4() }],
      },
    ]);
  };
  const onSave = () => {
    props.setSavedFactories((prev) => {
      const alreadyExists = prev.some((cluster) =>
        cluster.factories.some((f) => f.id === props.loadedFactory.id)
      );
      if (alreadyExists) {
        return prev.map((cluster) => ({
          ...cluster,
          factories: cluster.factories.map((factory) =>
            factory.id === props.loadedFactory.id
              ? props.loadedFactory
              : factory
          ),
        }));
      } else {
        return prev.map((cluster) =>
          cluster.id === props.newInCluster
            ? {
                ...cluster,
                factories: [...cluster.factories, props.loadedFactory],
              }
            : cluster
        );
      }
    });
  };
  const onClose = () => props.setLoadedFactory(null);

  const notReadyForSaving =
    !root || !root.name || !root.rate || !root.buildRecipe;

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-2 py-1 border-2 bg-gray-200 text-xl font-semibold">
        {root?.name ? (
          <div className="flex gap-2 items-center">
            <Icon item={root.name} />
            {productDisplayNameMapping.get(root.name)}
          </div>
        ) : (
          <div>New factory!</div>
        )}
        <div>
          <Button
            variant="outline"
            onClick={onSave}
            disabled={notReadyForSaving}
          >
            <Save />
          </Button>
          <Button
            variant="outline"
            onClick={onDelete}
            disabled={notReadyForSaving}
          >
            <Trash />
          </Button>
          <Button
            variant="outline"
            onClick={onCopy}
            disabled={notReadyForSaving}
          >
            <Copy />
          </Button>
          <Button variant="outline" onClick={onClose}>
            <X />
          </Button>
        </div>
      </div>
      <ProductionTree
        savedFactory={props.loadedFactory}
        setProductNodes={(productNodes) => {
          const newNodes =
            typeof productNodes === "function"
              ? productNodes(props.loadedFactory.productNodes)
              : productNodes;
          props.setLoadedFactory({
            id: props.loadedFactory.id,
            productNodes: newNodes,
          });
        }}
      />
    </div>
  );
};
