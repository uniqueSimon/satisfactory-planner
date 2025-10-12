import { Cluster, SavedFactory } from "./interfaces";
import { ProductionTree } from "./components/productionTree/ProductionTree";

export const Drawer = (props: {
  savedFactories: Cluster[];
  setSavedFactories: (newValue: Cluster[]) => void;
  clickedFactoryId: string;
  setClickedFactoryId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const combinedSavedFactories = props.savedFactories
    .map((x) => x.factories)
    .flat();
  const selectedSavedSettings = combinedSavedFactories.find(
    (x) => x.id === props.clickedFactoryId
  )!;

  const onDelete = (id: string) => {
    props.setClickedFactoryId(null);
    props.setSavedFactories(
      props.savedFactories.map((cluster) => ({
        ...cluster,
        factories: cluster.factories.filter((x) => x.id !== id),
      }))
    );
  };
  const onCopy = (factory: SavedFactory) => {
    props.setSavedFactories([
      ...props.savedFactories,
      { title: "Copied", factories: [factory] },
    ]);
  };
  const onChangeFactory = (changedFactory: SavedFactory) =>
    props.setSavedFactories(
      props.savedFactories.map((cluster) => ({
        ...cluster,
        factories: cluster.factories.map((factory) =>
          factory.id === props.clickedFactoryId ? changedFactory : factory
        ),
      }))
    );
  return (
    <ProductionTree
      savedFactory={selectedSavedSettings}
      setProductNodes={(productNodes) =>
        onChangeFactory({ id: selectedSavedSettings.id, productNodes })
      }
      onClose={() => props.setClickedFactoryId(null)}
      onDelete={onDelete}
      onCopy={onCopy}
    />
  );
};
