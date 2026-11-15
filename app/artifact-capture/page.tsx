import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaptureCanvas } from "./capture-canvas";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Development-only: renders the Artifact alone on a transparent canvas so
 * `pnpm artifact:still` can save the static fallback image. 404 in production.
 */
export default function ArtifactCapturePage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <CaptureCanvas />;
}
