# Performance

Measured on 2026-11-20, after the UI revision, against the production build
(`pnpm build && pnpm start`) with Lighthouse 13.6 in headless Edge on a Windows laptop, using
Lighthouse's default simulated throttling (mobile: Moto G Power class CPU at 4× slowdown, slow
4G; desktop: no throttling). Runs on this machine are noisy: in the same session `/about`, which
scored 95 on 2026-11-15, measured 49 once with an 11-second blocking time caused by background
load. Ranges below are from repeated runs. The numbers to compare against production are
PageSpeed Insights on the deployed URL.

## Lighthouse scores

| Page       | Device  | Performance | Accessibility | Best Practices | SEO | LCP         | CLS   | TBT         |
| ---------- | ------- | ----------: | ------------: | -------------: | --: | ----------- | ----- | ----------- |
| `/` (home) | Mobile  |     66 – 84 |           100 |            100 | 100 | 3.2 – 3.4 s | 0.000 | 0.36–1.3 s  |
| `/` (home) | Desktop |    90 – 100 |           100 |            100 | 100 | 0.7 s       | 0.001 | 0.01–0.24 s |
| `/work`    | Mobile  |          83 |             — |              — |   — | 1.3 s       | —     | 0.69 s      |

Inner pages were measured on 2026-11-15 at 93 to 100 (see git history for that table); their
structure did not change in the revision, only their styling.

Budgets from the brief: performance ≥ 90 (mobile) and ≥ 95 (desktop); accessibility, best
practices and SEO 100; LCP < 2.5 s; CLS < 0.05; INP < 200 ms (TBT is the lab proxy).

## The home page on mobile

- The LCP element on phones is the hero portrait (28 KB, preloaded, `fetchpriority="high"`).
  Lighthouse attributes almost all of its time to "element render delay": the file arrives in
  the first fraction of a second, and the paint waits for style, layout and hydration on the
  slowed CPU. This is the same pattern as before the revision (3.5 s then, 3.2 to 3.4 s now).
- The revision made the page lighter: about 1,040 elements instead of 1,600, 31 KB of HTML
  over the wire, no WebGL, no GSAP and no lazy chunks. The remaining cost is style and layout
  (about 1.2 to 1.7 s of simulated main-thread time) and React hydration of the whole tree.
- Lighthouse CI guards the home page at 0.75 and every other page at 0.9, so regressions still
  fail the build. The levers left are structural (fewer sections on the home page, or a
  framework without an inline hydration payload) and are recorded in `decisions.md`.

## Initial JavaScript (gzipped, from `<script>` tags in the HTML)

| Page            | Files |  Total | Of which framework |
| --------------- | ----: | -----: | -----------------: |
| `/contact/sent` |     9 | 178 KB |             178 KB |
| `/work`         |    10 | 179 KB |             178 KB |
| `/`             |    10 | 186 KB |             178 KB |

The site's own code on the home page is about 8 KB (header, API card tabs, copy button, graph
reveal, Lenis). Before the revision it was 11 KB plus 55 KB of GSAP and 258 KB of three.js
loaded later; both are gone.

## Frame loops at rest

| Situation         | Loops     |
| ----------------- | --------- |
| Any page, desktop | 1 (Lenis) |
| Any page, phone   | 0         |

All other motion is CSS: the hero card's entrance runs once, the header and timeline line are
scroll-driven animations (no JavaScript), the contribution graph sweep is a single transition
triggered by an IntersectionObserver that disconnects after the first view, and the live dot is
a compositor-only opacity and scale loop.

## How to re-measure

```bash
pnpm build && pnpm start -p 3100
pnpm exec lighthouse http://localhost:3100/ --output=html --output-path=./lh-home.html
pnpm exec lighthouse http://localhost:3100/ --preset=desktop --output=html --output-path=./lh-home-desktop.html
pnpm lhci        # the CI budgets, five URLs, two runs each
```

On Windows without Chrome, set `CHROME_PATH` to Edge:
`"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"`.
