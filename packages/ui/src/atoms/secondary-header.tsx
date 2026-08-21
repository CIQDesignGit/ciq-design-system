import * as React from "react";
import { Boxes, Building2, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

const iconMap = {
  "building-2": Building2,
  boxes: Boxes,
  "shield-check": ShieldCheck,
} as const;

export interface SecondaryHeaderItem {
  id: string;
  label: string;
  icon: keyof typeof iconMap | React.ReactNode;
}

export interface SecondaryHeaderProps {
  items: SecondaryHeaderItem[];
  className?: string;
}

function SecondaryHeader({ items, className }: SecondaryHeaderProps) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-gray-200 flex-wrap",
        className
      )}
    >
      {items.map((item) => {
        let icon: React.ReactNode = null;
        if (typeof item.icon === "string" && item.icon in iconMap) {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          icon = <Icon className="h-4 w-4 text-slate-400" />;
        } else if (React.isValidElement(item.icon)) {
          icon = item.icon;
        }

        return (
          <div
            key={item.id}
            className="flex items-center gap-2 px-2 py-0.5 bg-white border border-slate-100 rounded-full text-xs font-normal leading-normal text-slate-950"
          >
            {icon}
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export { SecondaryHeader };
