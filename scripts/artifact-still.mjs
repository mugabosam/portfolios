/**
 * Saves the static Artifact image (public/artifact/still.webp) from the live
 * 3D scene, so the fallback always matches the real thing.
 *
 * 1. pnpm dev          (in another terminal)
 * 2. pnpm artifact:still
 */
import { mkdirSync, writeFileSync } from "node:fs";

import { chromium } from "@playwright/test";

const base = process.env.CAPTURE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({
  args: ["--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({
  viewport: { width: 900, height: 900 },
  deviceScaleFactor: 1.5,
});

await page.goto(`${base}/artifact-capture`);
await page.waitForSelector("html[data-capture-ready]", { timeout: 60_000 });
await page.waitForTimeout(2500); // environment map and a few frames

const dataUrl = await page.evaluate(() => {
  const canvas = document.querySelector("#capture canvas");
  return canvas ? canvas.toDataURL("image/webp", 0.9) : null;
});
await browser.close();
if (!dataUrl?.startsWith("data:image/webp"))
  throw new Error("Could not read the canvas as WebP");

mkdirSync(new URL("../public/artifact/", import.meta.url), { recursive: true });
const bytes = Buffer.from(dataUrl.split(",")[1], "base64");
writeFileSync(new URL("../public/artifact/still.webp", import.meta.url), bytes);
console.log(
  `public/artifact/still.webp (${Math.round(bytes.length / 1024)} KB)`,
);
