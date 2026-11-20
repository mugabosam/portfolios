"use client";

import { useEffect } from "react";

import { StatusPage } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";

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
    <StatusPage
      id="error-title"
      code={500}
      status="Internal Server Error"
      title="This page failed to load"
      actions={
        <>
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
          <Button href="/">Go to the home page</Button>
        </>
      }
    >
      <p>
        Trying again usually works. If it keeps happening, the rest of the site
        is still there.
      </p>
      {error.digest && (
        <p className="mt-3 font-mono text-small text-ink-3">
          Reference: {error.digest}
        </p>
      )}
    </StatusPage>
  );
}
