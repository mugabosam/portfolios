# Sam Mugabo: portfolio

Personal portfolio of Sam Mugabo, backend developer (Python and TypeScript) in Kigali, Rwanda.

A monochrome, editorial site: large serif headlines, numbered sections, a scroll-driven home
page with a 3D "Artifact" that appears on desktop, six written case studies, and a contact form.
It is built with Next.js 16 (App Router, Cache Components), strict TypeScript and Tailwind CSS v4,
animated with GSAP and Lenis, rendered in WebGL with React Three Fiber, and deployed on Vercel.

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
pnpm test:unit                     # Vitest: content schema, contact schema, utilities
pnpm test:e2e                      # Playwright + axe: every route, desktop and mobile
pnpm lhci                          # Lighthouse budgets (needs Chrome or Edge)
```

## Scripts

| Command               | What it does                                                        |
| --------------------- | ------------------------------------------------------------------- |
| `pnpm dev`            | Development server                                                  |
| `pnpm build`          | Production build; fails on type errors, lint errors or bad content  |
| `pnpm typecheck`      | Generates route types, then runs `tsc`                              |
| `pnpm lint`           | ESLint with zero warnings allowed                                   |
| `pnpm format`         | Prettier, including Tailwind class sorting                          |
| `pnpm contrast`       | Checks every colour pair, writes `docs/contrast.md`                 |
| `pnpm test:unit`      | Unit tests                                                          |
| `pnpm test:e2e`       | End-to-end and accessibility tests against the production build     |
| `pnpm lhci`           | Lighthouse CI against the production build                          |
| `pnpm covers`         | Regenerates the faceted project cover artwork                       |
| `pnpm artifact:still` | Captures the static Artifact image from the live 3D scene (dev)     |
| `pnpm resume:pdf`     | Prints `/resume` to `public/resume.pdf` (production server running) |

Commits follow Conventional Commits; a hook enforces them and formats staged files.

## Editing the site

**Global copy, links and navigation:** `content/site.ts`.
**Experience, education, skills, values, manifesto:** `content/profile.ts`.
**Smaller projects under "Experiments":** `content/experiments.ts`.
**Design tokens (colour, type, spacing, motion):** `app/globals.css`, top of the file.

### Adding a project

1. Create `content/work/<slug>.mdx`. Copy the frontmatter from an existing file and fill it in:

   ```yaml
   ---
   title: Project name # ≤ 40 characters
   slug: project-name # must equal the file name
   summary: One or two sentences, 40 to 220 characters, used in lists and metadata.
   year: 2026
   role: Solo project. What you did
   category: [backend] # backend, ai-ml, web, mobile, blockchain
   stack: [Python, Django] # up to 8
   repo: https://github.com/... # optional; not allowed when confidential
   live: https://... # optional
   cover: /work/project-name/cover.svg
   featured: false # exactly one project is featured
   order: 7 # unique; drives list order
   confidential: false # true hides links and signals "describe only"
   ---
   ```

2. Add a cover at `public/work/<slug>/cover.svg` (or `.png`, `.jpg`, `.webp`, `.avif`). To get a
   generated faceted cover, add the slug to `scripts/covers.mjs` and run `pnpm covers`.

3. Write the body in the shared structure: `## Context`, `## My role`, `## Approach` (with a
   `<Diagram>`), `## Technical highlights` (with `<Snippet>` code blocks), `## Results` (with
   `<Stats>` only for measured numbers), `## What I'd do next`. Available components:
   `Diagram`, `Snippet`, `Stats`, `Note`.

4. Run `pnpm build`. Invalid frontmatter, a missing cover, a duplicate `order` or a slug that does
   not match the file name fails the build with a message naming the problem.

5. Optionally link the project from skills in `content/profile.ts` (`usedIn: ["project-name"]`)
   and from `components/sections/github-strip.tsx` if it has a public repository.

### Replacing the portraits

`public/portrait/sam-hero.jpg` (home page opening and closing sections) and
`public/portrait/sam-passport.jpg` (the "Seen from every side" section). Both are shown in black
and white; the site does not convert them, so prepare them as monochrome JPEGs, 3:4, under 300 KB.

## Environment variables

See `.env.example`. Everything is optional:

| Variable                         | Purpose                                                       |
| -------------------------------- | ------------------------------------------------------------- |
| `RESEND_API_KEY`                 | Enables the contact form. Without it the page shows the email |
| `CONTACT_TO_EMAIL`               | Recipient (defaults to the address in `content/site.ts`)      |
| `CONTACT_FROM_EMAIL`             | Sender; Resend's shared sender works without a domain         |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile widget on the form                       |
| `TURNSTILE_SECRET_KEY`           | Turnstile verification on the server                          |
| `GITHUB_TOKEN`                   | Higher rate limit for the build-time repository stats         |
| `NEXT_PUBLIC_SITE_URL`           | Canonical URL; Vercel supplies its own when unset             |

## Deployment

The site deploys to Vercel from GitHub: pull requests get preview URLs, and `main` is production.
There is no separate backend. The contact form's route handler (`app/api/contact/route.ts`) runs
as a serverless function. Set the environment variables above in the Vercel project settings.
Security headers (CSP, HSTS, Referrer-Policy, Permissions-Policy, X-Content-Type-Options) are set
in `next.config.ts`.

## Where things live

```
app/            routes: (site)/page.tsx is the home page; work, about, resume, contact, api
components/     ui primitives, home sections, motion (GSAP, Lenis), three (WebGL), mdx, layout
content/        site.ts, profile.ts, experiments.ts, work/*.mdx
lib/            content loaders and Zod schemas, motion state, contact schema, OG image, utils
public/         portraits, project covers, the Artifact still, résumé PDF, icons
scripts/        contrast report, cover generator, Artifact still capture, résumé PDF
tests/          unit (Vitest) and e2e (Playwright with axe)
docs/           brief, decision log, contrast report, performance report
```

## Accessibility and performance

WCAG 2.1 AA throughout: every colour pair is checked by `pnpm contrast`; axe runs on every route
in CI; the home page works without JavaScript, without WebGL and under reduced motion. Lighthouse
budgets (performance ≥ 90 mobile, 100 for accessibility, best practices and SEO) are enforced by
`lighthouserc.cjs` and recorded in `docs/performance.md`.
