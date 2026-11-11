import type { Metadata } from "next";

import { PageStub } from "@/components/layout/page-stub";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <PageStub
      eyebrow="Curriculum vitae"
      title="Resume"
      note="The HTML résumé and downloadable PDF arrive in a later build phase."
    />
  );
}
