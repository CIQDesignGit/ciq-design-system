import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart3, Boxes, LayoutDashboard, Megaphone, Settings, ShoppingCart } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/atoms/sidebar";

const NAV_ITEMS = [
  { title: "Dashboard", icon: LayoutDashboard, isActive: true },
  { title: "Digital shelf", icon: Boxes, isActive: false },
  { title: "Retail media", icon: Megaphone, isActive: false },
  { title: "Sales performance", icon: BarChart3, isActive: false },
  { title: "Orders", icon: ShoppingCart, isActive: false },
  { title: "Settings", icon: Settings, isActive: false },
];

type SidebarDemoProps = {
  readonly side?: "left" | "right";
  readonly variant?: "sidebar" | "floating" | "inset";
  readonly collapsible?: "offcanvas" | "icon" | "none";
  readonly showSeparator?: boolean;
};

const SidebarDemo = ({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  showSeparator = true,
}: SidebarDemoProps) => (
  <SidebarProvider>
    <div className="flex h-[480px] w-full overflow-hidden rounded-lg border">
      <Sidebar side={side} variant={variant} collapsible={collapsible} showSeparator={showSeparator}>
        <SidebarHeader>
          <div className="px-2 py-1 text-sm font-semibold">CommerceIQ</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 py-1 text-xs text-sidebar-foreground/70">v2.4.1</div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-2 border-b p-3">
          <SidebarTrigger />
          <span className="text-sm font-medium">Dashboard</span>
        </div>
        <div className="p-4 text-sm text-slate-600">
          Amazon US revenue is up 8.4% week-over-week across 214 active SKUs.
        </div>
      </SidebarInset>
    </div>
  </SidebarProvider>
);

const meta: Meta<typeof Sidebar> = {
  title: "Atoms/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Application sidebar system with collapse, resize, floating/inset variants, and mobile drawer behavior. Wrap in `SidebarProvider`. Use `SidebarTrigger` to collapse/expand.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    side: { control: "inline-radio", options: ["left", "right"] },
    variant: { control: "inline-radio", options: ["sidebar", "floating", "inset"] },
    collapsible: { control: "inline-radio", options: ["offcanvas", "icon", "none"] },
    showSeparator: { control: "boolean" },
    children: { control: false },
    id: { control: false },
  },
  args: {
    side: "left",
    variant: "sidebar",
    collapsible: "offcanvas",
    showSeparator: true,
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: (args) => <SidebarDemo {...args} />,
};

export const IconCollapsible: Story = {
  args: { collapsible: "icon" },
  render: (args) => <SidebarDemo {...args} />,
};

export const FloatingVariant: Story = {
  args: { variant: "floating", collapsible: "icon" },
  render: (args) => <SidebarDemo {...args} />,
};

export const RightSide: Story = {
  args: { side: "right" },
  render: (args) => <SidebarDemo {...args} />,
};

export const NotCollapsible: Story = {
  args: { collapsible: "none", showSeparator: false },
  render: (args) => <SidebarDemo {...args} />,
};
