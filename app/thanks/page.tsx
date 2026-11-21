import type { Metadata } from "next";

import { StatusPage } from "@/components/layout/status-page";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Message sent",
  robots: { index: false, follow: false },
};

/**
 * Where Web3Forms sends a visitor after a message sent without
 * JavaScript (the form's redirect field). With JavaScript the form confirms
 * in place and this page is never seen.
 */
export default function ThanksPage() {
  return (
    <StatusPage
      id="thanks-title"
      code={200}
      status="OK"
      title="Message sent. Thank you."
      actions={
        <Button variant="primary" href="/">
          Back to the portfolio
        </Button>
      }
    >
      <p>It went straight to Sam’s inbox. He replies within a few days.</p>
    </StatusPage>
  );
}
