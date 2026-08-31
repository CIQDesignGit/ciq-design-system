import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  formatCellValue,
  formatCompactNumber,
  formatCurrency,
  formatNumber,
  formatPercent,
  setFormatLocaleAdapter,
} from "@/molecules/formatters";

function FormattersDemo() {
  const samples = [
    { label: "formatCurrency(1234567)", value: formatCurrency(1234567) },
    { label: "formatCurrency(99.5, { compact: false })", value: formatCurrency(99.5, { compact: false }) },
    { label: "formatPercent(45.5)", value: formatPercent(45.5) },
    { label: "formatCompactNumber(1500000)", value: formatCompactNumber(1500000) },
    { label: "formatNumber(1234567.89)", value: formatNumber(1234567.89) },
    { label: 'formatCellValue(null, "currency")', value: formatCellValue(null, "currency") },
    { label: 'formatCellValue(0.456, "number", "percentage")', value: formatCellValue(0.456, "number", "percentage") },
  ];

  return (
    <div className="space-y-4 max-w-lg">
      <p className="text-sm text-slate-600">
        Defaults are en-US / USD. Hosts can call{" "}
        <code className="text-xs bg-slate-100 px-1 rounded">setFormatLocaleAdapter</code> once at
        app boot.
      </p>
      <button
        type="button"
        className="text-sm underline text-violet-700"
        onClick={() =>
          setFormatLocaleAdapter({
            getLocaleConfig: () => ({ locale: "en-IN", currencyString: "INR" }),
          })
        }
      >
        Switch adapter to en-IN / INR (then refresh story)
      </button>
      <ul className="divide-y rounded-lg border border-slate-200 bg-white">
        {samples.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-4 px-3 py-2 text-sm">
            <code className="text-xs text-slate-500">{row.label}</code>
            <span className="font-medium tabular-nums">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const meta: Meta = {
  title: "Molecules/Formatters",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Locale-injectable number/currency/percent helpers for alerts and tables. No `__globalConfig`.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <FormattersDemo />,
};
