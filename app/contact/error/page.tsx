import type { Metadata } from "next";

import { StatusPage } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Message not sent",
  robots: { index: false, follow: false },
};

/** Landing page when a no-JavaScript form submission is rejected or fails. */
export default function ContactErrorPage() {
  return (
    <StatusPage
      id="error-title"
      code={422}
      status="Unprocessable Content"
      title="Your message wasn’t sent"
      actions={
        <>
          <Button variant="primary" href="/contact">
            Back to the form
          </Button>
          <Button href={`mailto:${site.email}`}>Email {site.email}</Button>
        </>
      }
    >
      <p>
        Check that every field is filled in (the message needs at least 20
        characters) and try again, or write to me directly.
      </p>
    </StatusPage>
  );
}
