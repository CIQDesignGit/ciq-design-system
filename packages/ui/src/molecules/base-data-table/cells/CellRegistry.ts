import type { CellRegistryType, RegisteredCellRenderer } from "../types";

const cellRegistry = new Map<string, RegisteredCellRenderer>();

export function registerCell(type: string, renderer: RegisteredCellRenderer): void {
  if (cellRegistry.has(type)) {
    throw new Error(`Cell renderer for type ${type} already registered`);
  }

  cellRegistry.set(type, renderer);
}

export function getCell(type: string): RegisteredCellRenderer | undefined {
  return cellRegistry.get(type);
}

export function hasCell(type: string): boolean {
  return cellRegistry.has(type);
}

export function unregisterCell(type: string): void {
  cellRegistry.delete(type);
}

export function clearCellRegistry(): void {
  cellRegistry.clear();
}

export function getRegisteredTypes(): string[] {
  return Array.from(cellRegistry.keys());
}

export const CellRegistry: CellRegistryType = {
  register: registerCell,
  get: getCell,
  has: hasCell,
  unregister: unregisterCell,
  clear: clearCellRegistry,
};

export default CellRegistry;
