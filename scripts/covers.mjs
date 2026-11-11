/**
 * Generates a faceted cover image for each case study:
 * public/work/<slug>/cover.svg. Run with `pnpm covers`.
 *
 * Covers are abstract (a cut-gem pattern seeded by the project slug), not
 * screenshots, so they never misrepresent a product. Replace any of them
 * with a real screenshot by changing `cover` in the MDX frontmatter.
 */
import { mkdirSync, writeFileSync } from "node:fs";

const W = 1600;
const H = 1000;

const projects = [
  { slug: "malaria-check", sides: 8, light: 220 },
  { slug: "eucl-internship", sides: 6, light: 300 },
  { slug: "zunga", sides: 10, light: 140 },
  { slug: "bluesnap", sides: 12, light: 40 },
  { slug: "medichain", sides: 8, light: 260 },
  { slug: "inventory-pro", sides: 6, light: 180 },
];

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

function ring(cx, cy, radius, count, offset, jitter, random) {
  return Array.from({ length: count }, (_, i) => {
    const angle =
      offset + (i / count) * Math.PI * 2 + (random() - 0.5) * jitter;
    const r = radius * (1 + (random() - 0.5) * jitter * 0.4);
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r * 0.92];
  });
}

function grey(level) {
  const v = Math.round(Math.max(0, Math.min(1, level)) * 255);
  const hex = v.toString(16).padStart(2, "0");
  return `#${hex}${hex}${hex}`;
}

function cover({ slug, sides, light }) {
  const random = rng(slug);
  const cx = W * 0.62;
  const cy = H * 0.5;
  const lightAngle = (light * Math.PI) / 180;
  const table = ring(cx, cy, 150, sides, random() * Math.PI, 0.15, random);
  const crown = ring(cx, cy, 300, sides * 2, random() * Math.PI, 0.12, random);
  const girdle = ring(cx, cy, 420, sides * 2, random() * Math.PI, 0.06, random);

  const facets = [];
  const shade = (points) => {
    const mx = points.reduce((s, p) => s + p[0], 0) / points.length - cx;
    const my = points.reduce((s, p) => s + p[1], 0) / points.length - cy;
    const facing = Math.cos(Math.atan2(my, mx) - lightAngle);
    const distance = Math.hypot(mx, my) / 420;
    return grey(
      0.08 +
        0.42 * Math.max(0, facing) * (1 - distance * 0.5) +
        random() * 0.08,
    );
  };
  const add = (points) => facets.push({ points, fill: shade(points) });

  // Table: fan from the centre.
  table.forEach((p, i) => add([[cx, cy], p, table[(i + 1) % sides]]));
  // Crown: two crown points per table edge.
  table.forEach((p, i) => {
    const next = table[(i + 1) % sides];
    const a = crown[i * 2];
    const b = crown[i * 2 + 1];
    const c = crown[(i * 2 + 2) % crown.length];
    add([p, a, b]);
    add([p, b, next]);
    add([next, b, c]);
  });
  // Girdle band.
  crown.forEach((p, i) => {
    const next = crown[(i + 1) % crown.length];
    add([p, girdle[i], next]);
    add([next, girdle[i], girdle[(i + 1) % girdle.length]]);
  });

  const polys = facets
    .map(
      ({ points, fill }) =>
        `<polygon points="${points.map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ")}" fill="${fill}"/>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="#000"/>
<g stroke="#ffffff" stroke-opacity="0.32" stroke-width="1.2" stroke-linejoin="round">${polys}</g>
</svg>
`;
}

for (const project of projects) {
  const dir = new URL(`../public/work/${project.slug}/`, import.meta.url);
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL("cover.svg", dir), cover(project));
  console.log(`public/work/${project.slug}/cover.svg`);
}
