/**
 * Filter Skeleton Components
 * Loading placeholders for filter bar UI elements
 */

import React from "react";

import { Skeleton } from "@/atoms/skeleton";

// Varying widths to simulate different label lengths
const SKELETON_WIDTHS = [72, 56, 88, 64, 80, 48];

/**
 * Skeleton loader for dimension list in the filter dropdown
 * Mimics the layout of dimension buttons with text and chevron icon
 */
export const DimensionListSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col">
      {SKELETON_WIDTHS.map((width, index) => (
        <div key={index} className="w-full flex items-center justify-between px-3 py-2.5">
          <Skeleton className="h-4" style={{ width }} />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
      ))}
    </div>
  );
};
