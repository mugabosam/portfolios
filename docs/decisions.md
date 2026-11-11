# Decisions

Notable trade-offs, newest last. The brief (`docs/PORTFOLIO_BUILD_PROMPT.md`) stays the source
of truth. Each entry here records a place where it was interpreted, extended or deliberately
changed.

## Phase 1: Setup and foundations (2026-11-11)

**No separate backend.** The site is hosted on Vercel only. The optional Django + DRF contact
service from brief §8 is dropped (Sam's call). The contact form will be a Next.js route handler
that Vercel runs as a serverless function. It keeps the Resend API key secret, validates input
and filters spam. Python skill is shown through the case studies instead.

**Next.js 16.4 with Cache Components and Partial Prefetching.** These are the scaffold defaults.
Every route is currently prerendered as static. Reading the current time during render is not
allowed under Cache Components, so the footer's "Last updated" date comes from `BUILD_DATE`,
which `next.config.ts` stamps once per build.

**Tailwind v4, CSS-first.** Tokens live as CSS custom properties in `app/globals.css` and are
mapped into the theme with `@theme inline`. Tailwind's default colours, type sizes and font
families are removed, so only project tokens can be used.

**Spacing scale by convention.** Brief §4.3 sets 4 to 192px. These are Tailwind steps 1, 2, 3, 4,
6, 8, 12, 16, 24, 32 and 48. Tailwind's spacing multiplier stays, because removing it would also
remove width and height utilities. Use only those steps, plus `tap` (44px) for touch targets.

**Fonts: three families, not four.** Instrument Serif (display and manifesto, true italic), Inter
(UI and body) and JetBrains Mono (code, not preloaded). Newsreader is not loaded: Instrument
Serif already covers the manifesto paragraph, and one fewer font download helps the performance
budget.

**Tokens added beyond the brief.**

- `--line-strong` (white at 60%) for control borders. `--line` (white at 16%) is 1.44:1 on black,
  below the 3:1 that SC 1.4.11 requires for component boundaries, so it is kept for decorative
  dividers only.
- A `surface-light` utility re-points `--bg`, `--fg`, `--fg-muted`, `--line` and `--focus` inside
  the one light section. Components therefore need no light-mode variants, and the focus ring
  turns dark there. The brief's white `--focus` would be invisible on `--surface-light`.
- Type sizes `small`, `lead`, `h3` and `wordmark` fill gaps between the brief's sizes.

**Header blend.** The header uses `mix-blend-mode: difference` (brief §4.4). The mobile menu is
rendered outside the header, because a blended overlay would invert the page behind it.

**Mobile menu is a native `<dialog>`.** `showModal()` makes everything else inert, so focus
cannot leave the menu. Esc closes it, and the browser returns focus to the Menu button. This is
less custom code than a hand-written focus trap, with the same behaviour. The page reserves
scrollbar space (`scrollbar-gutter: stable`), so locking scroll causes no sideways shift.

**Tooling.** Node 24 LTS (`.nvmrc`). pnpm 12 is installed through npm, because the bundled
Corepack 0.32 cannot run pnpm 12. `typecheck` runs `next typegen` first, because types such as
`LayoutProps` are generated. Commitlint accepts the brief's `a11y` commit type.

**Repository location.** The repo stays in OneDrive for now. Moving it would break the open
editor session. If OneDrive sync causes `EPERM` errors in `node_modules` or `.next`, move the
repo to a non-synced folder such as `C:\dev\portfolio`.

## Content decisions (2026-11-11, from Sam)

**Positioning: Backend Developer (Python & TypeScript).** This replaces the brief's "Python
Backend & ML Developer". Sam's strongest professional work (EUCL) is a NestJS backend, and he
also does frontend work, so the copy names APIs, interfaces and machine-learning models together.
The page title and description live in `content/site.ts`.

**The six projects.** MalariaCheck (AI/ML), MediChain (blockchain/health), Zunga (mobile),
BlueSnap (mobile, offline P2P), Inventory Pro (Django, MySQL) and the EUCL internship (described
as responsibilities only). `maison` is dropped because its repository is empty. Inventory Pro is
Django, not PHP: both the GitHub repo and the local copy contain only Python and templates.

**No LinkedIn, no custom domain.** The site links to GitHub and email, and launches on a free
`vercel.app` address. `NEXT_PUBLIC_SITE_URL` can be set later if a domain is bought.

## Phase 2: UI primitives (2026-11-11)

**Full wordmark on mobile.** The brief allows an "SM." monogram on small screens. Axe flagged
it (WCAG 2.5.3, label in name): the link's name "Sam Mugabo, home" did not contain the visible
"SM.". "Sam Mugabo" fits even at 360px, so the header always shows the full name. "SM." remains
the favicon.

**`hocus:` state variant.** Hover styles (on devices that hover) and keyboard focus share one
variant, so keyboard users see the same feedback as mouse users. `data-force="hover|focus|active"`
triggers the same styles statically, which is how `/styleguide` shows every state without
interaction and how axe can check them.

**Hover motion uses transform and opacity only** (brief §6.2). The ghost button fills with a
scaled layer, the solid button darkens with an opacity layer, and the link underline scales in.
Text colour changes are transitioned, but they never move layout.

**Linked tags extend their hit area** to about 50px tall with an invisible pseudo-element. The
chip stays visually small, but the touch target still meets the 44px rule.

**Preloader is pure CSS.** An animated `@property` integer drives the 0 to 100 counter, and the
overlay fades out at 1.5s whether or not JavaScript runs. A small script lets visitors skip it
(any click or key) and hides it for the rest of the session. Under reduced motion it never
shows. It is decorative and `aria-hidden`. Phase 6 will mount it on the home page and may end it
early when the 3D scene is ready.

**Custom cursor deferred.** It is optional in the brief, and a cursor that lags the pointer
hurts usability as often as it helps. It will be reconsidered in Phase 5 once real motion
exists, and it will never apply under touch or reduced motion.

**Playwright and axe added early.** Phase 2's "zero axe violations" needs a real browser, so
`@playwright/test` and `@axe-core/playwright` arrive now rather than in Phase 9. `pnpm test:e2e`
checks every route at desktop and mobile widths (WCAG 2.0/2.1/2.2 A and AA, plus best practices),
including the open mobile menu.

## Phase 3: Content layer (2026-11-11)

**MDX compiled in code, not through `@next/mdx`.** Turbopack cannot pass remark or rehype
plugins that take function options (Next.js MDX guide). Case studies are therefore compiled
with `@mdx-js/mdx` inside a `"use cache"` server component with `cacheLife("max")`, so
compilation and syntax highlighting happen once, at build time. Every case study is prerendered
as static HTML.

**Frontmatter: `yaml` and a strict Zod schema.** Unknown keys, wrong types, unknown categories,
a slug that does not match the file name, a missing cover file, duplicate `order` values or no
featured project all throw with a readable message, which fails `next build`. This was verified
by breaking `zunga.mdx` on purpose. `lib/content/parse.ts` has no file-system access, so unit
tests can exercise it directly.

**Syntax highlighting: Shiki with its JavaScript regex engine** (no WebAssembly) and a custom
monochrome theme. Every token colour passes 4.5:1 on the code background.

**Categories.** The brief's filters are Backend, AI / ML, Web and Blockchain. Mobile is added
because two of the six projects (Zunga, BlueSnap) are mobile apps and fit none of the others.

**Filters live in the URL** (`/work?category=backend`) so a filtered view can be shared. They
are read through `useSyncExternalStore`, so there is no hydration mismatch. Without JavaScript,
the filter buttons stay hidden and every project is listed.

**`dynamicParams` is not allowed with Cache Components.** The build rejects it. Unknown slugs
still return the 404 page through `notFound()`.

**Covers are generated art, not screenshots.** `pnpm covers` draws a faceted gem per project,
seeded by its slug. They match the Artifact theme and never misrepresent a product. Real
screenshots can replace them through the `cover` field.

**Honesty notes in the case studies.** Each claim was checked against the code, not only the
README:

- **Zunga:** the README says dial codes can be fixed remotely, but the remote refresh is still
  a stub, so it is listed under "What I'd do next".
- **BlueSnap:** calls are not claimed. The forward-secret handshake that exists in the code is
  described.
- **Inventory Pro:** low-stock alerts are not claimed, because their panels query undefined
  fields. The same correction was made to Sam's CV.
- **MediChain:** the case study states that administrators can read every record and that
  break-glass access is never reviewed.

**EUCL case study is responsibilities-only.** It has no code, data, screenshots or internal
URLs, and an architecture diagram generic enough to describe many systems. It is pending Sam's
confirmation that EUCL agrees (see CONTENT_TODO.md).
