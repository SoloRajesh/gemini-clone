import { createContext, useContext } from "react";
import type { ContextType } from "../interface";

export const Context = createContext<ContextType | undefined>(undefined);

export const useAppContext = (): ContextType => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useAppContext must be used within a ContextProvider");
  }
  return context;
};
