import { useLocalStorage } from "@/reusableComp/useLocalStorage";
import { createContext, useContext, ReactNode } from "react";

interface TreeSettingsContextType {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  showWeights: boolean;
  setShowWeights: (showWeights: boolean) => void;
}

const TreeSettingsContext = createContext<TreeSettingsContextType | undefined>(
  undefined
);

export const TreeSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [editMode, setEditMode] = useLocalStorage<boolean>("editMode", true);
  const [showWeights, setShowWeights] = useLocalStorage<boolean>(
    "showWeights",
    false
  );

  return (
    <TreeSettingsContext.Provider value={{ editMode, setEditMode, showWeights, setShowWeights }}>
      {children}
    </TreeSettingsContext.Provider>
  );
};

export const useTreeSettings = () => {
  const context = useContext(TreeSettingsContext);
  if (context === undefined) {
    throw new Error("useTreeSettings must be used within a TreeSettingsProvider");
  }
  return context;
};

// Deprecated: Use useTreeSettings instead
export const useEditMode = useTreeSettings;
