/**
 * Generates the banner at the top of each case study:
 * public/work/<slug>/cover.svg. Run with `pnpm covers`.
 *
 * Covers are abstract (a small network of components and connections in the
 * site palette, seeded by the project slug), not screenshots or real
 * architecture, so they never misrepresent a product. Replace any of them
 * with a real screenshot by changing `cover` in the MDX frontmatter.
 */
import { mkdirSync, writeFileSync } from "node:fs";

const W = 1600;
const H = 460;

const slugs = [
  "malaria-check",
  "eucl-internship",
  "zunga",
  "bluesnap",
  "medichain",
  "inventory-pro",
];

const palette = {
  bg: "#0b1b2b",
  dot: "#1b3149",
  node: "#11263c",
  nodeLine: "#2a4563",
  detail: "#2a4563",
  edge: "#2a4563",
  sky: "#00a1de",
  skyText: "#6cc9f2",
  sun: "#fad201",
  leaf: "#7fdcae",
};

/** Small deterministic PRNG so covers only change when the slug does. */
function rng(seedText) {
  let seed = [...seedText].reduce(
    (h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761),
    1779033703,
  );
  return () => {
    seed = Math.imul(seed ^ (seed >>> 15), 2246822507);
    seed = Math.imul(seed ^ (seed >>> 13), 3266489909);
    return ((seed ^= seed >>> 16) >>> 0) / 4294967296;
  };
}

const NODE_W = 132;
const NODE_H = 60;
const COLS = 7;
const ROWS = [120, 230, 340];

function cover(slug) {
  const random = rng(slug);
  const pick = (list) => list[Math.floor(random() * list.length)];

  // One component per column, on a random row; a second one in some columns.
  const nodes = [];
  for (let col = 0; col < COLS; col++) {
    const x = 170 + col * ((W - 340) / (COLS - 1));
    const rows = [...ROWS].sort(() => random() - 0.5);
    nodes.push({ x, y: rows[0], col });
    if (col > 0 && col < COLS - 1 && random() < 0.45)
      nodes.push({ x, y: rows[1], col });
  }

  const byCol = (col) => nodes.filter((node) => node.col === col);
  const core = pick(nodes.filter((node) => node.col >= 3 && node.col <= 4));
  const live = pick(nodes.filter((node) => node.col >= 5 && node !== core));

  // Every component connects to one in the next column.
  const edges = [];
  for (let col = 0; col < COLS - 1; col++) {
    for (const from of byCol(col)) {
      const targets = byCol(col + 1);
      edges.push([from, pick(targets)]);
    }
    for (const to of byCol(col + 1)) {
      if (!edges.some(([, target]) => target === to))
        edges.push([pick(byCol(col)), to]);
    }
  }

  // Highlight the path that runs into the core component.
  const highlighted = new Set();
  let cursor = core;
  while (cursor.col > 0) {
    const edge = edges.find(([, to]) => to === cursor);
    if (!edge) break;
    highlighted.add(edge);
    cursor = edge[0];
  }

  const path = ([a, b]) => {
    const x1 = a.x + NODE_W / 2;
    const x2 = b.x - NODE_W / 2;
    const mid = (x1 + x2) / 2;
    if (a.y === b.y) return `M${x1} ${a.y}H${x2}`;
    const r = 12 * Math.sign(b.y - a.y);
    return `M${x1} ${a.y}H${mid - 12}q12 0 12 ${r}V${b.y - r}q0 ${r} 12 ${r}H${x2}`;
  };

  const edgeSvg = edges
    .map((edge) => {
      const on = highlighted.has(edge);
      return `<path d="${path(edge)}" stroke="${on ? palette.sky : palette.edge}" stroke-width="${on ? 2.5 : 2}"/>`;
    })
    .join("");

  const portSvg = edges
    .flatMap(([a, b]) => [
      `<circle cx="${a.x + NODE_W / 2}" cy="${a.y}" r="4"/>`,
      `<circle cx="${b.x - NODE_W / 2}" cy="${b.y}" r="4"/>`,
    ])
    .join("");

  const nodeSvg = nodes
    .map((node) => {
      const x = node.x - NODE_W / 2;
      const y = node.y - NODE_H / 2;
      const isCore = node === core;
      const isLive = node === live;
      const stroke = isCore
        ? palette.sun
        : isLive
          ? palette.leaf
          : palette.nodeLine;
      const fill = isCore ? palette.sun : palette.node;
      const detail = isCore ? "#0b1b2b" : palette.detail;
      const bar = 40 + Math.round(random() * 44);
      return `<g>
<rect x="${x}" y="${y}" width="${NODE_W}" height="${NODE_H}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
<rect x="${x + 18}" y="${y + 18}" width="${bar}" height="8" rx="4" fill="${detail}"/>
<rect x="${x + 18}" y="${y + 34}" width="${Math.round(bar * 0.6)}" height="8" rx="4" fill="${detail}" opacity="0.7"/>
${isLive ? `<circle cx="${x + NODE_W - 20}" cy="${y + 22}" r="5" fill="${palette.leaf}"/>` : ""}
</g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1.5" fill="${palette.dot}"/></pattern></defs>
<rect width="${W}" height="${H}" fill="${palette.bg}"/>
<rect width="${W}" height="${H}" fill="url(#dots)"/>
<g fill="none" stroke-linejoin="round" stroke-linecap="round">${edgeSvg}</g>
<g fill="${palette.skyText}">${portSvg}</g>
${nodeSvg}
</svg>
`;
}

for (const slug of slugs) {
  const dir = new URL(`../public/work/${slug}/`, import.meta.url);
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL("cover.svg", dir), cover(slug));
  console.log(`public/work/${slug}/cover.svg`);
}
