import { pad3 } from "@/lib/format";
import { cn } from "@/lib/cn";

/** "001 / 008", announced to screen readers as "Section 1 of 8". */
export function SectionCounter({
  index,
  total = 8,
  className,
}: {
  index: number;
  total?: number;
  className?: string;
}) {
  return (
    <p className={cn("type-label text-fg-muted tabular-nums", className)}>
      <span aria-hidden="true">
        {pad3(index)} / {pad3(total)}
      </span>
      <span className="sr-only">
        Section {index} of {total}
      </span>
    </p>
  );
}
