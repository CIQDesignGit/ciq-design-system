import type { Meta, StoryObj } from "@storybook/react-vite";

import { ThemeProvider } from "@/atoms/theme-provider";
import { ThemeSwitcher } from "@/atoms/theme-switcher";

const meta: Meta<typeof ThemeSwitcher> = {
  title: "Atoms/ThemeSwitcher",
  component: ThemeSwitcher,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Dropdown for color scheme (light/dark/system) and theme variant. Renders inside library `ThemeProvider` — host apps may supply controlled `colorScheme` / `themeName` props instead.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ThemeSwitcher>;

export const Default: Story = {};

export const DarkModeDefault: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider defaultScheme="dark" defaultThemeName="modern-minimal">
        <Story />
      </ThemeProvider>
    ),
  ],
};
