import { cn } from "@/lib/cn";

type SpecCardProps = {
  label: string;
  title: string;
  items: readonly string[];
  titleAs?: "h2" | "h3" | "h4";
  className?: string;
};

/** A quiet specification panel: label, serif title, dot-separated details. */
export function SpecCard({
  label,
  title,
  items,
  titleAs: Title = "h3",
  className,
}: SpecCardProps) {
  return (
    <div
      className={cn(
        "max-w-md border border-line bg-bg-elevated p-6",
        className,
      )}
    >
      <p className="type-label text-fg-muted">{label}</p>
      <Title className="mt-3 font-display text-h4">{title}</Title>
      <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-1 font-mono text-small text-fg-muted">
        {items.map((item, index) => (
          <li key={item} className="flex gap-2">
            {item}
            {/* Trailing separator, so a wrapped line never starts with a dot. */}
            {index < items.length - 1 && <span aria-hidden="true">·</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
