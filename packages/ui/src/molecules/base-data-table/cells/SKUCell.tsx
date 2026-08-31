import { Check, Copy, ImageOff } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/atoms/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/atoms/tooltip";
import { getRetailerLogoUrl } from "../utils/retailer-logo";

import type { CellRendererProps } from "../types";

export type RegionMetadata = {
  name: string;
  label: string;
};

export type RetailerMetadata = {
  name: string;
  label?: string;
  logo_url?: string;
};

export type SKUValue = {
  /** SKU code */
  value: string;
  /** Product title */
  title?: string;
  /** Product image URL */
  image_url?: string;
  /** Product detail page URL */
  pdp_url?: string;
  /** Region info (e.g. { name: "United States", label: "US" }) */
  region?: RegionMetadata;
  /** Retailer info (e.g. [{ name: "Amazon", label: "Amz" }]) */
  retailers?: RetailerMetadata[];
  [key: string]: unknown;
};

export type TitleRendererProps = {
  title: string;
  sku: string;
  onTitleClick?: (sku: string) => void;
};

export type SKUCellProps = Partial<CellRendererProps> & {
  /** SKU data - can be string (just SKU code) or SKUValue object with all fields */
  readonly value?: string | SKUValue;
  /** Callback when title is clicked */
  readonly onTitleClick?: (sku: string) => void;
  /** Callback when SKU is copied */
  readonly onCopy?: (sku: string) => void;
  /** Additional className */
  readonly className?: string;
  /** Custom title renderer slot - if provided, replaces the default title rendering */
  readonly renderTitle?: (props: TitleRendererProps) => React.ReactNode;
  /** Tooltip text for the PDP link (default: "View Amazon detail page") */
  readonly pdpTooltip?: string;
};

function getStringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function getSKUData(value: SKUCellProps["value"], row?: CellRendererProps["row"]): SKUValue | null {
  if (value == null || value === "") return null;

  const rowTitle = getStringValue(row?.product_title);
  const rowImage = getStringValue(row?.pim_sku_image_url) ?? getStringValue(row?.image_url);
  const rowPdp = getStringValue(row?.pdp_url);

  if (typeof value === "object" && value !== null) {
    if (Object.keys(value).length === 0 || !("value" in value)) return null;
    return {
      value: value.value,
      title: value.title ?? rowTitle,
      image_url: value.image_url ?? rowImage,
      pdp_url: value.pdp_url ?? rowPdp,
      region: value.region,
      retailers: value.retailers,
    };
  }

  return {
    value: String(value),
    title: rowTitle,
    image_url: rowImage,
    pdp_url: rowPdp,
  };
}

function renderTitleContent({
  title,
  skuCode,
  renderTitle,
  onTitleClick,
  handleTitleClick,
}: {
  title?: string;
  skuCode: string;
  renderTitle?: SKUCellProps["renderTitle"];
  onTitleClick?: SKUCellProps["onTitleClick"];
  handleTitleClick: (e: React.MouseEvent) => void;
}) {
  if (renderTitle && title) {
    return renderTitle({ title, sku: skuCode, onTitleClick });
  }

  if (!title) return null;
  if (onTitleClick && skuCode) {
    return (
      <button
        onClick={handleTitleClick}
        className="underline decoration-dotted decoration-slate-400 underline-offset-2 hover:text-slate-700 cursor-pointer text-left w-full overflow-ellipsis overflow-hidden"
        data-testid="skucell-handle-title-click-btn"
      >
        {title}
      </button>
    );
  }
  return <span className="overflow-ellipsis overflow-hidden">{title}</span>;
}

