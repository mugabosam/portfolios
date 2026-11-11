import type { ReactNode } from "react";

import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";

/** Opening block of every inner page: eyebrow, two-voice h1, short intro. */
export function PageHeader({
  eyebrow,
  roman,
  italic,
  intro,
  children,
}: {
  eyebrow: string;
  roman: string | readonly string[];
  italic?: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <header className="container-site pt-[calc(var(--header-h)+6rem)] pb-16 md:pb-24">
      <Eyebrow>{eyebrow}</Eyebrow>
      <DisplayHeading as="h1" roman={roman} italic={italic} className="mt-6" />
      {intro && (
        <p className="mt-8 max-w-(--measure) text-lead text-fg-muted">
          {intro}
        </p>
      )}
      {children}
    </header>
  );
}
