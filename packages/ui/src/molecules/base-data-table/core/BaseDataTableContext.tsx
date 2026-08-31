/**
 * Table V2 Context
 * Shared context for table state and configuration
 */

import React, { createContext, useContext } from "react";

import type { BaseDataTableContextValue, BaseDataTableFeatures, CellRenderer } from "../types";
import type { BaseDataTableState, BaseDataTableStateHandlers, WidgetV2Schema } from "../types";

const BaseDataTableContext = createContext<BaseDataTableContextValue | null>(null);

export type BaseDataTableContextProviderProps = {
  readonly schema: WidgetV2Schema;
  readonly state: BaseDataTableState;
  readonly handlers: BaseDataTableStateHandlers;
  readonly features: Required<BaseDataTableFeatures>;
  readonly cellRenderers: Record<string, CellRenderer>;
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly children: React.ReactNode;
};

export const BaseDataTableContextProvider: React.FC<BaseDataTableContextProviderProps> = ({
  schema,
  state,
  handlers,
  features,
  cellRenderers,
  isLoading,
  error,
  children,
}) => {
  const value: BaseDataTableContextValue = {
    schema,
    state,
    handlers,
    features,
    cellRenderers,
    isLoading,
    error,
  };

  return <BaseDataTableContext.Provider value={value}>{children}</BaseDataTableContext.Provider>;
};

/**
 * Hook to access Table V2 context
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useBaseDataTableContext(): BaseDataTableContextValue {
  const context = useContext(BaseDataTableContext);
  if (!context) {
    throw new Error("useBaseDataTableContext must be used within BaseDataTableContextProvider");
  }
  return context;
}

export default BaseDataTableContext;
