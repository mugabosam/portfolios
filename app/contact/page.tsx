import type { Metadata } from "next";

import { PageStub } from "@/components/layout/page-stub";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PageStub
      eyebrow="Get in touch"
      title="Contact"
      note="The contact form arrives in a later build phase. Until then, write to popesir112@gmail.com."
    />
  );
}
