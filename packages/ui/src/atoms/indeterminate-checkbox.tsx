import * as React from "react";

import { Checkbox } from "@/atoms/checkbox";

/** Same checkbox as Checkbox, with the mixed/minus state as the default use-case. */
function IndeterminateCheckbox(
  props: Omit<React.ComponentProps<"button">, "type"> & {
    checked?: boolean | "indeterminate";
    onCheckedChange?: (checked: boolean | "indeterminate") => void;
  }
) {
  return <Checkbox indeterminate {...props} />;
}

export { IndeterminateCheckbox };
