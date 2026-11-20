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

## Phases 4 to 6: home page, motion and 3D (2026-11-11 to 2026-11-15)

**Sam's portrait replaces the Artifact in the hero and the closing section** (Sam's request,
2026-11-15). The photo is converted to black and white so it stays inside the monochrome palette,
and the two sections mirror each other with the same image. The 3D Artifact now makes its entrance
at the orbit stage ("Selected work") and reappears behind the experience timeline. A passport photo
will replace the smaller Artifact in "Seen from every side" once Sam provides it. Because every
remaining 3D moment is desktop-only, the WebGL bundle is not loaded below the `md` breakpoint at all.

**One canvas, driven by a plain mutable object.** Scroll triggers write targets into
`lib/motion/artifact-state.ts`; the render loop eases towards them every frame. React state is
kept out of the 60fps path.

**The render loop is governed from inside the WebGL tree.** Next.js keeps the previous page's DOM
hidden for instant back navigation, and effects in that hidden tree are disconnected, so a guard
in the DOM tree could not stop the loop. `FrameloopGuard` lives inside the Fiber root, watches the
canvas with an IntersectionObserver, and switches the loop to `never` when the canvas is hidden,
scrolled away, faded out by a section, or in a background tab.

**Procedural lighting instead of an HDRI.** Thin strip Lightformers on black give the hard
white-and-black facets of a cut stone in photographs, with nothing to download. The static
fallback image (`public/artifact/still.webp`, 25 KB) is captured from the live scene with
`pnpm artifact:still`, so it always matches.

**three.js pinned to 0.182.** 0.183 and later log a `THREE.Clock` deprecation warning from React
Three Fiber's internals on every page load; the site must ship with a clean console.

**Scroll triggers are created top to bottom**, and anything that moves while a section is pinned
lives in that pin's own timeline. Triggers created before a pin do not know about the pinned
distance, which once left every hero tween at progress 0.

**Low-end threshold is fewer than four cores** (not "four or fewer" as the brief words it), plus
no WebGL2, Save-Data, under 4 GB device memory, reduced motion, or a narrow viewport. Many
mid-range laptops have exactly four cores and run the scene well.

**`priority` on next/image is deprecated in Next 16**; the hero image uses `loading="eager"` and
`fetchPriority="high"` instead.

**No Suspense around cached data.** React streams late content into a hidden placeholder and
moves it into place with an inline script. With JavaScript disabled that content stays hidden, so
the GitHub strip (cached at build time, refreshed daily) renders without a Suspense boundary.

**Partial Prefetching is off.** With it on, a request for an unknown case-study slug returned the
static shell with status 200 and streamed the 404 content afterwards, a soft 404. Every page is
fully static anyway, so the feature bought nothing here.

**The preloader is built but not mounted on the home page.** With the portrait as the LCP image
and the 3D scene arriving later and off-screen, there is nothing worth making visitors wait for.
It remains on `/styleguide` and can be mounted in one line if a future hero needs it.

**Custom cursor dropped.** Optional in the brief; the cursor-following project preview on desktop
gives the same editorial feel without taking over the pointer.

## Phase 7: pages and features (2026-11-15)

**Contact form delivers through a route handler** (`/api/contact`) with Resend, called with
`fetch` rather than the SDK. Order of checks: honeypot, per-IP rate limit, Zod validation,
Turnstile (only when keys are set), then email. The rate limit is in memory per serverless
instance, which blunts casual scripts; a global limit would need a store such as Upstash.

**The form degrades twice.** Without JavaScript it posts as a normal form and lands on
`/contact/sent` or `/contact/error`, both static pages. Without a `RESEND_API_KEY`, the page shows
the email address instead of a form, so nothing on the site is ever a dead control.

**The public résumé omits the phone number.** `/resume` and `public/resume.pdf` are generated
from the same page (`pnpm resume:pdf` prints it with headless Chromium), so they cannot drift.
The CV with the phone number stays outside the repository.

## GitHub contribution graph (2026-11-15, Sam's request)

**Drawn, not embedded.** Third-party contribution images are green, cached unpredictably and
invisible to screen readers. The site fetches the calendar at build time (refreshed daily),
normalises it, and draws its own SVG in white at five opacities, with month and weekday labels,
a title on every cell, and the headline numbers repeated in prose.

**Two sources.** GitHub's GraphQL API needs a token, even for public data, so when `GITHUB_TOKEN`
is set the official API is used; otherwise a public mirror (github-contributions-api.jogruber.de)
supplies the same numbers. Both were checked against each other (501 contributions on
2026-11-15). If neither answers, the block renders nothing rather than an invented graph.

