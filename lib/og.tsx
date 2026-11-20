import { readFile } from "node:fs/promises";
import path from "node:path";

import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const color = {
  paper: "#f5f7fa",
  wash: "#e4f2fa",
  ink: "#0b1b2b",
  ink2: "#435468",
  line: "#dce3eb",
  sky: "#0070a8",
  skyBright: "#00a1de",
  sun: "#fad201",
  code: "#0b1b2b",
  codeLine: "#223a55",
  codeFg: "#d6e2ee",
  codeMuted: "#8ea3ba",
  codeKey: "#6cc9f2",
  codeString: "#f6dc5c",
  codeNumber: "#7fdcae",
};

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
    medium: await load("MonaSans-SemiExpanded-Medium.ttf"),
    heavy: await load("MonaSans-SemiExpanded-ExtraBold.ttf"),
    mono: await load("JetBrainsMono-Medium.ttf"),
  };
}

export type OgLine = { key: string; value: string };

/**
 * Shared Open Graph card in the site's style: paper canvas, a heavy
 * semi-expanded headline, and a navy response card like the one in the
 * home page hero.
 */
export async function ogImage({
  title,
  subtitle,
  request,
  lines,
}: {
  title: string;
  subtitle: string;
  /** Shown as the card's request line, e.g. "/api/sam". */
  request: string;
  /** JSON fields shown in the card. */
  lines: OgLine[];
}) {
  const { medium, heavy, mono } = await fonts();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: color.paper,
        color: color.ink,
        fontFamily: "Mona Sans",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          background: color.wash,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 640,
          padding: "56px 0 56px 64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 13,
              background: color.ink,
            }}
          >
            <svg width="52" height="52" viewBox="0 0 32 32">
              <path
                d="M9 11l5 5-5 5"
                fill="none"
                stroke={color.skyBright}
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="16"
                y="19.5"
                width="8"
                height="2.75"
                rx="1.2"
                fill={color.sun}
              />
            </svg>
          </div>
          <span style={{ fontSize: 32, fontWeight: 800 }}>{site.name}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span
            style={{
              fontSize: title.length > 28 ? 60 : 76,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: 28,
              fontWeight: 500,
              lineHeight: 1.35,
              color: color.ink2,
            }}
          >
            {subtitle}
          </span>
        </div>

        <span style={{ fontSize: 24, fontWeight: 500, color: color.ink2 }}>
          {site.role}, {site.location}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 118,
          right: 56,
          width: 470,
          display: "flex",
          flexDirection: "column",
          borderRadius: 22,
          background: color.code,
          fontFamily: "JetBrains Mono",
          fontSize: 22,
          boxShadow: "0 30px 60px -30px rgba(11,27,43,0.55)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "22px 28px",
            borderBottom: `1px solid ${color.codeLine}`,
          }}
        >
          <span
            style={{
              color: color.codeKey,
              background: "rgba(0,161,222,0.16)",
              padding: "2px 10px",
              borderRadius: 6,
            }}
          >
            GET
          </span>
          <span style={{ color: "#ffffff" }}>{request}</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "20px 28px 28px",
            gap: 8,
          }}
        >
          <span
            style={{
              display: "flex",
              color: color.codeNumber,
              marginBottom: 6,
            }}
          >
            200 OK
          </span>
          <span style={{ color: color.codeMuted }}>{"{"}</span>
          {lines.map((line, index) => (
            <span key={line.key} style={{ display: "flex", paddingLeft: 26 }}>
              <span style={{ color: color.codeKey }}>
                {JSON.stringify(line.key)}
              </span>
              <span style={{ color: color.codeMuted }}>:&nbsp;</span>
              <span style={{ color: color.codeString }}>
                {JSON.stringify(line.value)}
              </span>
              {index < lines.length - 1 && (
                <span style={{ color: color.codeMuted }}>,</span>
              )}
            </span>
          ))}
          <span style={{ color: color.codeMuted }}>{"}"}</span>
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Mona Sans", data: medium, style: "normal", weight: 500 },
        { name: "Mona Sans", data: heavy, style: "normal", weight: 800 },
        { name: "JetBrains Mono", data: mono, style: "normal", weight: 500 },
      ],
    },
  );
}
