import type { SetStateAction } from "react";

/**
 * Updater type for partial state updates (similar to React's SetStateAction)
 * Accepts either a partial state object or a function that receives prev state and returns partial
 */
export type PartialStateUpdater<T> = Partial<T> | ((prev: T) => Partial<T>);

/**
 * Resolves a SetStateAction to its value
 * Handles both direct values and functional updaters
 */
export function resolveSetStateAction<T>(action: SetStateAction<T>, prevValue: T): T {
  return typeof action === "function" ? (action as (prev: T) => T)(prevValue) : action;
}

/**
 * Resolves a PartialStateUpdater to a Partial<T>
 */
export function resolvePartialStateUpdater<T>(
  action: PartialStateUpdater<T>,
  prevValue: T
): Partial<T> {
  return typeof action === "function" ? action(prevValue) : action;
}
