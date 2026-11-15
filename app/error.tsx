"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";

/** Shown when a page throws while rendering. The header and footer stay. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in the browser console and in Vercel's runtime logs.
    console.error(error);
  }, [error]);

  return (
    <section
      aria-labelledby="error-title"
      className="container-site flex min-h-svh flex-col justify-center pt-(--header-h) pb-24"
    >
      <Eyebrow>Something broke</Eyebrow>
      <DisplayHeading
        as="h1"
        id="error-title"
        roman="A flaw"
        italic="in the stone"
        className="mt-6"
      />
      <p className="mt-8 max-w-(--measure) text-lead text-fg-muted">
        This page failed to render. Trying again usually works; if it keeps
        happening, the home page is still there.
      </p>
      {error.digest && (
        <p className="mt-4 font-mono text-small text-fg-muted">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
        <Button onClick={reset} icon="arrow">
          Try again
        </Button>
        <Button variant="link" href="/">
          Back to the start
        </Button>
      </div>
    </section>
  );
}
