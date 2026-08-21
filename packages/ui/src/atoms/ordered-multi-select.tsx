import * as React from "react";

import { MultiSelect, type MultiSelectOption, type MultiSelectProps } from "@/atoms/multi-select";

/** Ordered list of selected values — same API as MultiSelect for this scaffold. */
function OrderedMultiSelect(props: MultiSelectProps) {
  return <MultiSelect {...props} />;
}

export { OrderedMultiSelect };
export type { MultiSelectOption };
