/**
 * Prints the /resume page to public/resume.pdf with headless Chromium, so the
 * PDF always matches the page. Run against a production build:
 *
 *   pnpm build && pnpm start -p 3100   (in another terminal)
 *   pnpm resume:pdf
 */
import { chromium } from "@playwright/test";

const base = process.env.RESUME_URL ?? "http://localhost:3100";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 1400 } });
await page.emulateMedia({ media: "print" });
await page.goto(`${base}/resume`, { waitUntil: "networkidle" });
await page.pdf({
  path: new URL("../public/resume.pdf", import.meta.url).pathname.replace(
    /^\/([A-Za-z]:)/,
    "$1",
  ),
  format: "A4",
  printBackground: true,
  margin: { top: "14mm", right: "14mm", bottom: "14mm", left: "14mm" },
});
await browser.close();
console.log("public/resume.pdf");
