import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { Cluster, SavedFactory } from "./interfaces";
import { FactoryPlanner } from "./components/factoryPlanner/FactoryPlanner";
import { Drawer } from "./Drawer";
import { twMerge } from "tailwind-merge";
import {
  UnsavedChangesDialog,
  DeleteConfirmationDialog,
} from "./components/ConfirmationDialogs";
import { useDraggingDrawer } from "./reusableComp/useDraggingDrawer";
import { useDirtyState } from "./DirtyStateContext";

export const Home = (props: {
  savedFactories: Cluster[];
  setSavedFactories: (newValue: React.SetStateAction<Cluster[]>) => void;
}) => {
  const { isDirty, setIsDirty } = useDirtyState();
  const [loadedFactory, setLoadedFactory] = useState<SavedFactory | null>(null);
  const [pendingFactory, setPendingFactory] = useState<SavedFactory | null>(
    null
  );
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  //stores in which cluster the new Factory will be created
  const [newInCluster, setNewInCluster] = useState<string | null>(null);

  const { drawerWidth, isDragging, setIsDragging } = useDraggingDrawer();

  const handleSwitchLoadedFactory = (factory: SavedFactory) => {
    if (isDirty) {
      setPendingFactory(factory);
      setShowUnsavedDialog(true);
    } else {
      setLoadedFactory(factory);
    }
  };
  const handleConfirmSwitch = () => {
    setLoadedFactory(pendingFactory);
    setIsDirty(false);
    setPendingFactory(null);
    setShowUnsavedDialog(false);
  };

  const handleConfirmDelete = () => {
    setLoadedFactory(null);
    setIsDirty(false);
    props.setSavedFactories((prev) =>
      prev.map((cluster) => ({
        ...cluster,
        factories: cluster.factories.filter((x) => x.id !== loadedFactory!.id),
      }))
    );
    setShowDeleteDialog(false);
  };

  const onClickedDrawerButton = (
    type: "SAVE" | "DELETE" | "COPY" | "CLOSE"
  ) => {
    switch (type) {
      case "SAVE":
        props.setSavedFactories((prev) => {
          const alreadyExists = prev.some((cluster) =>
            cluster.factories.some((f) => f.id === loadedFactory!.id)
          );
          if (alreadyExists) {
            return prev.map((cluster) => ({
              ...cluster,
              factories: cluster.factories.map((factory) =>
                factory.id === loadedFactory!.id ? loadedFactory! : factory
              ),
            }));
          }
          return prev.map((cluster) =>
            cluster.id === newInCluster
              ? {
                  ...cluster,
                  factories: [...cluster.factories, loadedFactory!],
                }
              : cluster
          );
        });
        setIsDirty(false);
        break;

      case "DELETE":
        setShowDeleteDialog(true);
        break;

      case "COPY":
        props.setSavedFactories((prev) => [
          ...prev,
          {
            id: uuidv4(),
            title: "Copied",
            factories: [{ ...loadedFactory!, id: uuidv4() }],
          },
        ]);
        break;

      case "CLOSE":
        if (isDirty) {
          setPendingFactory(null);
          setShowUnsavedDialog(true);
        } else {
          setLoadedFactory(null);
        }
        break;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 overflow-auto transition-all duration-300">
        <FactoryPlanner
          loadedFactory={loadedFactory}
          setLoadedFactory={handleSwitchLoadedFactory}
          savedFactories={props.savedFactories}
          setSavedFactories={props.setSavedFactories}
          setNewInCluster={setNewInCluster}
          removeLoadedFactory={() => {
            setLoadedFactory(null);
            setIsDirty(false);
          }}
        />
      </div>

      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onConfirm={handleConfirmSwitch}
        onCancel={() => {
          setShowUnsavedDialog(false);
          setPendingFactory(null);
        }}
      />

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {loadedFactory && (
        <>
          <div
            className="w-2 cursor-col-resize bg-gray-400"
            onMouseDown={() => setIsDragging(true)}
          />

          <div
            className={twMerge(
              "bg-gray-200 h-full overflow-auto",
              !isDragging && "transition-all duration-300 ease-in-out"
            )}
            style={{ width: drawerWidth }}
          >
            <Drawer
              loadedFactory={loadedFactory}
              setLoadedFactory={(loadedFactory) => {
                setLoadedFactory(loadedFactory);
                setIsDirty(true);
              }}
              onClickedDrawerButton={onClickedDrawerButton}
            />
          </div>
        </>
      )}
    </div>
  );
};
