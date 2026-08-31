import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { Button } from "@/atoms/button";
import {
  ConfirmationModal,
  type ConfirmationModalProps,
} from "@/molecules/confirmation-modal";

const ControlledConfirmationModal = (props: ConfirmationModalProps) => {
  const [isOpen, setIsOpen] = useState(props.isOpen);

  return (
    <div className="flex h-[420px] items-start justify-center pt-8">
      <Button onClick={() => setIsOpen(true)}>Reopen modal</Button>
      <ConfirmationModal
        {...props}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          props.onClose();
        }}
        onConfirm={() => {
          setIsOpen(false);
          props.onConfirm();
        }}
      />
    </div>
  );
};

const meta: Meta<typeof ConfirmationModal> = {
  title: "Molecules/ConfirmationModal",
  component: ConfirmationModal,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Centered confirmation dialog on `Layover`. Supports destructive confirm and optional don't-show-again via localStorage key.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: { control: "boolean" },
    title: { control: "text" },
    message: { control: "text" },
    confirmLabel: { control: "text" },
    cancelLabel: { control: "text" },
    confirmVariant: { control: "inline-radio", options: ["default", "destructive"] },
    showDontShowAgain: { control: "boolean" },
    dontShowAgainKey: { control: "text" },
    width: { control: "text" },
    isLoading: { control: "boolean" },
    onClose: { action: "closed" },
    onConfirm: { action: "confirmed" },
    children: { control: false },
  },
  args: {
    isOpen: true,
    title: "Discard unsaved changes?",
    message:
      "You have unsaved edits to 12 SKU titles in this Amazon listing optimization task. Leaving now will discard them.",
    confirmLabel: "Discard",
    cancelLabel: "Keep editing",
    confirmVariant: "default",
    showDontShowAgain: false,
    width: "560px",
    isLoading: false,
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmationModal>;

export const Default: Story = {
  render: (args) => <ControlledConfirmationModal {...args} />,
};

export const Destructive: Story = {
  render: (args) => <ControlledConfirmationModal {...args} />,
  args: {
    title: "Delete this report?",
    message: 'This will permanently delete "Amazon Q3 Share of Voice" for all collaborators.',
    confirmLabel: "Delete report",
    cancelLabel: "Cancel",
    confirmVariant: "destructive",
  },
};

export const WithDontShowAgain: Story = {
  render: (args) => <ControlledConfirmationModal {...args} />,
  args: {
    title: "Publish content changes?",
    message: "These SKU title and bullet updates will be pushed live to Amazon.",
    confirmLabel: "Publish",
    showDontShowAgain: true,
    dontShowAgainKey: "storybook-confirm-publish",
  },
};

export const WithCustomContent: Story = {
  render: (args) => <ControlledConfirmationModal {...args} />,
  args: {
    title: "Confirm bulk price update",
    message: undefined,
    confirmLabel: "Apply to 8 SKUs",
    children: (
      <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
        <li>B08XJQZ1K2 — Wireless Headphones: $149.99 → $139.99</li>
        <li>B07YTX9WQ4 — Smart Watch Pro: $299.99 → $279.99</li>
        <li>B09PLM3FRT — Bluetooth Speaker: $59.99 → $54.99</li>
      </ul>
    ),
  },
};

export const Loading: Story = {
  render: (args) => <ControlledConfirmationModal {...args} />,
  args: {
    title: "Publishing changes...",
    message: "Pushing updated SKU titles to Walmart. This can take a few moments.",
    confirmLabel: "Publish",
    isLoading: true,
  },
};
