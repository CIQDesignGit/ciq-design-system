import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/atoms/table";

// ============================================
// Mock Data
// ============================================

const SKU_ROWS = [
  { sku: "SKU-4471", name: "Yankee Candle Large Jar, 22oz", marketplace: "Amazon US", price: "$24.99", units: 1204 },
  { sku: "SKU-4472", name: "Yankee Candle Medium Jar, 14.5oz", marketplace: "Amazon US", price: "$18.49", units: 890 },
  { sku: "SKU-8821", name: "Glade Plugin Refill, 2-pack", marketplace: "Walmart US", price: "$6.98", units: 2310 },
  { sku: "SKU-9013", name: "Bath & Body Works 3-Wick Candle", marketplace: "Instacart", price: "$16.00", units: 412 },
];

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof Table> = {
  title: "Atoms/Table",
  component: Table,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Low-level, unstyled-by-default table primitives (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableFooter`, `TableCaption`) for building simple, static tables. For sortable/paginated data grids, use `BaseDataTable` instead — these primitives are the building blocks for bespoke, one-off layouts.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    noWrapper: {
      control: "boolean",
      description:
        "Skip the default `overflow-x-auto` wrapper div. Useful for virtualized tables that manage their own scroll container and sticky headers.",
    },
    className: {
      control: "text",
      description: "Additional class names applied to the `<table>` element.",
    },
    children: { control: false }, // ReactNode - composed from row/cell subcomponents
  },
  args: {
    noWrapper: false,
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

/** A basic SKU performance table with a header row and body rows. */
export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Marketplace</TableHead>
          <TableHead className="justify-end">Price</TableHead>
          <TableHead className="justify-end">Units sold</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SKU_ROWS.map((row) => (
          <TableRow key={row.sku}>
            <TableCell className="font-medium">{row.sku}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.marketplace}</TableCell>
            <TableCell className="text-right">{row.price}</TableCell>
            <TableCell className="text-right">{row.units.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** With a caption describing the table's contents. */
export const WithCaption: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Top-selling SKUs across all connected marketplaces, last 7 days.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Product</TableHead>
          <TableHead className="justify-end">Units sold</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SKU_ROWS.map((row) => (
          <TableRow key={row.sku}>
            <TableCell className="font-medium">{row.sku}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell className="text-right">{row.units.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** With a footer row summarizing totals. */
export const WithFooter: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Marketplace</TableHead>
          <TableHead className="justify-end">Units sold</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SKU_ROWS.map((row) => (
          <TableRow key={row.sku}>
            <TableCell className="font-medium">{row.sku}</TableCell>
            <TableCell>{row.marketplace}</TableCell>
            <TableCell className="text-right">{row.units.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">
            {SKU_ROWS.reduce((sum, row) => sum + row.units, 0).toLocaleString()}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

/** No wrapper div — the `<table>` renders directly, e.g. inside a virtualized scroll container. */
export const NoWrapper: Story = {
  args: { noWrapper: true },
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead className="justify-end">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SKU_ROWS.map((row) => (
          <TableRow key={row.sku}>
            <TableCell className="font-medium">{row.sku}</TableCell>
            <TableCell className="text-right">{row.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
