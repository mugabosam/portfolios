# Sam Mugabo: portfolio

Personal portfolio of Sam Mugabo, software developer (frontend and backend) in Kigali, Rwanda.

A one-page developer portfolio in warm white, near-black and orange, written for recruiters: no
code on show, every project summarised in plain words. The page opens on a hero where Sam's
cut-out figure stands in front of a rising sun and the giant word BUILD, next to an assistant
visitors can type into ("cv" downloads the CV, "contact" walks through a message). Below it:
selected work as cards that stack as they pin, with a details sheet for each project; about;
experience with a year of GitHub activity; and contact. The header links scroll to each section
and follow the one in view. A printable résumé lives at `/resume`. It is built with Next.js 16
(App Router, Cache Components, React view transitions), strict TypeScript and Tailwind CSS v4,
with CSS scroll-driven animation, GSAP (ScrollTrigger, SplitText) and Lenis, and is meant to be
deployed on Vercel, with Vercel Web Analytics counting visitors.

The original build brief is in [docs/PORTFOLIO_BUILD_PROMPT.md](docs/PORTFOLIO_BUILD_PROMPT.md);
every place where the site departs from it is logged in [docs/decisions.md](docs/decisions.md).

## Run it locally

Requires Node 24 (`.nvmrc`) and pnpm 10 or newer.

```bash
pnpm install
cp .env.example .env.local   # optional; every variable has a safe default
pnpm dev                     # http://localhost:3000
```

Production checks:

```bash
pnpm build && pnpm start -p 3100   # production server used by the e2e tests
pnpm test:unit                     # Vitest: projects, assistant copy, contact schema
pnpm test:e2e                      # Playwright + axe: the page, assistant, desktop and mobile
pnpm lhci                          # Lighthouse budgets (needs Chrome or Edge)
```

## Scripts

| Command           | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `pnpm dev`        | Development server                                                  |
| `pnpm build`      | Production build; fails on type errors or lint errors               |
| `pnpm typecheck`  | Generates route types, then runs `tsc`                              |
| `pnpm lint`       | ESLint with zero warnings allowed                                   |
| `pnpm format`     | Prettier, including Tailwind class sorting                          |
| `pnpm contrast`   | Checks every colour pair, writes `docs/contrast.md`                 |
| `pnpm test:unit`  | Unit tests (projects, assistant copy, contact schema, GitHub data)  |
| `pnpm test:e2e`   | End-to-end and accessibility tests against the production build     |
| `pnpm lhci`       | Lighthouse CI against the production build                          |
| `pnpm covers`     | Regenerates the abstract project banner artwork                     |
| `pnpm resume:pdf` | Prints `/resume` to `public/resume.pdf` (production server running) |

Commits follow Conventional Commits; a hook enforces them and formats staged files.

## Editing the site

**Global copy and the section links in the header:** `content/site.ts`.
**Experience, education, skills, availability, what you are doing now:** `content/profile.ts`.
**Projects (summary, problem, what you built, result, the one number on the card):**
`content/projects.ts`. Write them for a recruiter: plain words, no code.
**What the assistant says, and the opening conversation:** `content/assistant.ts`. The words it
recognises are in `components/assistant/assistant.tsx` (`run`).
**Scenes and motion (intro, sunrise, deck, contact band, page transitions):** `app/scenes.css`
and `components/motion/home-motion.tsx`.
**Design tokens (colour, type, spacing, motion):** `app/globals.css`, top of the file.

### Adding a project

1. Add an entry to `content/projects.ts`: slug, title, year, a plain `kind` ("Mobile app"),
   a one-sentence `summary` (at most 170 characters), a `highlight` (a short value such as
   "17 banks" and its label), `problem`, `built`, `result`, `role`, three or four `tools`, and
   `repo` when the code is public. Mark internal work `confidential: true` (no repository link).
2. Add artwork at `public/work/<slug>/cover.svg`: add the slug to `scripts/covers.mjs` and run
   `pnpm covers`.
3. Run `pnpm test:unit`: it checks unique slugs, an existing cover, a short summary and that no
   project text reads like code.

### Replacing the portraits

`public/portrait/sam-cutout.webp` (home page hero: head to mid-thigh with the background removed,
transparent WebP; `assets/og/sam-cutout.png` is the same figure for the link-preview image) and
`public/portrait/sam-full.jpg` (About page, full length, 3:4). Both are black and white; the
site does not convert them. A new cut-out needs a photo against a plain light wall.

## Environment variables

See `.env.example`. Everything is optional:

| Variable                   | Purpose                                                 |
| -------------------------- | ------------------------------------------------------- |
| `GITHUB_TOKEN`             | GitHub's official data for the contribution graph       |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console HTML-tag verification code        |
| `NEXT_PUBLIC_SITE_URL`     | Canonical URL (your `.me` address); Vercel's when unset |

Messages and visitor counts need no keys: see below.

## Deployment

The site deploys to Vercel from GitHub: pull requests get preview URLs, and `main` is production.
There is no backend at all. Step-by-step instructions for going live, receiving messages and
connecting a `.me` address are in [docs/launch-guide.md](docs/launch-guide.md).

**Messages.** The contact form and the assistant post to
[Web3Forms](https://docs.web3forms.com), which emails each message to Sam. Its access key is in
`content/site.ts` (`formAccessKey`); Web3Forms documents the key as public. Without JavaScript
the form still posts and returns to `/thanks`. If sending fails, visitors are offered their own
email app with the message filled in.

**Visitor counts.** Vercel Web Analytics is wired in (`app/layout.tsx`) and only loads on Vercel.
After importing the project, open its **Analytics** tab and press **Enable**; the dashboard then
shows visitors, page views, countries, devices and where visitors came from. It uses no cookies.
Old addresses (`/work`, `/work/<slug>`, `/about`, `/contact`) redirect to their section.
Security headers (CSP, HSTS, Referrer-Policy, Permissions-Policy, X-Content-Type-Options) are set
in `next.config.ts`.

## Where things live

```
app/            (site)/page.tsx is the one page; resume, thanks, OG image;
                template.tsx (page transitions); scenes.css (the home page's CSS motion)
components/     ui primitives, sections, assistant, motion (intro, GSAP layer, Lenis), layout
content/        site.ts, profile.ts, projects.ts, assistant.ts
lib/            GitHub data, contact schema, OG image, utils
public/         portraits, project banners, résumé PDF, icons
scripts/        contrast report, banner generator, résumé PDF
tests/          unit (Vitest) and e2e (Playwright with axe)
docs/           brief, decision log, contrast report, performance report
```

## Accessibility and performance

WCAG 2.1 AA throughout: every colour pair is checked by `pnpm contrast`; axe runs on every route
and on the project sheet in CI; the page works without JavaScript (the assistant's buttons fall
back to plain links) and under reduced motion. Lighthouse
budgets (performance ≥ 90 mobile, 100 for accessibility, best practices and SEO) are enforced by
`lighthouserc.cjs` and recorded in `docs/performance.md`.
