import { useEffect, useState } from "react";
import { Cluster, SavedFactory } from "./interfaces";
import { FactoryPlanner } from "./components/factoryPlanner/FactoryPlanner";
import { Drawer } from "./Drawer";
import { twMerge } from "tailwind-merge";

export const Home = (props: {
  savedFactories: Cluster[];
  setSavedFactories: (newValue: Cluster[]) => void;
}) => {
  const [loadedFactory, setLoadedFactory] = useState<SavedFactory | null>(null);

  //stores in which cluster the new Factory will be created
  const [newInCluster, setNewInCluster] = useState<string | null>(null);

  const [drawerWidth, setDrawerWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newWidth = window.innerWidth - e.clientX;
        setDrawerWidth(Math.max(200, Math.min(newWidth, 800)));
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-auto transition-all duration-300">
        <FactoryPlanner
          loadedFactory={loadedFactory}
          setLoadedFactory={setLoadedFactory}
          savedFactories={props.savedFactories}
          setSavedFactories={props.setSavedFactories}
          setNewInCluster={setNewInCluster}
        />
      </div>

      {/* Drawer */}
      {loadedFactory && (
        <>
          {/* Resize handle */}
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
              setLoadedFactory={setLoadedFactory}
              savedFactories={props.savedFactories}
              setSavedFactories={props.setSavedFactories}
              newInCluster={newInCluster}
            />
          </div>
        </>
      )}
    </div>
  );
};
