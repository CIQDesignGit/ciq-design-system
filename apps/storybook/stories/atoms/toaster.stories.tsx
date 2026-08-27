import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";

import { Button } from "@/atoms/button";
import { GlobalToaster } from "@/atoms/toaster";
import { enqueueToast } from "@/lib/toast";

const ToasterDemo = ({ autoFire }: { readonly autoFire?: () => void }) => {
  useEffect(() => {
    autoFire?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-64 flex-col justify-end gap-2">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() =>
            enqueueToast({ title: "Price change saved", description: "SKU-4471 updated to $22.99." })
          }
        >
          Default toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            enqueueToast({
              variant: "success",
              title: "Buy box reclaimed",
              description: "SKU-4471 is back in the Amazon US buy box.",
            })
          }
        >
          Success toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            enqueueToast({
              variant: "warning",
              title: "Inventory running low",
              description: "SKU-9013 has 6 units left across all fulfillment centers.",
            })
          }
        >
          Warning toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            enqueueToast({
              variant: "error",
              title: "Sync failed",
              description: "Couldn't refresh Walmart US pricing. Retrying in 5 minutes.",
            })
          }
        >
          Error toast
        </Button>
      </div>
      <GlobalToaster />
    </div>
  );
};

const meta: Meta<typeof GlobalToaster> = {
  title: "Atoms/Toaster",
  component: GlobalToaster,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Fixed-position toast container. Subscribes to `enqueueToast()` / `subscribeToToasts()` — mount once per app.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GlobalToaster>;

export const Default: Story = {
  render: () => <ToasterDemo />,
};

export const InfoToast: Story = {
  render: () => (
    <ToasterDemo
      autoFire={() =>
        enqueueToast({
          title: "Data refreshed",
          description: "Amazon US metrics were last updated 2 minutes ago.",
        })
      }
    />
  ),
};

export const SuccessToast: Story = {
  render: () => (
    <ToasterDemo
      autoFire={() =>
        enqueueToast({
          variant: "success",
          title: "Campaign launched",
          description: '"Q3 Home & Garden Push" is now live on Amazon US.',
        })
      }
    />
  ),
};

export const WarningToast: Story = {
  render: () => (
    <ToasterDemo
      autoFire={() =>
        enqueueToast({
          variant: "warning",
          title: "Budget nearly exhausted",
          description: "Campaign has spent 92% of its monthly budget.",
        })
      }
    />
  ),
};

export const ErrorToast: Story = {
  render: () => (
    <ToasterDemo
      autoFire={() =>
        enqueueToast({
          variant: "error",
          title: "Failed to save",
          description: "Could not update pricing rule. Please try again.",
        })
      }
    />
  ),
};
