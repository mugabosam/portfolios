import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Message not sent",
  robots: { index: false, follow: false },
};

/** Landing page when a no-JavaScript form submission is rejected or fails. */
export default function ContactErrorPage() {
  return (
    <section
      aria-labelledby="error-title"
      className="container-site flex min-h-svh flex-col justify-center pt-(--header-h) pb-24"
    >
      <Eyebrow>Not sent</Eyebrow>
      <DisplayHeading
        as="h1"
        id="error-title"
        roman="That one"
        italic="did not go through"
        className="mt-6"
      />
      <p className="mt-8 max-w-(--measure) text-lead text-fg-muted">
        Please check that every field is filled in (the message needs at least
        20 characters) and try again, or write to me directly.
      </p>
      <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
        <Button href="/contact" icon="arrow">
          Back to the form
        </Button>
        <Button variant="link" href={`mailto:${site.email}`}>
          {site.email}
        </Button>
      </div>
    </section>
  );
}
