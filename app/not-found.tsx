import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="container-site flex min-h-svh flex-col justify-center pt-(--header-h) pb-24"
    >
      <Eyebrow>Error 404</Eyebrow>
      <DisplayHeading
        as="h1"
        id="not-found-title"
        roman="This page"
        italic="was never cut"
        className="mt-6"
      />
      <p className="mt-8 max-w-(--measure) text-lead text-fg-muted">
        The address may be mistyped, or the page may have moved. Everything that
        exists is reachable from the home page.
      </p>
      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
        <Button href="/" icon="arrow">
          Back to the start
        </Button>
        <Button variant="link" href="/work">
          Selected work
        </Button>
      </div>
    </section>
  );
}
