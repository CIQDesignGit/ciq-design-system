import type { Meta, StoryObj } from "@storybook/react-vite";
import { Message, MessageContent } from "@/atoms/message";

const meta: Meta<typeof Message> = {
  title: "Atoms/Message",
  component: Message,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Message>;

export const Default: Story = {
  render: () => (
    <Message>
      <MessageContent>Why did conversion drop for this ASIN last week?</MessageContent>
    </Message>
  ),
};
