import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { CodePanel } from "@/components/ui/code-panel";
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
    <CodePanel as="figure" title={file} meta={note} className="snippet my-10">
      {children}
    </CodePanel>
  );
}

/** Headline numbers. Only real, sourced figures belong here (brief §5.9). */
function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="my-10 grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-5"
        >
          <dt className="text-small text-ink-3">{item.label}</dt>
          <dd className="order-first text-h3 font-bold [font-stretch:108%] tabular-nums">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** A quiet aside for disclaimers and scope notes. */
function Note({ children }: { children: ReactNode }) {
  return (
    <aside className="my-10 max-w-(--measure) rounded-lg border border-sky/25 bg-sky-tint px-5 py-4 text-ink [&>p]:my-0 [&>p]:text-ink">
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
    "rounded-sm text-sky underline decoration-sky/35 underline-offset-4 transition-colors duration-(--dur-ui) hocus:decoration-sky";
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
        "case-heading mt-20 mb-6 border-t border-line pt-10 type-h2",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3 className={cn("mt-12 mb-4 type-h3", className)} {...props} />
  ),
  p: ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p
      className={cn("my-5 max-w-(--measure) text-ink-2", className)}
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
  ul: ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className={cn(
        "my-6 flex max-w-(--measure) flex-col gap-3 text-ink-2",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className={cn(
        "my-6 flex max-w-(--measure) list-decimal flex-col gap-3 pl-6 text-ink-2",
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
      className="my-10 max-w-(--measure) border-l-2 border-sky pl-6 text-manifesto font-medium"
      {...props}
    />
  ),
  Snippet,
  Stats,
  Note,
  Diagram,
};
