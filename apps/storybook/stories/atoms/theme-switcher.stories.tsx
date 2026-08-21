import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeSwitcher } from "@/atoms/theme-switcher";

const meta: Meta<typeof ThemeSwitcher> = {
  title: "Atoms/ThemeSwitcher",
  component: ThemeSwitcher,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ThemeSwitcher>;

export const Default: Story = { args: {} };
