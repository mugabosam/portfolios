import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type Crumb = { label: string; href: string };

/** Opening block of every inner page: optional breadcrumb, h1, short intro. */
export function PageHeader({
  title,
  intro,
  crumbs,
  children,
  tight = false,
}: {
  title: ReactNode;
  intro?: ReactNode;
  /** Ancestors of this page; the current page is the h1. */
  crumbs?: Crumb[];
  children?: ReactNode;
  /** Drop the bottom padding when something visual follows directly. */
  tight?: boolean;
}) {
  return (
    <header
      className={cn(
        "container-site pt-[calc(var(--header-h)+3.5rem)] md:pt-[calc(var(--header-h)+5rem)]",
        !tight && "pb-14 md:pb-20",
      )}
    >
      {crumbs && (
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-small text-ink-3">
            {crumbs.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-2">
                <Link
                  href={crumb.href}
                  className="rounded-sm text-sky underline decoration-sky/35 underline-offset-4 hocus:decoration-sky"
                >
                  {crumb.label}
                </Link>
                <span aria-hidden="true">/</span>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <h1 className="max-w-4xl type-h1">{title}</h1>
      {intro && (
        <p className="mt-6 max-w-(--measure) text-lead text-ink-2">{intro}</p>
      )}
      {children}
    </header>
  );
}
