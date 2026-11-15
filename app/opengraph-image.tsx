import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt =
  "Sam Mugabo: Built to last. Backend developer, Python and TypeScript, Kigali.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    eyebrow: "Portfolio · Vol. 01",
    roman: "Built",
    italic: "to last",
  });
}
