import { Boxes, Building2, ShieldCheck } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type SecondaryHeaderItem = {
  /** Unique identifier for the item */
  id: string;
  /** Label text to display */
  label: string;
  /** Icon type - determines which icon to show */
  icon: "building-2" | "boxes" | "shield-check" | React.ReactNode;
};

export type SecondaryHeaderProps = {
  /** Array of items to display in the header */
  readonly items: SecondaryHeaderItem[];
  /** Additional className for the container */
  readonly className?: string;
};

const iconMap = {
  "building-2": Building2,
  boxes: Boxes,
  "shield-check": ShieldCheck,
};

/**
 * SecondaryHeader component - displays context information as a horizontal bar
 * Used below the page header to show current filters/context like platform, scope, task type
 */
export function SecondaryHeader({ items, className }: SecondaryHeaderProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-gray-200 flex-wrap",
        className
      )}
    >
      {items.map((item) => {
        // Determine the icon to render
        let IconComponent: React.ReactNode;
        if (typeof item.icon === "string" && item.icon in iconMap) {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          IconComponent = <Icon className="h-4 w-4 text-slate-400" />;
        } else if (React.isValidElement(item.icon)) {
          IconComponent = item.icon;
        } else {
          IconComponent = null;
        }

        return (
          <div
            key={item.id}
            className="flex items-center gap-2 px-2 py-0.5 bg-white border border-slate-100 rounded-full text-xs font-normal leading-normal text-slate-950"
          >
            {IconComponent}
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default SecondaryHeader;
