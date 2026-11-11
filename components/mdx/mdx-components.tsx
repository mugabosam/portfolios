import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Diagram } from "./diagram";

/** Frames a code block with its source file and how it was trimmed. */
function Snippet({
  file,
  note = "Excerpt",
  children,
}: {
  file: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <figure className="snippet my-12">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border border-b-0 border-line px-4 py-3">
        <span className="font-mono text-small text-fg">{file}</span>
        <span className="type-label text-fg-muted">{note}</span>
      </figcaption>
      {children}
    </figure>
  );
}

/** Headline numbers. Only real, sourced figures belong here (brief §5.9). */
function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="my-12 grid grid-cols-2 border-t border-l border-line md:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col gap-2 border-r border-b border-line p-6"
        >
          <dt className="order-2 type-label text-fg-muted">{item.label}</dt>
          <dd className="order-1 font-display text-h3">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A quiet aside for disclaimers and scope notes. */
function Note({ children }: { children: ReactNode }) {
  return (
    <aside className="my-10 max-w-(--measure) border-l border-line-strong pl-6 text-fg-muted [&>p]:my-0">
      {children}
    </aside>
  );
}

function Anchor({
  href = "",
  children,
  ...rest
}: ComponentPropsWithoutRef<"a">) {
  const className =
    "underline decoration-line-strong underline-offset-4 transition-colors duration-(--dur-ui) hocus:decoration-fg";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}

export const mdxComponents = {
  h2: ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className={cn(
        "case-heading mt-24 mb-8 border-t border-line pt-8 font-display text-h3",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className={cn("mt-12 mb-4 font-display text-h4", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p
      className={cn("my-6 max-w-(--measure) text-fg-muted", className)}
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-medium text-fg" {...props} />
  ),
  ul: ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className={cn(
        "my-6 flex max-w-(--measure) flex-col gap-3 text-fg-muted",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className={cn(
        "my-6 flex max-w-(--measure) list-decimal flex-col gap-3 pl-6 text-fg-muted",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className={cn("case-bullet relative pl-6", className)} {...props} />
  ),
  a: Anchor,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-10 max-w-(--measure) font-display text-manifesto"
      {...props}
    />
  ),
  Snippet,
  Stats,
  Note,
  Diagram,
};
