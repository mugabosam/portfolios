import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";

export const metadata: Metadata = {
  title: "Message sent",
  robots: { index: false, follow: false },
};

/** Landing page for the no-JavaScript form submission. */
export default function ContactSentPage() {
  return (
    <section
      aria-labelledby="sent-title"
      className="container-site flex min-h-svh flex-col justify-center pt-(--header-h) pb-24"
    >
      <Eyebrow>Message sent</Eyebrow>
      <DisplayHeading
        as="h1"
        id="sent-title"
        roman="Thank"
        italic="you"
        className="mt-6"
      />
      <p className="mt-8 max-w-(--measure) text-lead text-fg-muted">
        Your message is on its way. I read every one and reply within a few
        days.
      </p>
      <div className="mt-12">
        <Button href="/" icon="arrow">
          Back to the start
        </Button>
      </div>
    </section>
  );
}
