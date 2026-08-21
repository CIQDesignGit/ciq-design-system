import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionMarkdown } from "@/atoms/section-markdown";

const meta: Meta<typeof SectionMarkdown> = {
  title: "Atoms/SectionMarkdown",
  component: SectionMarkdown,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof SectionMarkdown>;

export const Default: Story = {
  args: {
    title: "Recommendation",
    children: <p>Shorten the title and lead with the brand.</p>,
  },
};
