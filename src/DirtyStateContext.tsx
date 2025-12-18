import { createContext, useContext, useState, ReactNode } from "react";

interface DirtyStateContextType {
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
}

const DirtyStateContext = createContext<DirtyStateContextType | undefined>(
  undefined
);

export const DirtyStateProvider = ({ children }: { children: ReactNode }) => {
  const [isDirty, setIsDirty] = useState(false);

  return (
    <DirtyStateContext.Provider value={{ isDirty, setIsDirty }}>
      {children}
    </DirtyStateContext.Provider>
  );
};

export const useDirtyState = () => {
  const context = useContext(DirtyStateContext);
  if (context === undefined) {
    throw new Error("useDirtyState must be used within a DirtyStateProvider");
  }
  return context;
};
