import { readFile } from "node:fs/promises";
import path from "node:path";

import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const color = {
  ink: "#0b1b2b",
  ink2: "#435468",
  sky: "#0070a8",
  sun: "#fad201",
  white: "#ffffff",
};

const toArrayBuffer = (buffer: Buffer) =>
  buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;

/**
 * Fonts and the cut-out portrait, read once and cached for the build, so the
 * statically rendered image routes never perform uncached IO.
 */
async function assets() {
  "use cache";
  cacheLife("max");
  const read = (...parts: string[]) =>
    readFile(path.join(process.cwd(), "assets", ...parts));
  const figure = await read("og", "sam-cutout.png");
  return {
    medium: toArrayBuffer(
      await read("fonts", "MonaSans-SemiExpanded-Medium.ttf"),
    ),
    heavy: toArrayBuffer(
      await read("fonts", "MonaSans-SemiExpanded-ExtraBold.ttf"),
    ),
    black: toArrayBuffer(await read("fonts", "MonaSans-Condensed-Black.ttf")),
    figure: `data:image/png;base64,${figure.toString("base64")}`,
  };
}

/**
 * Shared Open Graph card, drawn like the home page hero: a sky panel with
 * the sun, a giant condensed word, and a white panel on the right.
 * The home card shows Sam's cut-out figure; case-study cards put the project
 * title in the giant type instead.
 */
export async function ogImage({
  big,
  title,
  subtitle,
  figure = false,
  panel,
}: {
  /** The giant condensed word or title on the sky panel. */
  big: string;
  /** Headline under it (home) or nothing extra (case studies). */
  title?: string;
  subtitle: string;
  /** Show Sam's cut-out figure crossing into the white panel. */
  figure?: boolean;
  panel: { label: string; value: string; note: string };
}) {
  const { medium, heavy, black, figure: figureSrc } = await assets();
  const bigSize = big.length <= 6 ? 236 : big.length <= 12 ? 150 : 112;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background:
          "linear-gradient(168deg, #0a7fbf 0%, #0070a8 46%, #005482 100%)",
        color: color.white,
        fontFamily: "Mona Sans",
      }}
    >
      {/* The sun */}
      <div
        style={{
          position: "absolute",
          left: figure ? 470 : 690,
          top: figure ? -70 : 250,
          width: 400,
          height: 400,
          borderRadius: 200,
          background:
            "radial-gradient(circle, #ffe676 0%, #fbd816 42%, #fad201 66%, rgba(250,210,1,0) 71%)",
        }}
      />

      {/* Name and mark */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 52,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: "Mona Sans Heavy",
          fontSize: 26,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 40,
            height: 40,
            borderRadius: 10,
            background: color.ink,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 32 32">
            <path
              d="M9 11l5 5-5 5"
              fill="none"
              stroke="#00a1de"
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
              fill="#fad201"
            />
          </svg>
        </div>
        {site.name}
      </div>

      {/* Giant word */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: figure ? 120 : 150,
          display: "flex",
          maxWidth: figure ? 640 : 720,
          fontFamily: "Mona Sans Black",
          fontSize: bigSize,
          lineHeight: 0.84,
          letterSpacing: -2,
          textTransform: figure ? "uppercase" : "none",
        }}
      >
        {big}
      </div>

      {figure && (
        // eslint-disable-next-line @next/next/no-img-element -- Satori draws plain <img>.
        <img
          src={figureSrc}
          width={262}
          height={594}
          alt=""
          style={{ position: "absolute", left: 560, bottom: 0 }}
        />
      )}

      {/* Headline and subtitle, bottom left */}
      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 56,
          width: figure ? 470 : 640,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {title && (
          <div
            style={{
              fontFamily: "Mona Sans Heavy",
              fontSize: 34,
              lineHeight: 1.15,
              letterSpacing: -0.6,
            }}
          >
            {title}
          </div>
        )}
        <div style={{ fontSize: 22, lineHeight: 1.4, opacity: 0.88 }}>
          {subtitle}
        </div>
      </div>

      {/* White panel */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          bottom: 16,
          width: 330,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 40px 44px 44px",
          borderRadius: 28,
          background: color.white,
          color: color.ink,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              fontSize: 19,
              color: color.sky,
              fontFamily: "Mona Sans Heavy",
            }}
          >
            {panel.label}
          </div>
          <div
            style={{
              fontFamily: "Mona Sans Heavy",
              fontSize: 32,
              lineHeight: 1.15,
              letterSpacing: -0.5,
            }}
          >
            {panel.value}
          </div>
          <div style={{ fontSize: 18, lineHeight: 1.45, color: color.ink2 }}>
            {panel.note}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontFamily: "Mona Sans Heavy", fontSize: 20 }}>
            {site.name}
          </div>
          <div style={{ fontSize: 17, color: color.ink2 }}>
            {`Software developer, ${site.location}`}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 14,
              width: 64,
              height: 6,
              borderRadius: 3,
              background: color.sun,
            }}
          />
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Mona Sans", data: medium, weight: 500, style: "normal" },
        { name: "Mona Sans Heavy", data: heavy, weight: 800, style: "normal" },
        { name: "Mona Sans Black", data: black, weight: 900, style: "normal" },
      ],
    },
  );
}
