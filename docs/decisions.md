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
