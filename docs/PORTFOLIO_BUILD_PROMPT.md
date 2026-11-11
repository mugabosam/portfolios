# Build Brief: Sam MUGABO — Professional Developer Portfolio

You are a senior frontend engineer and creative developer. Your task is to design and build a production-grade personal portfolio website for **Sam MUGABO**, a software developer focused on **Python backend development, AI and Machine Learning**. The site must look and behave like an award-level studio site (Awwwards / CSS Design Awards standard), not a student demo or a template.

Read this entire brief before writing any code. Follow it in order. Do not skip sections, do not silently change requirements, and do not mark a phase complete until every acceptance criterion in that phase passes. If something in this brief is impossible or conflicts with something else, stop and report it instead of guessing.

---

## 0. Ground rules for you (the agent)

1. **Never invent facts about Sam.** No fake clients, fake metrics, fake testimonials, fake awards, fake years of experience. Where real content is missing, insert a clearly marked placeholder: `{{TODO: description of what is needed}}`, and list every placeholder in `CONTENT_TODO.md` at the end.
2. **No lorem ipsum anywhere.** Placeholder copy must still be written in the brand voice (see §3) so the layout is tested with realistic text lengths.
3. **No copied brand assets.** The design is *inspired by* a luxury jewellery landing page ("Aurelle — Worn for Life"). Reuse its *principles* (layout rhythm, typography pairing, motion style, monochrome palette). Do not copy its name, wording, logo, product images or code.
4. **Git:** small, meaningful commits using Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `perf:`, `a11y:`). **Do not add `Co-Authored-By` lines to any commit message.**
5. **Work in phases** (§10). At the end of each phase, run the checks listed, fix all failures, commit, then write a short phase report (what was done, what's left, any decisions made).
6. Prefer boring, well-maintained libraries over clever ones. Every dependency must justify its weight.

---

## 1. The design inspiration (what you are reproducing in spirit)

The reference site is a single-product "scrollytelling" landing page. Its defining traits:

- **Pure black canvas (#000)** with white and silver as the only colours. No accent colours, no gradients except light/reflection on the hero object.
- **One hero object** (a diamond ring), rendered photorealistically, that **zooms, rotates and transforms as the user scrolls**, staying the visual anchor across sections.
- **Editorial typography:** very large uppercase serif headlines ("WORN") paired with a **large italic serif** second line ("*for life*"). Tiny, widely-tracked uppercase eyebrow labels ("THE ETERNAL SERIES · NO. 01").
- **Numbered sections** shown as small counters in a corner: `001 / 008`, `002 / 008` …
- **Minimal top nav:** wordmark at left in italic serif; HOME · SHOP · ABOUT · CONTACT in tiny tracked caps on the right.
- **Outlined ghost buttons** (thin 1px white border, tiny tracked caps) as the single repeated call to action.
- **Pinned sections:** content stays pinned while an animation plays, then releases.
- **Section types used:** hero → rotating product with a spec card → one contrasting **white card** section → **manifesto** (large serif paragraph revealed with a progress line) → **orbit** (six small copies orbiting a central object, then collapsing into it) → closing statement → hero reprise ("a circle, returned") which ends the page by mirroring the opening.
- Lots of negative space. Copy is short and confident.

**Known weaknesses of the reference that you must FIX, not copy:**
- Tiny grey label text has insufficient contrast → all text must pass WCAG AA (§7).
- Some sections bleed visually into the next during transitions → transitions must be clean at every viewport size.
- Single CTA repeated with no variation → our CTAs are purposeful (View work / Read case study / Get in touch / Download CV).
- No reduced-motion version → required (§6.5).

---

## 2. Concept: translating the jewellery page into a developer portfolio

The ring becomes **"The Artifact"**: an abstract, faceted 3D crystal (think a cut gemstone/polyhedron with a thin metallic armature) that represents Sam's work: precise, engineered, built to last. The jewellery tagline "Worn for life" becomes the portfolio's thesis.

**Thesis line (hero):** `BUILT` / *to last* (or similar, final copy in §5.1).
**Positioning sentence:** "Backend systems and machine-learning tools, engineered with patience and finished with care."

| Reference section | Portfolio equivalent |
|---|---|
| Hero: WORN *for life* | Hero: name, role, thesis, CTAs |
| See it from every side + spec card | **Craft / Stack:** the Artifact rotates; a spec card lists core stack |
| White "Beyond the expected" card | **Featured project** spotlight (the one contrasting white section) |
| Manifesto paragraph | **Philosophy** paragraph about how Sam builds |
| Six rings orbiting one | **Selected work:** six project "facets" orbiting the Artifact, then collapsing into a project index |
| Let it be *your forever* | **Experience / timeline** |
| Hero reprise | **Contact:** closing statement mirrors the hero |

---

## 3. Brand & voice

- **Wordmark:** `Sam Mugabo` in italic display serif (top-left), or monogram `SM.` on mobile.
- **Voice:** calm, precise, confident, short sentences. No buzzword soup ("passionate rockstar ninja"), no exclamation marks, no emojis.
- **Language:** English (UK or US: pick one and stay consistent; default US).
- **Copy length rule:** headlines ≤ 4 words per line; body paragraphs ≤ 60 words except the manifesto (≤ 70 words).

---

## 4. Design system (implement as tokens before building any section)

### 4.1 Colour tokens (CSS custom properties)
```
--bg:            #000000;
--bg-elevated:   #0B0B0B;
--surface-light: #F4F3F0;   /* the one white "card" section */
--fg:            #FFFFFF;
--fg-muted:      #B5B5B5;   /* must still pass 4.5:1 on --bg */
--fg-subtle:     #8C8C8C;   /* only for text ≥ 18.66px bold / 24px; verify 3:1 */
--fg-on-light:   #0A0A0A;
--line:          rgba(255,255,255,0.16);
--focus:         #FFFFFF;   /* 2px outline + 2px offset */
```
Verify every text/background pair with a contrast checker and record results in `docs/contrast.md`.

### 4.2 Typography
- **Display serif** (headlines + italics): *Instrument Serif* or *Fraunces* (variable, with true italic). Self-host via `next/font`.
- **Text serif** (manifesto, long body): same family or *Newsreader*.
- **Label / UI sans** (eyebrows, nav, buttons, counters): *Inter* or *Geist*, uppercase, `letter-spacing: 0.18em–0.24em`, weight 500.
- **Mono** (code snippets, tech tags): *JetBrains Mono* or *Geist Mono*.
- Fluid type scale with `clamp()`:
  - Display XL (hero): `clamp(4rem, 12vw, 11rem)`, line-height 0.9, uppercase
  - Display italic (second line): same size, italic, sentence case
  - H2: `clamp(2.5rem, 6vw, 5.5rem)`
  - Manifesto: `clamp(1.5rem, 2.6vw, 2.5rem)`, line-height 1.25
  - Body: `1.0625rem`, line-height 1.6
  - Label: `0.75rem` minimum (**never smaller than 12px**)
- Max line length for body text: 65ch.

### 4.3 Layout & spacing
- 12-column grid, max content width 1440px, side gutters `clamp(1.25rem, 5vw, 4rem)`.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192 px.
- Sections are full viewport height (`min-height: 100svh`) unless content requires more.
- Every section has: eyebrow label (top-left), section counter `00X / 008` (bottom-right or top-right), consistent positions throughout.

### 4.4 Components (build in isolation first, in `/components/ui`)
- `Button`: variants `ghost` (1px border, transparent), `solid` (white fill, black text: used once per page max), `link` (underline animates on hover). States: default, hover, focus-visible, active, disabled. Min target 44×44px.
- `Eyebrow`, `SectionCounter`, `DisplayHeading` (two-line: roman + italic), `SpecCard`, `Tag` (tech chip), `ProjectCard`, `TimelineItem`, `Cursor` (optional custom cursor, desktop only, disabled for reduced motion and touch).
- `Nav`: fixed, transparent, `mix-blend-mode: difference` so it stays legible over the white section. Mobile: full-screen overlay menu with focus trap and Esc to close.
- `Footer`: small, with socials, email, copyright, "Built by Sam Mugabo" and last-updated date.
- `Preloader`: max 1.5s, shows counter 0→100 while the 3D model/fonts load; skippable; never blocks content if JS fails.

---

## 5. Site map & section-by-section specification

**Routes**
- `/`: home (8 sections below)
- `/work`: full project index (filterable by Backend / AI-ML / Web / Blockchain)
- `/work/[slug]`: case study per project (MDX)
- `/about`: longer bio, skills matrix, education, values
- `/resume`: HTML résumé + downloadable PDF
- `/contact`: form + direct links (the home closing section also links here)
- `/404`: on-brand ("This page was never cut.") with link home
- `/sitemap.xml`, `/robots.txt`, `/opengraph-image` (dynamic OG images)

### 5.1 `001 / 008` Hero
- Eyebrow: `PORTFOLIO · VOL. 01` (or `{{TODO: year}}` edition).
- Headline: `BUILT` / *to last*.
- Sub-copy (≤ 25 words): "Sam Mugabo: software developer building Python backends and machine-learning systems that keep working long after launch."
- CTAs: `View selected work` (ghost, scrolls to §5.5) and `Get in touch` (link).
- Right/centre: the Artifact, large, slowly idling (subtle rotation + light sweep across facets).
- Bottom-left: `SCROLL TO EXPLORE` with a thin animated line. Bottom-right: `001 / 008`.
- Scroll behaviour: section pins; Artifact zooms in toward the camera until facets fill ~60% of the viewport, then hands off to §5.2.

### 5.2 `002 / 008` Craft / "See it from every side"
- Headline: `SEEN FROM` / `EVERY SIDE` / *where the logic lives*.
- Artifact rotates 360° on scroll (scrubbed, not time-based).
- **Spec card** (bottom-right, like the jewellery spec), e.g.:
  - Label `THE CORE`
  - Title `Python — Backend & ML`
  - Detail line: `Django · REST APIs · PostgreSQL · PyTorch/TensorFlow {{TODO: confirm ML libs}} · JavaScript`
- As it rotates, 3 short "facets" fade in sequentially: **Backend** (APIs, data models, auth), **AI / ML** (model training, evaluation, deployment), **Frontend** (HTML, CSS, JS, production UI from internship work).

### 5.3 `003 / 008` Featured project: the white card
- The only light section. A white card (`--surface-light`) slides in from the right while a dark render/screenshot of the project sits on the left (mirrors the reference).
- Featured project: **Malaria-Detection** (AI/ML) unless Sam says otherwise.
- Content: eyebrow `FEATURED · AI / ML`, headline `BEYOND THE` / `EXPECTED` / *diagnosis* (adjust per project), 2–3 sentence summary, three key facts (Problem · Approach · Result: use `{{TODO}}` for any number not provided), CTA `Read case study` (solid button: the single solid button on the page).

### 5.4 `004 / 008` Philosophy (manifesto)
- A thin horizontal progress line fills left→right as the user scrolls, then the paragraph reveals line by line (mask/clip reveal, not fade-only).
- Draft copy (edit to fit Sam's voice, ≤ 70 words):
  > "Software is never only software. It carries the decisions behind it, the edge cases someone cared enough to handle, the quiet reliability nobody notices until it's gone. I build backends and models the slow way: tested, documented, and made to be read by the next engineer. Each release should leave a system a little more honest than I found it."
- Eyebrow `THE PHILOSOPHY`, counter `004 / 008`.

### 5.5 `005 / 008` Selected work: the orbit
- Six project "facets" (small Artifact copies or project thumbnails in faceted frames) orbit the central Artifact. Labels at the corners: `SHAPED BY PATIENT HANDS` / `ONE DEVELOPER, SIX PROBLEMS`.
- On further scroll, the six collapse into the centre, and the section transitions into a **project index list**: large serif titles, one per row, with year, category and stack tags; hovering a row reveals a preview image following the cursor (desktop) or an inline thumbnail (mobile).
- Projects (from Sam's GitHub `mugabosam`; fill details from READMEs, never invent):
  1. **Malaria-Detection**: AI/ML
  2. **Blockchain-Health**: Blockchain / Health-tech
  3. **Zunga**: `{{TODO: one-line description}}`
  4. **BlueSnap**: `{{TODO}}`
  5. **maison**: `{{TODO}}`
  6. **EUCL DAMS (internship)**: frontend for an inventory/device management system: show as professional experience; **do not expose confidential code, data, screenshots or internal URLs**; describe responsibilities only, pending Sam's approval.
  - Exclude toy projects (e.g. rock-paper-scissor) from the home page; they may appear in `/work` under "Experiments".
- Each row links to `/work/[slug]`. Footer link: `All work →`.

### 5.6 `006 / 008` Experience: "Let it be *your next build*"
- Headline: `LET'S MAKE IT` / *your next build* (top-right like the reference) with ghost CTA `Download CV`.
- Vertical timeline (thin line, dots that fill on scroll):
  - Software Development Intern, EUCL: from Sep 2026, frontend work on the DAMS inventory/device management system. `{{TODO: confirm title & bullet achievements}}`
  - University of Rwanda: `{{TODO: programme, years}}`
  - `{{TODO: any other roles, training, certifications}}`
- Artifact sits behind the timeline, reflecting six small facets inside it (mirrors the reference's "rings inside the ring" shot).

### 5.7 `007 / 008` Toolkit & proof
- Skills matrix grouped: **Languages** (Python, JavaScript, SQL, HTML/CSS), **Backend** (Django, Django REST Framework, PostgreSQL, Docker `{{TODO: confirm}}`), **AI/ML** (`{{TODO: confirm libraries}}`), **Tooling** (Git, GitHub, Linux, CI).
- No skill-percentage bars (unprofessional). Use grouped tags plus "used in" links to projects.
- Optional live GitHub strip: pinned repos / recent activity fetched at build time via GitHub API (ISR, revalidate daily), with graceful fallback if the API fails.

### 5.8 `008 / 008` Contact: "a circle, returned"
- Mirrors the hero exactly (same layout, Artifact front-on, now perfectly still): eyebrow `A CIRCLE, RETURNED`, headline `BUILT` / *to last*, then: "Have a backend to build or a model to ship? Let's talk."
- CTAs: `Start a conversation` (→ `/contact`), email link `{{TODO: public email}}`, GitHub, LinkedIn `{{TODO}}`.
- Availability line: `Open to internships, junior roles and freelance work: Kigali, Rwanda (UTC+2) / remote` `{{TODO: confirm}}`.

### 5.9 Case study template (`/work/[slug]`)
Each case study follows this structure (MDX with typed frontmatter):
1. Hero: title (display serif), one-line summary, meta row (Role · Year · Stack · Links: Live / Repo).
2. **Context**: the problem and who it's for.
3. **My role**: what Sam personally did.
4. **Approach**: architecture diagram (SVG), key decisions and trade-offs.
5. **Technical highlights**: 2–4 code snippets with syntax highlighting (Shiki), each explained.
6. **Results**: real numbers only (accuracy, latency, users); otherwise qualitative outcomes.
7. **What I'd do next**: honest lessons learned.
8. Next/previous project navigation with large serif titles.
Frontmatter schema: `title, slug, summary, year, role, category[], stack[], repo?, live?, cover, featured: boolean, order`. Validate with Zod at build time; fail the build on invalid content.

---

## 6. Motion & 3D specification

### 6.1 Stack
- **Smooth scroll:** Lenis.
- **Scroll animation:** GSAP + ScrollTrigger (pinning, scrubbing). Register once; clean up all triggers on route change.
- **3D:** React Three Fiber + drei. The Artifact is a procedurally generated faceted geometry (e.g. modified `IcosahedronGeometry`/custom brilliant-cut) with `MeshPhysicalMaterial` (transmission, IOR ~2.4, thickness, dispersion if supported) inside a thin metallic armature, lit by an HDRI environment map in black-and-white. Alternatively a compressed GLB (Draco/Meshopt, ≤ 1.5 MB).
- **Micro-interactions:** CSS transitions or Framer Motion for small UI only. Don't mix GSAP and Framer Motion on the same element.

### 6.2 Principles
- Easing: `power3.out` / `cubic-bezier(0.22, 1, 0.36, 1)` for entrances; scrubbed animations are linear to scroll.
- Durations: UI 200–300ms; reveals 600–900ms; nothing over 1.2s that isn't scroll-driven.
- Animate only `transform` and `opacity` (and `clip-path` for reveals). Never animate layout properties.
- Text reveals: split by line (SplitType or GSAP SplitText) with overflow-hidden masks.
- One focal motion per viewport; never compete with the Artifact.

### 6.3 Performance of 3D
- Render the canvas once, fixed behind the page, and drive the Artifact's transform from ScrollTrigger progress (don't mount multiple canvases).
- `dpr={[1, 1.75]}`, pause rendering (`frameloop="demand"`) when tab hidden or canvas offscreen.
- Lazy-load the 3D bundle after first paint; show a high-quality static image (AVIF/WebP) of the Artifact as LCP element and placeholder.
- Detect low-end devices (`navigator.hardwareConcurrency <= 4`, no WebGL2, Save-Data) → use static images + CSS transforms instead.

### 6.4 Mobile
- No pinning longer than 1.5 viewport heights on mobile.
- Orbit section becomes a horizontal swipeable carousel with snap points.
- Hover previews become inline thumbnails. Custom cursor disabled.
- Test at 360×740, 390×844, 768×1024, 1280×800, 1440×900, 1920×1080.

### 6.5 Reduced motion (required)
- When `prefers-reduced-motion: reduce`: disable Lenis, pinning, scrubbing and the 3D idle rotation; show static Artifact images; reveals become simple opacity fades ≤ 200ms or none. All content must be fully readable and in logical order.

---

## 7. Accessibility (WCAG 2.1 AA, non-negotiable)

- All text contrast ≥ 4.5:1 (≥ 3:1 for large text). Labels never below 12px.
- Semantic HTML: one `<h1>` per page, correct heading order, landmarks (`header`, `nav`, `main`, `footer`), `section` with `aria-labelledby`.
- "Skip to content" link as first focusable element.
- Full keyboard navigation; visible `:focus-visible` outlines on everything interactive; no keyboard traps (except mobile menu, which traps intentionally and releases on Esc).
- The 3D canvas is `aria-hidden="true"`; any meaning it carries is also in text.
- Split-text animations must keep the original string accessible (`aria-label` on parent, split spans `aria-hidden`).
- Images have meaningful `alt`; decorative images `alt=""`.
- Forms: visible labels, inline errors linked with `aria-describedby`, success/error announced via `aria-live="polite"`.
- Respect `prefers-reduced-motion`, `prefers-contrast`, and 200% zoom without horizontal scroll.
- Lang attribute set; link text descriptive (no "click here").

---

## 8. Technical architecture

- **Framework:** Next.js (latest stable, App Router) + **TypeScript (strict)**.
- **Styling:** Tailwind CSS with the tokens from §4 mapped into the theme (CSS variables as source of truth). No arbitrary magic numbers outside the scale.
- **Content:** MDX files in `/content/work/*.mdx` + `/content/site.ts` for global copy, socials, timeline, skills, so Sam can update content without touching components.
- **Images:** `next/image`, AVIF/WebP, explicit dimensions, blur placeholders.
- **Fonts:** `next/font` self-hosted, `display: swap`, subset Latin.
- **Contact form:** server action or route handler → email via Resend (or similar), with: Zod validation server-side, honeypot field, rate limiting (per IP), and Cloudflare Turnstile. Secrets only in env vars; provide `.env.example`.
  - *Optional backend showcase (recommended given Sam's focus):* a small Django + DRF service (`/api/contact`, `/api/health`) deployed separately (Render/Railway/Fly), documented in the README as a demonstration of backend skill. If implemented, the Next.js form posts to it, with CORS restricted to the site domain.
- **Analytics:** privacy-friendly (Vercel Analytics or Plausible). No cookie banner needed if no tracking cookies are used; otherwise implement consent properly.
- **Error handling:** custom `error.tsx` and `not-found.tsx`; 3D errors caught by an error boundary that falls back to static images.

**Folder structure**
```
/app
  /(site)/page.tsx            home
  /work/page.tsx              index
  /work/[slug]/page.tsx       case study
  /about /resume /contact
  /api/contact/route.ts
  opengraph-image.tsx, sitemap.ts, robots.ts, not-found.tsx, error.tsx
/components
  /ui        primitives (Button, Eyebrow, SectionCounter…)
  /sections  Hero, Craft, Featured, Philosophy, Work, Experience, Toolkit, Contact
  /three     Artifact, Scene, Lights, fallback
  /motion    lenis provider, gsap setup, reveal hooks
/content     work/*.mdx, site.ts
/lib         content loaders (Zod schemas), utils, github.ts
/public      images, resume.pdf, favicons
/docs        contrast.md, decisions.md
/tests       e2e (Playwright), unit (Vitest)
```

---

## 9. SEO, metadata & sharing

- Per-page `title` (`Sam Mugabo: Python Backend & ML Developer`), description (≤ 155 chars), canonical URL.
- Open Graph + Twitter cards; dynamic OG image per case study in the site's black/serif style.
- JSON-LD: `Person` (name, jobTitle, url, sameAs: GitHub/LinkedIn, address locality Kigali) on home; `CreativeWork`/`SoftwareSourceCode` on case studies.
- `sitemap.xml`, `robots.txt`, favicon set (SVG + PNG + apple-touch), `manifest.webmanifest`, theme-color `#000000`.
- Server-rendered text content (headlines must exist in HTML, not only in canvas/JS).

---

## 10. Build plan: phases with acceptance criteria

### Phase 1: Setup & foundations
- Initialise Next.js + TS strict + Tailwind + ESLint + Prettier + Husky/lint-staged + commitlint.
- Add tokens (§4.1–4.3), fonts, global styles, base layout, Nav, Footer, skip link.
- **Done when:** `pnpm build` passes with zero TS/ESLint errors; nav works on keyboard and mobile; contrast doc created.

### Phase 2: UI primitives
- Build all components in §4.4 with all states. Add a hidden `/styleguide` route (noindex) rendering every component and the type scale.
- **Done when:** every component shown in all states on the styleguide; axe reports zero violations on that page.

### Phase 3: Content layer
- MDX pipeline, Zod schemas, `site.ts`, case-study template, `/work` index with filters, seed 6 projects from GitHub READMEs with `{{TODO}}` where unknown.
- **Done when:** invalid frontmatter fails the build; all routes render statically; `CONTENT_TODO.md` lists every placeholder.

### Phase 4: Home sections (static, no motion yet)
- Build all 8 sections (§5.1–5.8) as fully responsive static layouts with the static Artifact image.
- **Done when:** page is complete, readable and attractive with JavaScript disabled; matches spec at all 6 test viewports.

### Phase 5: Motion
- Lenis, GSAP/ScrollTrigger pinning, text reveals, manifesto progress line, orbit→index transition, timeline fill, reduced-motion variants.
- **Done when:** no layout shift from animations; 60fps on a mid-range laptop (verify with Performance panel); reduced-motion mode verified; no ScrollTrigger leaks across route changes.

### Phase 6: 3D Artifact
- R3F scene, material, HDRI lighting, scroll-driven choreography across sections 1, 2, 5, 6, 8; low-end fallback; error boundary.
- **Done when:** 3D bundle lazy-loaded after LCP; fallback works with WebGL disabled; GPU frame time stable; canvas pauses when hidden.

### Phase 7: Pages & features
- About, Resume (HTML + PDF), Contact (validation, spam protection, rate limiting, success/error states), 404, error page, GitHub strip (optional), Django contact API (optional).
- **Done when:** contact form delivers a real email in staging; all error states tested.

### Phase 8: Quality, SEO & performance hardening
- Metadata, OG images, JSON-LD, sitemap, robots, favicons.
- **Budgets (mobile, Lighthouse, production build):** Performance ≥ 90 (desktop ≥ 95), Accessibility 100, Best Practices 100, SEO 100. LCP < 2.5s, CLS < 0.05, INP < 200ms. Initial JS ≤ 180 KB gzipped excluding the lazy 3D chunk.
- **Done when:** all budgets met and recorded in `docs/performance.md` with screenshots/numbers.

### Phase 9: Testing & CI
- Vitest for utilities and content schemas; Playwright e2e for: navigation, mobile menu, project filters, case-study routing, contact form (mocked), 404, reduced-motion mode; `@axe-core/playwright` on every route.
- GitHub Actions: install → typecheck → lint → unit → build → e2e → Lighthouse CI (fail on budget regressions).
- **Done when:** CI is green on `main`.

### Phase 10: Deployment & handover
- Deploy to Vercel (preview deploys per PR, production on `main`). Configure custom domain `{{TODO: domain}}`, HTTPS, security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- Write `README.md`: overview, stack, local setup, env vars, how to add a project (step-by-step), how to edit copy, deployment, design decisions summary. Write `docs/decisions.md` with every notable trade-off you made.
- Final `CONTENT_TODO.md` checklist for Sam.
- **Done when:** production URL works, all checks pass, README lets a new developer run the project in under 10 minutes.

---

## 11. Professional quality checklist (verify every item before declaring done)

- [ ] No lorem ipsum, no invented facts, no broken or `#` links.
- [ ] Consistent spacing, alignment and type scale on every page; no orphaned single words in headlines (use `text-wrap: balance`).
- [ ] Every interactive element has hover, focus-visible and active states.
- [ ] Works and looks intentional with JS disabled, with WebGL disabled, with reduced motion, at 200% zoom, and on a 360px-wide phone.
- [ ] No console errors or warnings in production.
- [ ] No horizontal scroll at any viewport.
- [ ] Images optimised; no asset > 300 KB except the 3D model/HDRI (each ≤ 1.5 MB, lazy).
- [ ] All copy proofread; consistent capitalisation and punctuation; names spelled "Sam Mugabo".
- [ ] Confidential internship material excluded.
- [ ] Favicon, OG image and page titles look correct when the link is shared.
- [ ] Lighthouse budgets met; axe zero violations; CI green.
- [ ] README, decisions log and content TODO list complete.

---

## 12. Final report

When everything is complete, deliver: the production URL, the repository URL, a summary of each phase, the final Lighthouse scores, a list of all `{{TODO}}` items Sam must fill in, and any recommendations for v2 (e.g. blog/notes section, dark-to-light theme variant, case-study video walkthroughs).
