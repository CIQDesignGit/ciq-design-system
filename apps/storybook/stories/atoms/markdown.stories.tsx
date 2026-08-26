import type { Meta, StoryObj } from "@storybook/react-vite";

import { Markdown } from "@/atoms/markdown";

// ============================================
// Mock Data
// ============================================

const WEEKLY_DIGEST_MARKDOWN = `# Weekly retail digest

Revenue across **Amazon**, **Walmart**, and **Target** grew 6.8% week over week, driven by strong
performance in the Home & Kitchen category.

## Retailer breakdown

- **Amazon**: $482,300 revenue, ROAS 5.1x
- **Walmart**: $156,900 revenue, ROAS 3.8x
- **Target**: $98,200 revenue, ROAS 4.2x
`;

const SKU_RECOMMENDATIONS_MARKDOWN = `## Recommended bid adjustments

- **SKU-2041** — Increase bid by 15% (under-delivering, ROAS 4.8x)
- **SKU-2078** — Decrease bid by 10% (ACOS 42%, above 25% target)
- **SKU-2103** — Pause (zero conversions in 14 days, $340 spent)
- **SKU-2115** — Maintain (ROAS 3.2x, within target range)
`;

const CODE_SNIPPET_MARKDOWN = `### Bid update payload

Sending the following payload to the Amazon Ads API for campaign \`holiday-toys-2026\`:

\`\`\`json
{
  "campaignId": "camp_84213",
  "keywordId": "kw_50291",
  "bid": 1.45,
  "matchType": "exact"
}
\`\`\`

Applies to 3 keywords.
`;

const CONTACT_LINK_MARKDOWN = `Contact the [Retail Media team](https://example.com/retail-media) for questions about this recommendation.`;

const CLASSNAME_MARKDOWN = `### Walmart connect performance

Impressions grew **41%** after the mid-week creative refresh.
`;

// ============================================
// Story Configuration
// ============================================

const meta: Meta<typeof Markdown> = {
  title: "Atoms/Markdown",
  component: Markdown,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Lazy-loaded wrapper around \`MarkdownContent\`. \`react-markdown\` + \`remark-gfm\` + \`rehype-raw\` pull in the
full unified/micromark parsing stack, so this component defers that weight to its own async chunk via
\`React.lazy\`. While the chunk is loading, it renders \`children\` as plain text inside a \`Suspense\` fallback
(not visually distinct in Storybook, since the chunk is already resolved in the bundle). Use this component
at call sites instead of \`MarkdownContent\` directly.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Markdown source string to render. Also used as the Suspense fallback text.",
    },
    className: {
      control: "text",
      description: "Class names applied to the wrapping div (and the Suspense fallback div).",
    },
    components: {
      control: false, // object of per-element renderer overrides (functions), not editable via controls
      description:
        "Partial overrides for the react-markdown element renderers, forwarded to MarkdownContent.",
    },
  },
  args: {
    children: WEEKLY_DIGEST_MARKDOWN,
  },
};

export default meta;
type Story = StoryObj<typeof Markdown>;

// ============================================
// Stories
// ============================================

/** Default weekly digest: headers, bold metrics, and a bulleted retailer breakdown. */
export const Default: Story = {};

/** A bulleted list of per-SKU bid recommendations, as surfaced by an insight or agent response. */
export const BulletedSkuRecommendations: Story = {
  args: {
    children: SKU_RECOMMENDATIONS_MARKDOWN,
  },
};

/** A fenced code block, e.g. showing the exact API payload behind an automated action. */
export const CodeSnippet: Story = {
  args: {
    children: CODE_SNIPPET_MARKDOWN,
  },
};

/** Overriding the `a` renderer via `components` to customize link presentation. */
export const WithCustomComponents: Story = {
  args: {
    children: CONTACT_LINK_MARKDOWN,
    components: {
      a: ({ children, href }) => (
        <a href={href} className="font-medium text-primary underline" target="_blank" rel="noopener noreferrer">
          {children} →
        </a>
      ),
    },
  },
};

/** `className` is forwarded to the wrapping div for layout or theming. */
export const WithClassName: Story = {
  args: {
    children: CLASSNAME_MARKDOWN,
    className: "max-w-md rounded-lg border border-slate-200 bg-slate-50 p-4",
  },
};
