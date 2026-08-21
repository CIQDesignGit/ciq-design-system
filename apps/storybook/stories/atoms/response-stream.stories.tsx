import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResponseStream } from "@/atoms/response-stream";

const meta: Meta<typeof ResponseStream> = {
  title: "Atoms/ResponseStream",
  component: ResponseStream,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ResponseStream>;

export const Default: Story = { args: { text: "Streaming a reply..." } };
