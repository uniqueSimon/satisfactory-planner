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
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 transition-all duration-300">
        <FactoryPlanner
          loadedFactory={loadedFactory}
          setLoadedFactory={setLoadedFactory}
          savedFactories={props.savedFactories}
          setSavedFactories={props.setSavedFactories}
        />
      </div>

      {/* Drawer */}
      {loadedFactory && (
        <>
          <div
            className="w-2 cursor-col-resize bg-gray-400"
            onMouseDown={() => setIsDragging(true)}
          />
          <div
            className={twMerge(
              "bg-gray-200",
              !isDragging && "transition-all duration-300 ease-in-out"
            )}
            style={{ width: drawerWidth }}
          >
            <Drawer
              loadedFactory={loadedFactory}
              setLoadedFactory={setLoadedFactory}
              savedFactories={props.savedFactories}
              setSavedFactories={props.setSavedFactories}
            />
          </div>
        </>
      )}
    </div>
  );
};