**One idle frame loop belongs to Next.js.** After a visit to the home page, every other page
runs a 60 Hz `requestAnimationFrame` loop from inside Next.js's hidden-page (Activity) bookkeeping,
with an empty callback. Pages reached without visiting the home page do not have it, and the same
loop does not appear for the site's own code (ScrollTrigger is disabled on teardown, the 3D loop is
stopped by `FrameloopGuard`, and the cursor preview only animates while a row is hovered). It is
upstream behaviour in Next 16.4 and costs no measurable work; it is recorded here so nobody hunts
for it again.

**CSS stays external.** `experimental.inlineCss` was tried: it removes one render-blocking
request, but Next.js also embeds the inlined styles in the hydration payload, so every page's
HTML grew by about 22 KB compressed, more than twice the stylesheet it replaced. A 10 KB external
stylesheet, cached once for the whole site, is the better trade.

**No Suspense boundaries on the home page, even around static sections.** Selective hydration
(one boundary per section, so React hydrates in short tasks) was tried to cut mobile blocking
time. Under Cache Components every boundary is emitted after the static shell as a streamed
segment, hidden until a script reveals it, so with JavaScript disabled those sections vanished.
The page stays one static tree.

## Phase 8: performance hardening (2026-11-15)

**What moved the numbers.** Zod out of the browser bundle (29 KB and the CSP `eval` violation),
the contribution graph drawn as five paths instead of 365 rectangles, the 3D bundle loaded only
when the visitor nears the orbit stage, GSAP loaded on idle (desktop) or on first touch (phones),
no pinning and no text splitting on phones, heading reveals built lazily as each heading nears,
Lenis skipped on touch devices, a preload for the hero portrait, and portraits sized by width
with an explicit aspect ratio so their box is definite before the file arrives.

**The initial JavaScript budget (≤ 180 KB gzipped) cannot be met by any page on this stack.**
A page with almost no content of its own (`/contact/sent`) ships 178 KB gzipped of Next.js 16
and React 19 runtime. The home page ships 189 KB, so the site's own code is about 11 KB. The
budget is recorded against the framework baseline in docs/performance.md rather than quietly
redefined.

