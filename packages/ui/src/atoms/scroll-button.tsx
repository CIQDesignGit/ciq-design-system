import * as React from "react";
import { ArrowDown } from "lucide-react";

import { Button } from "@/atoms/button";
import { cn } from "@/lib/utils";

export interface ScrollButtonProps
  extends React.ComponentProps<typeof Button> {
  visible?: boolean;
}

function ScrollButton({
  visible = true,
  className,
  ...props
}: ScrollButtonProps) {
  if (!visible) return null;
  return (
    <Button
      size="icon"
      variant="outline"
      className={cn("rounded-full shadow-md", className)}
      aria-label="Scroll to bottom"
      {...props}
    >
      <ArrowDown />
    </Button>
  );
}

export { ScrollButton };
