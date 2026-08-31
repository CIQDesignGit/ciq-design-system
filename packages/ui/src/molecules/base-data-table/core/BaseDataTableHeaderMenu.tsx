import { EllipsisVertical } from "lucide-react";
import React from "react";

import { Button } from "@/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";

export type MenuOption = {
  id: string;
  label: string;
  action: () => void;
  disabled?: boolean;
};

export type MenuSection = {
  id: string;
  options: MenuOption[];
};

type BaseDataTableHeaderMenuProps = {
  readonly sections: MenuSection[];
  readonly customTrigger?: React.ReactNode;
  /** Optional portal container — no queryElement */
  readonly container?: HTMLElement | null;
};

export const BaseDataTableHeaderMenu: React.FC<BaseDataTableHeaderMenuProps> = ({
  sections,
  customTrigger,
  container,
}) => {
  const handleSelect = React.useCallback((action: () => void) => {
    return () => {
      action();
    };
  }, []);

  if (!sections || sections.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild data-testid="base-data-table-header-menu-dropdown-menu-trigger">
        <Button
          variant="ghost"
          size="sm"
          className="text-violet-500"
          data-testid="base-data-table-header-menu-ghost-btn"
        >
          {customTrigger ?? <EllipsisVertical className="h-4 w-4 text-violet-300" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48" container={container}>
        {sections.map((section, sectionIndex) => (
          <React.Fragment key={section.id}>
            {section.options.map((option) => (
              <DropdownMenuItem
                key={option.id}
                disabled={option.disabled}
                onSelect={handleSelect(option.action)}
                data-testid="base-data-table-header-menu-handle-select-menu-item"
              >
                {option.label}
              </DropdownMenuItem>
            ))}
            {sectionIndex < sections.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BaseDataTableHeaderMenu;