**The home page is the one page below the mobile performance budget** (82 to 88 against the
brief's 90). Its first paint on a 4× slowed CPU is bounded by parsing a 1,600-element page and
the inline hydration payload that Next.js emits for the whole tree; the hero image itself is
11 KB, preloaded and ready within the first second. The two remaining levers are structural
(fewer sections on the home page, or a framework without an inline payload), so they are left
as recommendations. Lighthouse CI guards the home page at 0.75 and every inner page at 0.9.

**Lighthouse variance on this machine is real.** The same page measured 65 and 100 a minute
apart on desktop (software WebGL, background processes). Numbers in docs/performance.md are the
median of repeated runs, and CI runs each URL twice.

## UI revision: "Kigali morning" (2026-11-20, Sam's request)

Sam asked for a more professional, developer-focused look with smooth motion, no ring or gem
anywhere, and a coherent colour palette. This overrides the brief's monochrome, jewelry-inspired
direction (brief §2 to §6), so the changes below replace the earlier design decisions.

**Palette.** Light and cool, built from the Rwandan flag and used with restraint: paper
`#F5F7FA`, navy ink `#0B1B2B` for text and every code panel, sky `#0070A8` for links and
anything interactive (`#00A1DE` for graphics only), sun `#FAD201` for the one primary action in
view, and green `#1E8E5A` for "live" status only (`#146C43` when it is text). Every pair is
checked in docs/contrast.md.

**Type.** Mona Sans for everything, its width axis widened for heavy, sentence-case headlines;
JetBrains Mono only for real code, file paths and requests, with ligatures off so code shows
exactly what was typed. Instrument Serif and Inter are gone, and so are uppercase tracked
labels, numbered section counters and middle-dot meta strings.

**Removed: the 3D Artifact, GSAP and the scroll choreography.** three.js, React Three Fiber,
drei and GSAP are uninstalled, along with the preloader, pinned sections, split-text reveals,
the orbit stage and the faceted gem covers. The portrait replaces the Artifact. Motion is now
CSS only: one entrance sequence on the hero card, a header that settles onto a blurred
background as the page scrolls, a timeline line drawn by a scroll-driven animation, a one-time
sweep on the contribution graph, card lift on hover or focus, and the copy confirmation. Lenis
stays on desktop. Everything is static under `prefers-reduced-motion`.

**The hero is a real API.** The card next to the portrait shows `GET /api/sam` and its JSON,
with tabs for `/api/sam/stack` and `/api/sam/now`. Those three route handlers exist, are
prerendered at build time, and return exactly the objects the card renders (both read
`content/api.ts`), so the card cannot drift from the endpoint. A unit test checks that every
endpoint shown has a route.

**Project cards show real code.** Each card opens with a few lines from the project's
repository, highlighted at build time with a navy Shiki theme. The lines are copied from the
case-study excerpts, and a unit test fails if a quoted line does not appear in the case study.
EUCL is confidential, so its card shows the general architecture as a tree instead, and a test
enforces that confidential work never gets a code peek.

**Home page structure.** Hero, selected work (MalariaCheck featured, four more as cards, all six
on /work), how I work, experience as a commit-graph timeline, stack with GitHub activity and
repositories, then one dark closing band with a copy-email button. Inventory Pro appears on
/work, not on the home page, to keep the grid to two by two.

**Covers** are now abstract component networks on navy (`pnpm covers`), seeded by the slug. They
are decorative and do not describe any project's real architecture. **Open Graph images** use
the same palette and Mona Sans, with a small response card; the static font files for them are
in `assets/fonts/` under the OFL.

**A layout bug worth remembering.** A `<pre>` with long lines sets the min-content width of its
grid or flex ancestors, which widened the whole page to 686px on phones. Code areas now use
`contain: inline-size`, and the card grids use `minmax(0, 1fr)` columns.

**Scroll-driven animations never "finish".** The axe test waited for every animation to end and
timed out on the header and timeline; it now waits only for time-based animations.

## Revision 2: motion, positioning and a poster hero (2026-11-20, Sam's request)

Sam asked for the animation to come back (without any ring), for `/api/sam` to go ("nothing is
in it"), to be presented as a software developer who covers frontend and backend, to be open to
any software role rather than internships or junior roles, for a home page with fewer things on
it but stronger motion, and for a hero that looks like a reference he sent (a bold coloured
panel with a giant word, the person crossing into a white panel, a pill button and a small
status card). The palette and type from the "Kigali morning" revision stay.

**Positioning.** "Software developer (frontend and backend)" everywhere: metadata, JSON-LD,
manifest, résumé, About, contact copy, footer and Open Graph images. Availability reads "Open to
software development roles"; nothing says junior or internship. The EUCL case study keeps its
real title (Software Development Intern), because that is a fact about the job.

**Removed.** The `/api/sam` route handlers, `content/api.ts` and the hero's API card; the home
page's "How I work", experience timeline, stack list and repository strip (all still on /about
or /resume, except the repository strip, which is gone).

**The hero, after Sam's reference.** Taken from the reference: the layout (a coloured panel with
a giant word, the figure crossing into a white panel with nav, an "available for" block and a
small card at the bottom right, a pill button, overlapping round badges). Not taken: its orange,
its word and its testimonial and "trusted by" avatars, which would be invented. Instead: the
flag's sky with a sun disc behind Sam's head, the word BUILD in Mona Sans condensed black, a
"Now" card with what he is building at EUCL, and badges for his main languages with the true
count of the rest. The figure is a cut-out made from his photo (background removed by flood fill
from the white wall, collar and cuffs kept by hand, edges decontaminated so no white fringe shows
on navy).

**Motion.** One orchestrated opening and one scroll scene, then quieter effects:

- Intro: a 0 to 100 count on navy whose curtain lifts with a curved edge (once per tab: a
  sessionStorage flag read by an inline script before the first paint, and a module flag for
  client-side navigations). CSS only, so it also plays without JavaScript.
