import type { Meta, StoryObj } from "@storybook/react-vite";

import MarkdownContent from "@/atoms/markdown-content";

// ============================================
// Mock Data
// ============================================

const INSIGHT_SUMMARY_MARKDOWN = `# ACOS spike on Wireless Earbuds Pro

Your **Advertising Cost of Sales (ACOS)** jumped from 18.2% to 31.6% over the past 7 days on Amazon.

## Likely causes

- A competitor dropped price by 22%, pulling buy-box share
- Impressions rose 3.4x after a broad match keyword expansion
- Conversion rate fell from 6.8% to 4.1% week over week

## Recommended actions

1. Pause the broad match keyword group \`wireless earbuds\`
2. Shift budget to the \`exact-match-branded\` campaign
3. Review pricing against ASIN B08XJK9L2M

[View the full campaign report](#campaign-report)
`;

const LONG_TABLE_MARKDOWN = `## Top SKUs by revenue this week

| SKU | Product | Retailer | Revenue | ACOS |
| --- | --- | --- | --- | --- |
| SKU-001 | Wireless Earbuds Pro | Amazon | $48,210 | 14.2% |
| SKU-002 | Smart Watch Series 4 | Amazon | $39,870 | 18.6% |
| SKU-003 | Insulated Water Bottle | Walmart | $22,340 | 9.8% |
| SKU-004 | Air Fryer XL | Target | $31,590 | 21.4% |
| SKU-005 | Organic Coffee Pods (24ct) | Instacart | $18,760 | 11.3% |
| SKU-006 | Bluetooth Speaker Mini | Amazon | $27,430 | 16.9% |
| SKU-007 | Yoga Mat Premium | Walmart | $12,980 | 13.5% |
| SKU-008 | Robot Vacuum Cleaner | Amazon | $54,120 | 19.7% |
| SKU-009 | Stainless Steel Cookware Set | Target | $29,650 | 22.8% |
| SKU-010 | Fitness Tracker Band | Amazon | $21,340 | 17.1% |
| SKU-011 | Ceramic Non-Stick Pan | Walmart | $15,220 | 10.6% |
| SKU-012 | Electric Kettle | Instacart | $9,870 | 12.9% |
| SKU-013 | Noise Cancelling Headphones | Amazon | $61,450 | 15.3% |
| SKU-014 | Standing Desk Converter | Target | $33,780 | 20.1% |
| SKU-015 | Reusable Produce Bags (Set of 6) | Instacart | $6,540 | 8.2% |
| SKU-016 | Portable Blender | Amazon | $17,890 | 16.4% |

Table collapses after 350px — use **View All** to expand the full list.
`;

const CUSTOM_H1_MARKDOWN = `# Weekly performance digest

Overall **revenue** grew 9.4% week over week across Amazon, Walmart, and Target.
`;

const EMBEDDED_HTML_MARKDOWN = `## Budget pacing alert

<span style="background:#FEF3C7;color:#92400E;padding:2px 6px;border-radius:4px;font-size:12px;font-weight:600;">At risk</span>

The **Target** campaign \`holiday-toys-2026\` is pacing to exhaust budget by **Dec 18**, six days before the promotion ends.
`;

const CLASSNAME_MARKDOWN = `### Instacart same-day fulfillment

**94.2%** of orders shipped same day this week, up from 89.7% last week.
`;

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof MarkdownContent> = {
  title: "Atoms/MarkdownContent",
  component: MarkdownContent,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Renders a markdown string with GitHub-flavored markdown (tables, strikethrough, task lists via \`remark-gfm\`)
and raw HTML pass-through (via \`rehype-raw\`). Ships with CommerceIQ-styled default renderers for headings,
lists, links, and tables — including a table wrapper that auto-collapses past 350px with a "View All" toggle.
Use \`components\` to override any element's renderer.

This is the eagerly-loaded implementation. Most call sites should use \`Markdown\` instead, which lazy-loads
this component to keep the markdown parsing stack out of the initial bundle.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Markdown source string to render.",
    },
    className: {
      control: "text",
      description: "Class names applied to the wrapping div.",
    },
    components: {
      control: false, // object of per-element renderer overrides (functions), not editable via controls
      description:
        "Partial overrides for the react-markdown element renderers (e.g. custom h1, link, or table renderers). Merged on top of the built-in defaults.",
    },
  },
  args: {
    children: INSIGHT_SUMMARY_MARKDOWN,
  },
};

export default meta;
type Story = StoryObj<typeof MarkdownContent>;

// ============================================
// Stories
// ============================================

/** Default insight summary: headers, bold text, a bulleted list, and a hash link. */
export const Default: Story = {};

/**
 * A long table triggers the built-in collapse behavior: content past 350px is
 * faded out with a "View All" link to expand.
 */
export const ExpandableTable: Story = {
  args: {
    children: LONG_TABLE_MARKDOWN,
  },
};

/** Passing `components` overrides the default renderer for specific elements — here, `h1`. */
export const WithCustomComponents: Story = {
  args: {
    children: CUSTOM_H1_MARKDOWN,
    components: {
      h1: ({ children }) => (
        <h1 className="border-0 text-lg font-bold text-primary">{children}</h1>
      ),
    },
  },
};

/** `rehype-raw` allows raw HTML tags (e.g. an inline styled `<span>` badge) inside the markdown source. */
export const WithEmbeddedHtml: Story = {
  args: {
    children: EMBEDDED_HTML_MARKDOWN,
  },
};

/** `className` is applied to the wrapping div, useful for constraining width or adding a card background. */
export const WithClassName: Story = {
  args: {
    children: CLASSNAME_MARKDOWN,
    className: "max-w-md rounded-lg border border-slate-200 bg-slate-50 p-4",
  },
};