function renderRetailers(retailers?: RetailerMetadata[]) {
  if (!retailers?.length) return null;

  return (
    <div className="flex items-center -space-x-1.5">
      {retailers.map((r, idx) => {
        const logoUrl = r.logo_url ?? getRetailerLogoUrl(r.name);
        const displayName = r.label ?? r.name.charAt(0).toUpperCase() + r.name.slice(1);
        if (!logoUrl) {
          return (
            <span key={r.name} className="text-[10px] text-gray-500">
              {displayName}
            </span>
          );
        }

        return (
          <TooltipProvider key={r.name} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <img
                  src={logoUrl}
                  alt={displayName}
                  className="size-4 rounded-full object-contain ring-1 ring-white bg-white"
                  style={{ zIndex: retailers.length + idx }}
                />
              </TooltipTrigger>

              <TooltipContent
                side="bottom"
                sideOffset={4}
                className="!bg-slate-900 !text-white !text-xs !border-0 !px-2 !py-1 !rounded-md shadow-lg"
              >
                {displayName}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}

function renderMetadata(skuData: SKUValue) {
  if (!(skuData.region ?? skuData.retailers?.length)) return null;

  return (
    <>
      <span className="text-gray-500 text-3xl leading-none">·</span>
      {skuData.region && <span className="text-xs text-gray-500">{skuData.region.label}</span>}
      {skuData.region && skuData.retailers?.length ? (
        <span className="text-gray-500 text-3xl leading-none">·</span>
      ) : null}
      {renderRetailers(skuData.retailers)}
    </>
  );
}

export const SKUCell: React.FC<SKUCellProps> = ({
  value,
  row,
  onTitleClick,
  onCopy,
  className,
  renderTitle,
  pdpTooltip = "View Amazon detail page",
}) => {
  const [copied, setCopied] = useState(false);

  // Extract SKU data from value prop
  const skuData = getSKUData(value, row);

  if (!skuData) {
    return <span className="text-muted-foreground">—</span>;
  }

  const { value: skuCode, title, image_url, pdp_url } = skuData;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(skuCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.(skuCode);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (skuCode && onTitleClick) {
      onTitleClick(skuCode);
    }
  };

  // Rich SKU cell with image and title
  if (image_url || title) {
    return (
      <div className={`flex items-center gap-2 ${className || ""}`}>
        <div className="flex-shrink-0 relative">
          <div className="absolute inset-0 pointer-events-none rounded-sm">
            <div className="absolute bg-slate-100 inset-0 rounded-sm flex items-center justify-center">
              {!image_url && <ImageOff className="size-5 text-slate-300" strokeWidth={1.5} />}
            </div>
            {image_url && (
              <img
                src={image_url}
                alt={title || skuCode}
                className="absolute max-w-none object-[50%_50%] object-cover rounded-sm size-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>
          <div className="border border-slate-200 border-solid relative rounded-sm size-10" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="text-sm font-normal text-slate-900 leading-5 overflow-ellipsis overflow-hidden whitespace-nowrap">
            {renderTitleContent({ title, skuCode, renderTitle, onTitleClick, handleTitleClick })}
          </div>
          {skuCode && (
            <div className="flex items-center gap-2 leading-none">
              {pdp_url ? (
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild data-testid="skucell-tooltip-trigger">
                      <a
                        href={pdp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-normal text-gray-500 leading-normal overflow-ellipsis overflow-hidden hover:text-slate-700 transition-colors underline decoration-dotted underline-offset-2 decoration-slate-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {skuCode}
                      </a>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      align="start"
                      sideOffset={5}
                      className="!bg-slate-900 !text-white !text-xs !border-0 !px-3 !py-1.5 !rounded-md shadow-lg"
                    >
                      {pdpTooltip}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <span className="text-xs font-normal text-gray-500 leading-none overflow-ellipsis overflow-hidden">
                  {skuCode}
                </span>
              )}
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild data-testid="skucell-tooltip-trigger-2">
                    <Button
                      onClick={handleCopy}
                      variant="ghost"
                      size="icon"
                      className="p-0.5 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-600 h-auto w-auto"
                      title={copied ? "Copied!" : "Copy SKU"}
                      data-testid="skucell-copied-copied-copy-sku-btn"
                    >
                      {copied ? (
                        <Check className="size-3 text-green-600" />
                      ) : (
                        <Copy className="size-3 text-slate-400" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={12}
                    className="!bg-slate-900 !text-white !text-xs !font-normal !border-0 !px-2 !py-1 rounded-md shadow-lg"
                  >
                    {copied ? "Copied!" : "Copy SKU"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {renderMetadata(skuData)}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Simple SKU cell (fallback)
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-800 text-xs font-medium" title={skuCode}>
        {skuCode}
      </span>
      <Button
        onClick={handleCopy}
        variant="ghost"
        size="icon"
        className="p-0.5 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-600 h-auto w-auto"
        title={copied ? "Copied!" : "Copy SKU"}
        data-testid="skucell-copied-copied-copy-sku-btn-2"
      >
        <Copy className={`w-3 h-3 ${copied ? "text-green-600" : ""}`} />
      </Button>
    </div>
  );
};

export default SKUCell;