- Sunrise: the sun rises, the letters of BUILD rise and squeeze from wide to condensed (Mona
  Sans' width axis), the figure lifts, the copy and the white panel arrive in turn.
- Night fall (large screens): the hero pins for about one screen of scrolling while the copy
  and panel leave, the sky turns navy, the sun sets and the figure fades, so the hero hands over
  seamlessly to the navy work section. Pure CSS scroll-driven animation on a sticky stage; the
  view timeline's inset is set to 0, because by default it honours the page's scroll-padding and
  started 80px early.
- Work deck (GSAP ScrollTrigger, large screens): each project card pins and the next one slides
  over it while the covered card shrinks and dims.
- Headlines rise line by line inside masks (GSAP SplitText; masks get extra padding so
  descenders are not clipped). GitHub numbers count up. Primary buttons are magnetic, cards
  carry a pointer spotlight, and the hero's sun, word and figure drift at different depths.
- The contact band opens from a rounded card to full width (CSS scroll-driven).
- Page transitions: React's `<ViewTransition>` in `app/template.tsx`; the old page fades up and
  blurs out, the new one rises in, and the header stays put.
- The header is white over the hero and blends to ink as it settles (registered custom
  properties animated on the scroll timeline), and it slides away while reading down.

GSAP loads after the first paint, as before: on idle on desktop, on the first sign of intent on
phones. Without scroll-driven animation support the hero is one screen tall and static; under
reduced motion nothing moves (no intro, no pinning, instant page swaps).

**Fonts for Open Graph images.** `MonaSans-Condensed-Black.ttf` was added for the giant word;
`JetBrainsMono-Medium.ttf` was removed, since the cards no longer show code.

## Revision 3: one page for recruiters, an assistant, all blue (2026-11-20, Sam's requests)

Sam's requests, in his order: no code anywhere, because most recruiters are not programmers;
short project summaries instead of long write-ups; the whole portfolio on one page, with the
navigation moving between sections as you scroll; the logo was invisible when the page turned
dark; the hero's side panel should look like an AI chat with questions and answers, and work like
a terminal where a visitor can ask for the CV, send a message or ask anything; the hero's blue as
the background all the way down instead of navy; no "Designed and built with Next.js" or "Last
updated" lines; a way to count visitors; and a "View work" button that actually scrolls to the
work.

**One page.** Home is hero, work, about, experience and contact. The header links scroll to those
sections (through Lenis on desktop) and the link of the section in view is marked current.
`/about`, `/work`, `/work/<slug>` and `/contact` were removed and redirect to their section.
`/resume` stays as the printable résumé behind the CV download. `/styleguide`, the case-study
pages, the MDX pipeline, Shiki and the code peeks are gone, along with `@mdx-js/mdx`,
`@shikijs/rehype`, `shiki`, `remark-gfm` and `yaml`.

**Projects in plain words.** `content/projects.ts` replaces the MDX files. Each project has a
one-sentence summary, one number to remember ("9 in 10", "17 banks"), and a short problem, what
was built, result and role, written from the earlier case studies. Cards show the summary, the
tools and the number; "See the details" opens a modal sheet with the rest. A unit test fails if
project text reads like code. The longer write-ups remain in git history.

**The assistant.** The hero's white panel is a chat. It opens with two scripted questions and
answers, offers suggestion buttons, and takes typed input. It is not a language model: it matches
words in what the visitor types against answers in `content/assistant.ts`, and it says so ("Answers
written by Sam"). "cv" downloads the CV; "contact" asks for a name, an email and a message, shows
them back, and sends them through `/api/contact` when Resend is configured (otherwise it opens the
visitor's email app with the message filled in); "projects" lists the projects and opens their
sheets. Replies show typing dots and stream in word by word; the opening exchange arrives a
message at a time, because streaming every word during page load cost about two seconds of style
work on a throttled phone. Without JavaScript the opening exchange is still there and the
suggestions are plain links. The no-JavaScript contact form, its status pages and the form
component were removed; the endpoint stays for the assistant.

**All blue.** The navy sections (night-fall scene, work, contact band) are now the hero's blue:
`--canvas` `#00609A` for the page and `--sky-deep` `#004A75` for buttons and chat bubbles.
The hero no longer turns to night; the sun still sets as the scene scrolls, and the sky's bottom
edge blends into the page blue so there is no seam. About and experience are white sheets on the
blue; the contact band is the sky again, with a sun rising in its corner. The header has three
modes read from the section under it: clear over the hero (nav in a deep-blue pill), blue glass
over blue sections, paper over light pages; on blue the logo turns into a white square so it is
always visible. Every new colour pair is in docs/contrast.md.

**Visitor counts.** Vercel Web Analytics (`@vercel/analytics`), loaded only when built on Vercel
(its script lives at `/_vercel/insights/`, which exists only there). It is cookie-free and needs
no consent banner. Sam has to press Enable in the project's Analytics tab once.

**Scrolling fixes.** "View work" was a router link; same-page links are now plain anchors
handled by Lenis on desktop and by the browser on phones. Lenis' own anchor option was turned off
because it scrolls even when another handler has already dealt with the click. Phones no longer
load ScrollTrigger at all (one-time reveals use an IntersectionObserver), because its page
measurement cancelled a smooth jump that was already under way; only the pinned deck on large
screens uses it.

**Footer.** Only the copyright line remains.
