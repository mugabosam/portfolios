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
- [ ] **Turn on visitor counts.** In the Vercel project, open **Analytics** and press
      **Enable**. The site already includes the tracker; it counts visitors from then on.
- [x] **Contact form.** Web3Forms is set up, and a test message reached popesir112@gmail.com
      on 2026-11-21. Send one more test from the live site after launch.
- [ ] **A `.me` address (optional).** Free for a year with the GitHub Student Developer Pack
      (Namecheap). See docs/launch-guide.md, steps 5 and 6.

- [ ] **EUCL approval.** The "EUCL device system" card describes what you built in plain
      words only (no code, data, screenshots or internal URLs). Please check that EUCL is
      comfortable with it, and confirm your official job title (shown under Experience).
- [ ] **Vercel address.** Pick the project name, which sets the URL. For example,
      `sammugabo.vercel.app`, if it is free.
- [ ] **Read every project summary once** (`content/projects.ts`) and the assistant's answers
      (`content/assistant.ts`). They were written from your READMEs and code. Correct anything
      that does not sound like you.

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
      `public/work/<slug>/` and change `cover` for that project in `content/projects.ts`.
- [ ] **ML libraries.** The site lists scikit-learn, pandas and Streamlit (what your repos
      show). Add any others you have used in a real project.
- [ ] **Check the hero panel.** It says what you are open to and what you are building now
      (`availability` and `now` in `content/profile.ts`). Update them when that changes.
