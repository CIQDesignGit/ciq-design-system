import type { Meta, StoryObj } from "@storybook/react-vite";
import { Markdown } from "@/atoms/markdown";

const meta: Meta<typeof Markdown> = {
  title: "Atoms/Markdown",
  component: Markdown,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Markdown>;

export const Default: Story = {
  args: {
    children: (
      <>
        <p>
          <strong>Conversion</strong> dropped 12% week over week.
        </p>
      </>
    ),
  },
};
