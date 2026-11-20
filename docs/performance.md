# Performance

Measured on 2026-11-20, after revision 2 (poster hero, GSAP and scroll scenes back), against
the production build (`pnpm build && pnpm start`) with Lighthouse 13.6 in headless Edge on a
Windows laptop, using Lighthouse's default simulated throttling (mobile: Moto G Power class CPU
at 4× slowdown, slow 4G; desktop: no throttling). Runs on this machine are noisy, so the ranges
below come from repeated runs. The numbers to compare against production are PageSpeed Insights
on the deployed URL.

## Lighthouse scores, home page

| Device  | Performance | Accessibility | Best Practices | SEO | LCP         | CLS   | TBT          |
| ------- | ----------: | ------------: | -------------: | --: | ----------- | ----- | ------------ |
| Mobile  |     87 – 91 |           100 |            100 | 100 | 3.2 – 3.3 s | 0.006 | 110 – 220 ms |
| Desktop |          98 |           100 |            100 | 100 | 0.7 s       | 0.024 | 0 ms         |

Before this revision the home page measured 66 to 84 on mobile. The page is smaller now: four
sections instead of six, no API card, no repository strip. Inner pages did not change
structurally; they measured 93 to 100 on 2026-11-15, and /work measured 83 on mobile on
2026-11-20.

Budgets from the brief: performance ≥ 90 (mobile) and ≥ 95 (desktop); accessibility, best
practices and SEO 100; LCP < 2.5 s; CLS < 0.05; INP < 200 ms (TBT is the lab proxy).
Lighthouse CI guards the home page at 0.75 and every other page at 0.9.

## Why the motion costs little

- **The opening is CSS.** The intro count, the sunrise and the night-fall scroll scene are CSS
  animations and scroll-driven animations; the scroll scene runs off the main thread. The
  hero figure is never hidden during its entrance, only offset, so it can paint at once.
- **GSAP loads late.** ScrollTrigger and SplitText arrive on idle on desktop and on the first
  scroll or touch on phones, so a phone that never scrolls (Lighthouse included) never loads
  them.
- **The hero figure is preloaded** (a 70 KB transparent WebP with `fetchpriority="high"`).
  Mobile LCP is still about 3.2 s under simulated throttling, as it was before this revision.
- **Layout shift.** The intro count reserves three digits of width, which took mobile CLS
  from 0.02 to 0.006. On desktop the remaining 0.024 is mostly the BUILD letters changing width
  as they squeeze in, plus two small shifts Lighthouse does not attribute; all under the 0.05
  budget.

## Initial JavaScript (gzipped, from `<script>` tags in the HTML)

| Page            | Files |  Total |
| --------------- | ----: | -----: |
| `/contact/sent` |     9 | 179 KB |
| `/work`         |    10 | 181 KB |
| `/`             |    10 | 188 KB |

`/contact/sent` is close to the framework baseline. The home page adds about 9 KB of its own
code (header, intro, copy button, graph reveal, the GSAP loader). GSAP itself is a separate
lazy chunk, fetched only as described above.

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
