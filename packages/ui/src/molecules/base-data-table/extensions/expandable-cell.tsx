import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import React from "react";

import { Button } from "@/atoms/button";
import { cn } from "@/lib/utils";

export type ExpandableCellProps = {
  readonly isExpanded: boolean;
  readonly onToggle: () => void;
  readonly isLoading?: boolean;
  readonly hasSubRows?: boolean;
  readonly depth?: number;
  readonly children?: React.ReactNode;
};

export const ExpandableCell: React.FC<ExpandableCellProps> = ({
  isExpanded,
  onToggle,
  isLoading = false,
  hasSubRows = true,
  depth = 0,
  children,
}) => {
  return (
    <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 24}px` }}>
      {hasSubRows && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={cn(
            "flex-shrink-0 w-5 h-5 p-0 flex items-center justify-center",
            "hover:bg-accent transition-colors"
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      )}
      <span className="truncate">{children}</span>
    </div>
  );
};

export default ExpandableCell;
