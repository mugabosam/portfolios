import { readFile } from "node:fs/promises";
import path from "node:path";

import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Font files as plain ArrayBuffers, read once and cached for the build, so
 * the statically rendered image routes never perform uncached IO.
 */
async function fonts() {
  "use cache";
  cacheLife("max");
  const load = async (file: string) => {
    const buffer = await readFile(
      path.join(process.cwd(), "assets", "fonts", file),
    );
    return buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    ) as ArrayBuffer;
  };
  return {
    regular: await load("InstrumentSerif-Regular.ttf"),
    italic: await load("InstrumentSerif-Italic.ttf"),
  };
}

/**
 * Shared Open Graph card in the site's style: black canvas, uppercase serif
 * roman line, italic second line, small tracked labels (brief §9).
 */
export async function ogImage({
  eyebrow,
  roman,
  italic,
  footer = site.role,
}: {
  eyebrow: string;
  roman: string;
  italic: string;
  footer?: string;
}) {
  const { regular, italic: italicFont } = await fonts();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px",
        background: "#000000",
        color: "#ffffff",
        fontFamily: "Instrument Serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: "0.2em",
          color: "#b5b5b5",
        }}
      >
        <span>{eyebrow.toUpperCase()}</span>
        <span
          style={{
            fontStyle: "italic",
            letterSpacing: 0,
            fontSize: 30,
            color: "#ffffff",
          }}
        >
          {site.name}
        </span>
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", lineHeight: 0.92 }}
      >
        <span
          style={{
            fontSize: 150,
            textTransform: "uppercase",
            letterSpacing: "-0.015em",
          }}
        >
          {roman}
        </span>
        <span
          style={{
            fontSize: 150,
            fontStyle: "italic",
            letterSpacing: "-0.015em",
          }}
        >
          {italic}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          letterSpacing: "0.2em",
          color: "#b5b5b5",
        }}
      >
        <span>{footer.toUpperCase()}</span>
        <span>KIGALI · RWANDA</span>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        {
          name: "Instrument Serif",
          data: regular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Instrument Serif",
          data: italicFont,
          style: "italic",
          weight: 400,
        },
      ],
    },
  );
}
