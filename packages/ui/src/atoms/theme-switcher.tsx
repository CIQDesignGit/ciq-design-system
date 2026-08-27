import { MonitorCog, Moon, Palette, Sun } from "lucide-react";

import { Button } from "@/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/atoms/dropdown-menu";
import { useTheme, type ColorScheme, type ThemeName } from "@/atoms/theme-provider";

export function ThemeSwitcher() {
  const { colorScheme, themeName, setColorScheme, setThemeName } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild data-testid="theme-switcher-dropdown-menu-trigger">
        <Button
          variant="outline"
          size="sm"
          aria-label="Theme settings"
          data-testid="theme-switcher-theme-settings-btn"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" /> Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="opacity-70">Color scheme</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={colorScheme}
          onValueChange={(value) => setColorScheme(value as ColorScheme)}
        >
          <DropdownMenuRadioItem
            value="light"
            data-testid="theme-switcher-dropdown-menu-radio-item-element"
          >
            <Sun className="h-4 w-4 mr-2" /> Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="dark"
            data-testid="theme-switcher-dropdown-menu-radio-item-element-2"
          >
            <Moon className="h-4 w-4 mr-2" /> Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="system"
            data-testid="theme-switcher-dropdown-menu-radio-item-element-3"
          >
            <MonitorCog className="h-4 w-4 mr-2" /> System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="opacity-70">Theme variant</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={themeName}
          onValueChange={(value) => setThemeName(value as ThemeName)}
        >
          <DropdownMenuRadioItem
            value="modern-minimal"
            data-testid="theme-switcher-dropdown-menu-radio-item-element-4"
          >
            Modern Minimal
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="amber"
            data-testid="theme-switcher-dropdown-menu-radio-item-element-5"
          >
            Amber
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="tangerine"
            data-testid="theme-switcher-dropdown-menu-radio-item-element-6"
          >
            Tangerine
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="default"
            data-testid="theme-switcher-dropdown-menu-radio-item-element-7"
          >
            Default
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
