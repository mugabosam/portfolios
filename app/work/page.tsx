import type { Metadata } from "next";

import { PageStub } from "@/components/layout/page-stub";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <PageStub
      eyebrow="Index"
      title="Work"
      note="The full project index, with filters, arrives in the next build phase."
    />
  );
}
