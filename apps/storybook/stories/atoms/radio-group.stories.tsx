import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup, RadioGroupItem } from "@/atoms/radio-group";
import { Label } from "@/atoms/label";

const meta: Meta<typeof RadioGroup> = {
  title: "Atoms/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="amazon">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="amazon" id="amazon" />
        <Label htmlFor="amazon">Amazon</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="walmart" id="walmart" />
        <Label htmlFor="walmart">Walmart</Label>
      </div>
    </RadioGroup>
  ),
};
