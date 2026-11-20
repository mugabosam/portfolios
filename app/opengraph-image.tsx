import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt =
  "Sam Mugabo, backend developer in Kigali: I build the APIs and data behind useful software.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    title: "I build the APIs and data behind useful software.",
    subtitle: "Python and TypeScript APIs, and the interfaces on top of them.",
    request: "/api/sam",
    lines: [
      { key: "name", value: "Sam Mugabo" },
      { key: "role", value: "Backend developer" },
      { key: "based_in", value: "Kigali, Rwanda" },
      { key: "open_to", value: "junior roles" },
    ],
  });
}
