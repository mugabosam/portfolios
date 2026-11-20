import type { Metadata } from "next";

import { StatusPage } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Message sent",
  robots: { index: false, follow: false },
};

/** Landing page for the no-JavaScript form submission. */
export default function ContactSentPage() {
  return (
    <StatusPage
      id="sent-title"
      code={200}
      status="OK"
      title="Message sent. Thank you."
      actions={
        <Button variant="primary" href="/">
          Go to the home page
        </Button>
      }
    >
      <p>I read every message and reply within a few days.</p>
    </StatusPage>
  );
}
