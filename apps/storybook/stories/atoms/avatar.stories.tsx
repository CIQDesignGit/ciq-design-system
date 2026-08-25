import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback, AvatarImage } from "@/atoms/avatar";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A circular avatar for a customer's team member or account. Compose it from
\`Avatar\`, \`AvatarImage\`, and \`AvatarFallback\` - the fallback renders
automatically (e.g. initials) when the image fails to load or hasn't loaded yet.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: false,
      description: "Additional class names for the avatar root.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

/** Avatar with a working image and an initials fallback. */
export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Priya Raman" />
      <AvatarFallback>PR</AvatarFallback>
    </Avatar>
  ),
};

/** Broken/missing image URL - falls back to initials. */
export const ImageFailsToLoad: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage
        src="https://broken.example.com/does-not-exist.png"
        alt="Jordan Lee"
      />
      <AvatarFallback>JL</AvatarFallback>
    </Avatar>
  ),
};

/** No image at all, just the fallback initials. */
export const FallbackOnly: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AK</AvatarFallback>
    </Avatar>
  ),
};

/** Larger avatar via className override. */
export const Large: Story = {
  render: (args) => (
    <Avatar {...args} className="h-16 w-16">
      <AvatarImage src="https://i.pravatar.cc/160?img=32" alt="Sam Torres" />
      <AvatarFallback className="text-lg">ST</AvatarFallback>
    </Avatar>
  ),
};

/** A row of avatars, as seen in a "shared with" list. */
export const Group: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="border-2 border-white">
        <AvatarImage src="https://i.pravatar.cc/80?img=5" alt="Priya Raman" />
        <AvatarFallback>PR</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white">
        <AvatarImage src="https://i.pravatar.cc/80?img=15" alt="Jordan Lee" />
        <AvatarFallback>JL</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white">
        <AvatarFallback>+4</AvatarFallback>
      </Avatar>
    </div>
  ),
};
