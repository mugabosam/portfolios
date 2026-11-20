# Content to-do for Sam

Things only you can confirm or fix. Nothing on the site is invented; where something is
unknown, it is left out rather than guessed. Tick items off as you go.

## Decided

- [x] **Positioning:** Software Developer, frontend and backend (changed from "Backend
      Developer" on 2026-11-20). Open to software development roles of any level, not only
      internships or junior roles.
- [x] **Projects:** MalariaCheck, EUCL internship, Zunga, BlueSnap, MediChain and Inventory
      Pro, with RPS Arena under Experiments. `maison` is left out.
- [x] **LinkedIn:** none. The site links to GitHub and email only.
- [x] **Domain:** none. The site launches on a free `*.vercel.app` address.
- [x] **Education:** Bachelor's degree in Information Technology, University of Rwanda,
      2023 – 2027 (expected).
- [x] **Training:** ALX and Paragon One removed (not taken).

## Please confirm before launch

- [ ] **Vercel.** You are logged out of the Vercel CLI, so the project was not created from
      here. Import the GitHub repository at vercel.com/new (framework preset: Next.js, no other
      settings needed); every pull request then gets a preview URL and `main` is production.
      Add the optional environment variables from `.env.example` in the project settings.

- [ ] **EUCL approval.** The internship case study describes responsibilities and a generic
      architecture only (no code, data, screenshots or internal URLs). Please check that
      EUCL is comfortable with `/work/eucl-internship` and confirm your official job title.
- [ ] **Vercel address.** Pick the project name, which sets the URL. For example,
      `sammugabo.vercel.app`, if it is free.
- [ ] **Read every case study once** (`content/work/*.mdx`). Each was written from your
      READMEs and code. Correct anything that does not sound like you.

## Worth fixing on GitHub (outside this site)

- [ ] **Committed database file.** `mugabosam/Inventory` contains `inventory/dreamhome`, a
      SQLite file with one user account and its password hash. Delete it from the repo
      (and its history if you can), and change that password anywhere you reuse it.
- [ ] **BlueSnap homepage link.** The repo's website field points to
      `blue-snap.vercel.app`, which returns 404. Remove it, or redeploy the page.
- [ ] **Profile README claims.** Your GitHub profile says Inventory Pro has low-stock
      alerts, but the alert panels query fields the models do not define, so they would
      fail. Fix the code or soften the sentence.

## Optional improvements

- [ ] **GitHub token for the contribution graph.** Create a fine-grained personal access token
      with no permissions at github.com/settings/personal-access-tokens, and set it as
      `GITHUB_TOKEN` in the Vercel project. The graph then reads GitHub's official API; until
      then it uses a public mirror of the same numbers.

- [ ] **Colour portrait (optional).** The portraits are black and white because the colour
      original was no longer on this computer. If you prefer colour, save the original photo
      and I can regenerate `sam-hero.jpg` (4:5 crop) and `sam-full.jpg` from it.

- [ ] **Real screenshots.** Project banners are abstract network artwork, not screenshots. If
      you capture real screenshots (for example of MalariaCheck running), put them in
      `public/work/<slug>/` and change `cover` in that project's frontmatter.
- [ ] **Resend account** (free) so the contact form can deliver email. Until a
      `RESEND_API_KEY` is set, the form shows your email address instead.
- [ ] **ML libraries.** The site lists scikit-learn, pandas and Streamlit (what your repos
      show). Add any others you have used in a real project.
- [ ] **Check the hero panel.** It says what you are open to and what you are building now
      (`availability` and `now` in `content/profile.ts`). Update them when that changes.
