import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatContainerContent, ChatContainerRoot } from "@/atoms/chat-container";
import { Message, MessageContent } from "@/atoms/message";

const meta: Meta<typeof ChatContainerRoot> = {
  title: "Atoms/ChatContainer",
  component: ChatContainerRoot,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ChatContainerRoot>;

export const Default: Story = {
  render: () => (
    <ChatContainerRoot className="h-64 border rounded-lg">
      <ChatContainerContent>
        <Message>
          <MessageContent>Hello from Blake.</MessageContent>
        </Message>
      </ChatContainerContent>
    </ChatContainerRoot>
  ),
};
