# Sam Mugabo: portfolio

Personal portfolio site for Sam Mugabo, software developer in Kigali, Rwanda.

It's a monochrome, editorial site built with Next.js 16 (App Router), strict TypeScript and
Tailwind CSS v4, and deployed on Vercel. The build brief lives in
[docs/PORTFOLIO_BUILD_PROMPT.md](docs/PORTFOLIO_BUILD_PROMPT.md).

## Run it locally

Requires Node 24 (see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Scripts

| Command          | What it does                                      |
| ---------------- | ------------------------------------------------- |
| `pnpm dev`       | Development server                                |
| `pnpm build`     | Production build (fails on type or lint errors)   |
| `pnpm typecheck` | Generates route types, then runs `tsc`            |
| `pnpm lint`      | ESLint with zero warnings allowed                 |
| `pnpm format`    | Prettier, including Tailwind class sorting        |
| `pnpm contrast`  | Checks colour contrast, writes `docs/contrast.md` |

Commits follow Conventional Commits. A commit-msg hook enforces them, and a pre-commit hook lints
and formats staged files.

## Where things live

- `content/site.ts`: name, links, navigation and other global copy
- `app/globals.css`: design tokens (colour, type, spacing, motion)
- `components/`: layout pieces and UI primitives
- `docs/`: brief, decision log, contrast report
- `CONTENT_TODO.md`: details Sam still needs to confirm

A fuller guide, covering deployment and how to add a project, comes with the final phase.
