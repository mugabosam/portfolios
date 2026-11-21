import { availability } from "@/content/profile";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt =
  "Sam Mugabo, software developer in Kigali: I build web and mobile apps, front to back.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    big: "Build",
    figure: true,
    title: "I build web and mobile apps, front to back.",
    subtitle: "Websites, mobile apps, and the servers and data behind them.",
    panel: {
      label: "Available for",
      value: availability.roles,
      note: availability.where,
    },
  });
}
