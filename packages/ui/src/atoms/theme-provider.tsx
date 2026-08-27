import * as React from "react";

export type ColorScheme = "light" | "dark" | "system";

export type ThemeName = "modern-minimal" | "amber" | "tangerine" | "default";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  themeName: ThemeName;
  setColorScheme: (scheme: ColorScheme) => void;
  setThemeName: (name: ThemeName) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export type ThemeProviderProps = {
  readonly children: React.ReactNode;
  readonly defaultScheme?: ColorScheme;
  readonly defaultThemeName?: ThemeName;
  /** Host may persist scheme/name — library does not write localStorage by default. */
  readonly colorScheme?: ColorScheme;
  readonly themeName?: ThemeName;
  readonly onColorSchemeChange?: (scheme: ColorScheme) => void;
  readonly onThemeNameChange?: (name: ThemeName) => void;
};

export function ThemeProvider({
  children,
  defaultScheme = "system",
  defaultThemeName = "default",
  colorScheme: colorSchemeProp,
  themeName: themeNameProp,
  onColorSchemeChange,
  onThemeNameChange,
}: ThemeProviderProps) {
  const [internalScheme, setInternalScheme] = React.useState<ColorScheme>(defaultScheme);
  const [internalThemeName, setInternalThemeName] = React.useState<ThemeName>(defaultThemeName);

  const colorScheme = colorSchemeProp ?? internalScheme;
  const themeName = themeNameProp ?? internalThemeName;

  const setColorScheme = React.useCallback(
    (scheme: ColorScheme) => {
      if (colorSchemeProp === undefined) setInternalScheme(scheme);
      onColorSchemeChange?.(scheme);
    },
    [colorSchemeProp, onColorSchemeChange]
  );

  const setThemeName = React.useCallback(
    (name: ThemeName) => {
      if (themeNameProp === undefined) setInternalThemeName(name);
      onThemeNameChange?.(name);
    },
    [themeNameProp, onThemeNameChange]
  );

  React.useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const isDark = colorScheme === "dark" || (colorScheme === "system" && mq.matches);
      root.classList.toggle("dark", isDark);
      if (themeName === "default") {
        root.removeAttribute("data-theme");
      } else {
        root.setAttribute("data-theme", themeName);
      }
    };
    apply();
    const handler = () => colorScheme === "system" && apply();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [colorScheme, themeName]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      colorScheme,
      themeName,
      setColorScheme,
      setThemeName,
    }),
    [colorScheme, themeName, setColorScheme, setThemeName]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
