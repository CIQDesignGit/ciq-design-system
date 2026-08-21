import type { Meta, StoryObj } from "@storybook/react-vite";
import { Loader } from "@/atoms/loader";

const meta: Meta<typeof Loader> = {
  title: "Atoms/Loader",
  component: Loader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Default: Story = { args: { variant: "circular" } };
