# Performance

Measured on 2026-11-20, after revision 3 (one page, assistant, all blue), against the
production build (`pnpm build && pnpm start`) with Lighthouse 13.6 in headless Edge on a Windows
laptop, using Lighthouse's default simulated throttling (mobile: Moto G Power class CPU at 4×
slowdown, slow 4G; desktop: no throttling). Runs on this machine are very noisy: with other
programs busy, the same build measured 60 to 66 on mobile and the unchanged résumé page 80. The
table is from a quieter moment, with home and résumé measured alternately so the noise shows.
The numbers to compare against production are PageSpeed Insights on the deployed URL.

## Lighthouse scores

| Page      | Device  | Performance | Accessibility | Best Practices | SEO | LCP   | CLS   | TBT        |
| --------- | ------- | ----------: | ------------: | -------------: | --: | ----- | ----- | ---------- |
| `/`       | Mobile  |     90 – 91 |           100 |            100 | 100 | 3.4 s | 0.002 | 60–80 ms   |
| `/`       | Desktop |          99 |           100 |            100 | 100 | 0.7 s | 0.025 | 0 ms       |
| `/resume` | Mobile  |     98 – 99 |           100 |            100 | 100 | 0.9 s | 0     | 100–150 ms |

Budgets from the brief: performance ≥ 90 (mobile) and ≥ 95 (desktop); accessibility, best
practices and SEO 100; LCP < 2.5 s; CLS < 0.05; INP < 200 ms (TBT is the lab proxy).
Lighthouse CI guards the home page at 0.75 and the résumé at 0.9.

Two changes in this revision were made for speed after measuring: the opening chat exchange no
longer streams word by word while the page loads, and the BUILD letters only squeeze (a layout
change every frame) on large screens. Phones load GSAP only at the first scroll or tap and never
load ScrollTrigger.

## Why the motion costs little

- **The opening is CSS.** The intro count, the sunrise and the hero's scroll scene are CSS
  animations and scroll-driven animations; the scroll scene runs off the main thread. The
  hero figure is never hidden during its entrance, only offset, so it can paint at once.
- **GSAP loads late.** It arrives on idle on desktop and at the first scroll or tap on phones,
  so a phone that never scrolls (Lighthouse included) never loads it. ScrollTrigger is loaded
  only for the pinned deck on large screens.
- **The hero figure is preloaded** (a 70 KB transparent WebP with `fetchpriority="high"`).
  Mobile LCP is still about 3.2 s under simulated throttling, as it was before this revision.
- **Layout shift.** The intro count reserves three digits of width, which took mobile CLS
  from 0.02 to 0.006. On desktop the remaining 0.024 is mostly the BUILD letters changing width
  as they squeeze in, plus two small shifts Lighthouse does not attribute; all under the 0.05
  budget.

## Initial JavaScript (gzipped, from `<script>` tags in the HTML)

| Page      | Files |  Total |
| --------- | ----: | -----: |
| `/resume` |     9 | 181 KB |
| `/`       |    11 | 198 KB |

The framework accounts for most of it on both pages. The home page's own code (header, intro,
assistant, project sheet, copy button, graph reveal, the GSAP loader) is about 16 KB; GSAP is a
separate lazy chunk, fetched only as described above.

## Frame loops at rest

| Situation                   | Loops                   |
| --------------------------- | ----------------------- |
| Home, desktop, after idle   | Lenis and GSAP's ticker |
| Home, phone, before a touch | 0                       |
| Any other page, desktop     | 1 (Lenis)               |
| Any other page, phone       | 0                       |

ScrollTrigger is disabled when leaving the home page, so its ticker does not keep running on
other pages.

## How to re-measure

```bash
pnpm build && pnpm start -p 3100
pnpm exec lighthouse http://localhost:3100/ --output=html --output-path=./lh-home.html
pnpm exec lighthouse http://localhost:3100/ --preset=desktop --output=html --output-path=./lh-home-desktop.html
pnpm lhci        # the CI budgets, five URLs, two runs each
```

On Windows without Chrome, set `CHROME_PATH` to Edge:
`"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"`.
