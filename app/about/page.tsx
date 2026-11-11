import type { Metadata } from "next";

import { PageStub } from "@/components/layout/page-stub";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PageStub
      eyebrow="Profile"
      title="About"
      note="A longer biography, skills and education arrive in a later build phase."
    />
  );
}
