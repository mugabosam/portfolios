/**
 * Checks WCAG 2.1 contrast for every colour pair the design uses and writes
 * docs/contrast.md. Run with `pnpm contrast` after changing a colour token.
 * Exits with code 1 if any pair fails its requirement.
 */
import { writeFileSync } from "node:fs";

/** Parses #rrggbb or rgb(r g b / a) into [r, g, b, a]. */
function parse(color) {
  const hex = color.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const rgb = color.match(/^rgb\((\d+) (\d+) (\d+)(?: \/ ([\d.]+))?\)$/);
  if (rgb)
    return [
      Number(rgb[1]),
      Number(rgb[2]),
      Number(rgb[3]),
      rgb[4] ? Number(rgb[4]) : 1,
    ];
  throw new Error(`Unsupported colour: ${color}`);
}

/** Alpha-composites a foreground colour over an opaque background. */
function flatten(fg, bg) {
  const [r, g, b, a] = parse(fg);
  const [br, bgG, bb] = parse(bg);
  return [r * a + br * (1 - a), g * a + bgG * (1 - a), b * a + bb * (1 - a)];
}

function luminance([r, g, b]) {
  const channel = (v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(fg, bg) {
  const l1 = luminance(flatten(fg, bg));
  const l2 = luminance(flatten(bg, bg));
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const AA_TEXT = 4.5;
const NON_TEXT = 3;

/** [foreground token, value, background token, value, use, required ratio] */
const pairs = [
  // Page and cards
  ["--ink", "#0b1b2b", "--paper", "#f5f7fa", "Headings, body text", AA_TEXT],
  ["--ink-2", "#435468", "--paper", "#f5f7fa", "Secondary text", AA_TEXT],
  ["--ink-3", "#5b6b80", "--paper", "#f5f7fa", "Meta text, captions", AA_TEXT],
  ["--ink-2", "#435468", "--surface", "#ffffff", "Text on cards", AA_TEXT],
  ["--ink-3", "#5b6b80", "--surface", "#ffffff", "Meta text on cards", AA_TEXT],
  [
    "--ink-3",
    "#5b6b80",
    "--sky-tint",
    "#e4f2fa",
    "Text on the sky wash",
    AA_TEXT,
  ],
  ["--sky", "#0070a8", "--paper", "#f5f7fa", "Links", AA_TEXT],
  ["--sky", "#0070a8", "--surface", "#ffffff", "Links on cards", AA_TEXT],
  [
    "--sky",
    "#0070a8",
    "--sky-tint",
    "#e4f2fa",
    "Group labels, linked tags",
    AA_TEXT,
  ],
  ["--ink", "#0b1b2b", "--sun", "#fad201", "Primary button", AA_TEXT],
  [
    "--ink",
    "#0b1b2b",
    "--sun-deep",
    "#e8c200",
    "Primary button, hover",
    AA_TEXT,
  ],
  [
    "--leaf-ink",
    "#146c43",
    "--leaf-tint",
    "#e3f4ea",
    '"Now" and status labels',
    AA_TEXT,
  ],
  ["#b42318", "#b42318", "--paper", "#f5f7fa", "Form errors", AA_TEXT],
  [
    "--line-strong",
    "#7c8da3",
    "--paper",
    "#f5f7fa",
    "Input and button borders",
    NON_TEXT,
  ],
  [
    "--line-strong",
    "#7c8da3",
    "--surface",
    "#ffffff",
    "Borders on cards",
    NON_TEXT,
  ],
  [
    "--focus (--sky)",
    "#0070a8",
    "--paper",
    "#f5f7fa",
    "Focus outline",
    NON_TEXT,
  ],
  ["--leaf", "#1e8e5a", "--surface", "#ffffff", "Live dot", NON_TEXT],
  // Navy code panels and the contact band
  ["#ffffff", "#ffffff", "--code", "#0b1b2b", "Headings on navy", AA_TEXT],
  ["--code-fg", "#d6e2ee", "--code", "#0b1b2b", "Code, text on navy", AA_TEXT],
  [
    "--code-muted",
    "#8ea3ba",
    "--code",
    "#0b1b2b",
    "Comments, punctuation",
    AA_TEXT,
  ],
  [
    "--code-key",
    "#6cc9f2",
    "--code",
    "#0b1b2b",
    "Keys, keywords, links on navy",
    AA_TEXT,
  ],
  ["--code-string", "#f6dc5c", "--code", "#0b1b2b", "Strings", AA_TEXT],
  ["--code-number", "#7fdcae", "--code", "#0b1b2b", "Numbers, 200 OK", AA_TEXT],
  ["#a9dcf5", "#a9dcf5", "--code", "#0b1b2b", "Types", AA_TEXT],
  ["--ink", "#0b1b2b", "--sun", "#fad201", "Primary button on navy", AA_TEXT],
  [
    "--code-muted",
    "#8ea3ba",
    "--code",
    "#0b1b2b",
    "Inverse button border",
    NON_TEXT,
  ],
  [
    "--focus (--code-key)",
    "#6cc9f2",
    "--code",
    "#0b1b2b",
    "Focus outline on navy",
    NON_TEXT,
  ],
  // prefers-contrast: more
  [
    "--ink-3",
    "#33445a",
    "--paper",
    "#f5f7fa",
    "Meta text, high-contrast mode",
    AA_TEXT,
  ],
  [
    "--line-strong",
    "#4a5b70",
    "--paper",
    "#f5f7fa",
    "Borders, high-contrast mode",
    NON_TEXT,
  ],
];

const decorative = [
  ["--line", "#dce3eb", "--paper", "#f5f7fa"],
  ["--line", "#dce3eb", "--surface", "#ffffff"],
  ["--code-line", "#223a55", "--code", "#0b1b2b"],
];

let failures = 0;
const rows = pairs.map(([fgName, fg, bgName, bg, use, required]) => {
  const value = ratio(fg, bg);
  const pass = value >= required;
  if (!pass) failures += 1;
  return `| \`${fgName}\` \`${fg}\` | \`${bgName}\` \`${bg}\` | ${use} | ${value.toFixed(2)}:1 | ${required}:1 | ${pass ? "Pass" : "**Fail**"} |`;
});

const decoRows = decorative.map(
  ([fgName, fg, bgName, bg]) =>
    `| \`${fgName}\` \`${fg}\` | \`${bgName}\` \`${bg}\` | ${ratio(fg, bg).toFixed(2)}:1 |`,
);

const markdown = `# Colour contrast

Generated by \`pnpm contrast\` (scripts/contrast.mjs). Do not edit by hand; change the
tokens in \`app/globals.css\` and the pairs in the script, then re-run it.

Requirements (WCAG 2.1 AA): normal text 4.5:1, large text (≥ 24px, or ≥ 18.66px bold) 3:1,
UI component boundaries and focus indicators 3:1 (SC 1.4.11).

## Text and controls

| Foreground | Background | Used for | Ratio | Required | Result |
| --- | --- | --- | --- | --- | --- |
${rows.join("\n")}

## Decorative only

These lines separate content but never carry meaning or mark a control, so SC 1.4.11 does
not apply. Any control that uses a border uses \`--line-strong\` instead.

| Colour | Background | Ratio |
| --- | --- | --- |
${decoRows.join("\n")}

## Notes

- Sky \`#00a1de\` and sun \`#fad201\` are used for graphics only (diagram arrows, the
  contribution graph, the logo, the selection highlight), never for text on paper.
- The contribution graph also reports its numbers as text, so its colour steps are not the
  only way to read it.
- Under \`prefers-contrast: more\`, secondary text, links and borders get darker.

Result: ${failures === 0 ? "every pair passes." : `${failures} pair(s) fail.`}
`;

writeFileSync(new URL("../docs/contrast.md", import.meta.url), markdown);
console.log(
  markdown
    .split("\n")
    .filter((l) => l.startsWith("| `"))
    .join("\n"),
);
console.log(
  failures === 0 ? "\nAll pairs pass." : `\n${failures} pair(s) fail.`,
);
process.exit(failures === 0 ? 0 : 1);
