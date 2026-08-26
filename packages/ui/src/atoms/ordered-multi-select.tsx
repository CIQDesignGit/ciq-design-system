import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import React, { useCallback, useMemo } from "react";

import { Badge } from "@/atoms/badge";
import { Button } from "@/atoms/button";
import { Checkbox } from "@/atoms/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/atoms/popover";
import { cn } from "@/lib/utils";

export interface OrderedMultiSelectOption {
  value: string;
  label: string;
}

export interface OrderedMultiSelectProps {
  readonly options: ReadonlyArray<OrderedMultiSelectOption>;
  readonly selected: string[];
  readonly onChange: (next: string[]) => void;
  readonly maxSelections?: number;
  /** Show numbered badges on sortable items (default: true) */
  readonly showIndex?: boolean;
  /** Minimum items that must remain selected (default: 0) */
  readonly minSelections?: number;
  readonly placeholder?: string;
  /** Render content directly without a popover wrapper (default: false) */
  readonly inline?: boolean;
  /** Custom trigger element for popover mode. Ignored when inline. */
  readonly trigger?: React.ReactNode;
  /** Popover alignment — ignored when inline (default: "start") */
  readonly align?: "start" | "center" | "end";
}

const DEFAULT_MAX = 4;

function SortableItem({
  id,
  label,
  index,
  showIndex,
  canRemove,
  onRemove,
}: Readonly<{
  id: string;
  label: string;
  index: number;
  showIndex: boolean;
  canRemove: boolean;
  onRemove: (value: string) => void;
}>): React.ReactElement {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex min-w-0 items-center gap-1.5 rounded-md bg-white px-2 py-1 shadow-xs border border-slate-100",
        isDragging && "z-50 shadow-md"
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-slate-400 hover:text-slate-600 active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label={`Drag to reorder ${label}`}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      {showIndex && (
        <Badge
          variant="outline"
          className="h-5 w-5 shrink-0 justify-center p-0 text-[10px] font-semibold text-slate-500"
        >
          {index + 1}
        </Badge>
      )}
      <span className="flex-1 truncate text-xs text-slate-700">{label}</span>
      {canRemove && (
        <button
          type="button"
          className="rounded p-0.5 text-slate-400 hover:text-red-500 transition-colors"
          onClick={() => onRemove(id)}
          aria-label={`Remove ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export function OrderedMultiSelect({
  options,
  selected,
  onChange,
  maxSelections = DEFAULT_MAX,
  showIndex = true,
  minSelections = 0,
  placeholder = "Select dimensions…",
  inline = false,
  trigger,
  align = "start",
}: OrderedMultiSelectProps): React.ReactElement {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const optionValues = useMemo(() => new Set(options.map((o) => o.value)), [options]);

  const validSelected = useMemo(
    () => selected.filter((v) => optionValues.has(v)),
    [selected, optionValues]
  );

  const selectedLabels = useMemo(() => {
    const labelMap = new Map(options.map((o) => [o.value, o.label]));
    return validSelected.map((v) => ({ value: v, label: labelMap.get(v) ?? v }));
  }, [options, validSelected]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent): void => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = validSelected.indexOf(String(active.id));
      const newIndex = validSelected.indexOf(String(over.id));
      if (oldIndex === -1 || newIndex === -1) return;
      onChange(arrayMove(validSelected, oldIndex, newIndex));
    },
    [validSelected, onChange]
  );

  const handleToggle = useCallback(
    (value: string, checked: boolean): void => {
      if (checked) {
        if (validSelected.length >= maxSelections) return;
        onChange([...validSelected, value]);
      } else {
        const next = validSelected.filter((v) => v !== value);
        if (next.length < minSelections) return;
        onChange(next);
      }
    },
    [validSelected, onChange, maxSelections, minSelections]
  );

  const handleRemove = useCallback(
    (value: string): void => {
      const next = validSelected.filter((v) => v !== value);
      if (next.length < minSelections) return;
      onChange(next);
    },
    [validSelected, onChange, minSelections]
  );

  const canRemove = validSelected.length > minSelections;
  const atLimit = validSelected.length >= maxSelections;

  const sortableList = validSelected.length > 0 && (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={validSelected} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-1">
          {selectedLabels.map((item, index) => (
            <SortableItem
              key={item.value}
              id={item.value}
              label={item.label}
              index={index}
              showIndex={showIndex}
              canRemove={canRemove}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );

  const checkboxList = (
    <div className="flex flex-col gap-0.5">
      <div className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {validSelected.length === 0
          ? "Select dimensions"
          : `${validSelected.length}/${maxSelections} selected`}
      </div>
      {options.map((opt) => {
        const isSelected = validSelected.includes(opt.value);
        return (
          <label
            key={opt.value}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs cursor-pointer hover:bg-slate-50 transition-colors",
              isSelected && "bg-slate-50 font-medium",
              !isSelected && atLimit && "opacity-50 cursor-not-allowed"
            )}
          >
            <Checkbox
              checked={isSelected}
              disabled={!isSelected && atLimit}
              onCheckedChange={(checked) => handleToggle(opt.value, checked === true)}
            />
            <span className="truncate">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );

  const unselectedCount = options.filter((o) => !validSelected.includes(o.value)).length;
  const addDisabled = atLimit || unselectedCount === 0;

  const addButtonLabel =
    validSelected.length === 0
      ? placeholder
      : addDisabled
        ? `${validSelected.length} dimension${validSelected.length > 1 ? "s" : ""} selected`
        : `Add dimension (${validSelected.length}/${maxSelections})`;

  const coreContent = (
    <div className="min-w-0 space-y-2">
      {sortableList}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs font-normal text-slate-500"
            disabled={addDisabled}
          >
            {addButtonLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align={align} sideOffset={4}>
          {checkboxList}
        </PopoverContent>
      </Popover>
    </div>
  );

  if (inline) return coreContent;

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start text-xs font-normal text-slate-500"
    >
      {addButtonLabel}
    </Button>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger ?? defaultTrigger}</PopoverTrigger>
      <PopoverContent className="w-72 p-2" align={align} sideOffset={4}>
        {coreContent}
      </PopoverContent>
    </Popover>
  );
}
