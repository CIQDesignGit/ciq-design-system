/**
 * Table V2 Action Types
 * Type definitions for all header column actions
 */

// Sort actions
export type SortAction = {
  type: "sort";
  columnId: string;
  sortType: "regular" | "pvp" | "custom";
  direction: "asc" | "desc";
  customConfig?: {
    field: string;
    dir: "asc" | "desc";
  };
};

// Pin actions
export type PinAction = {
  type: "pin";
  columnId: string;
  position: "left" | "right" | false;
};

// Hide action
export type HideAction = {
  type: "hide";
  columnId: string;
};

// Base action type (union of all possible actions)
export type HeaderAction = SortAction | PinAction | HideAction;
