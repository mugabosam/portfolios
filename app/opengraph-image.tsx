import { availability } from "@/content/profile";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt =
  "Sam Mugabo, software developer in Kigali: I build software from the database to the interface.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    big: "Build",
    figure: true,
    title: "I build software from the database to the interface.",
    subtitle: "React and Flutter, NestJS and Django, PostgreSQL.",
    panel: {
      label: "Available for",
      value: availability.roles,
      note: availability.where,
    },
  });
}
