import { cn } from "@/lib/utils";

interface CharacterCountProps {
  readonly current: number;
  readonly max: number;
  readonly className?: string;
}

export function CharacterCount({
  current,
  max,
  className,
}: CharacterCountProps): React.ReactElement {
  return (
    <span
      data-testid="character-count"
      className={cn(
        "text-xs font-medium tabular-nums",
        current > max ? "text-red-600" : "text-muted-foreground",
        className
      )}
    >
      {current} / {max}
    </span>
  );
}
