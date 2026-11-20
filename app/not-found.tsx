import type { Metadata } from "next";

import { StatusPage } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <StatusPage
      id="not-found-title"
      code={404}
      status="Not Found"
      title="This page doesn’t exist"
      actions={
        <>
          <Button variant="primary" href="/">
            Go to the home page
          </Button>
          <Button href="/#work">See the work</Button>
        </>
      }
    >
      <p>
        The address may be mistyped, or the page may have moved. Everything that
        exists is reachable from the home page.
      </p>
    </StatusPage>
  );
}
