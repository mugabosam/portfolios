# Content to-do for Sam

Things only you can confirm or fix. Nothing on the site is invented; where something is
unknown, it is left out rather than guessed. Tick items off as you go.

## Decided

- [x] **Positioning:** Backend Developer (Python & TypeScript), with frontend work shown
      alongside it.
- [x] **Projects:** MalariaCheck, EUCL internship, Zunga, BlueSnap, MediChain and Inventory
      Pro, with RPS Arena under Experiments. `maison` is left out.
- [x] **LinkedIn:** none. The site links to GitHub and email only.
- [x] **Domain:** none. The site launches on a free `*.vercel.app` address.
- [x] **Education:** Bachelor's degree in Information Technology, University of Rwanda,
      2023 – 2027 (expected).
- [x] **Training:** ALX and Paragon One removed (not taken).

## Please confirm before launch

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

- [ ] **Real screenshots.** Project covers are abstract faceted artwork, not screenshots. If
      you capture real screenshots (for example of MalariaCheck running), put them in
      `public/work/<slug>/` and change `cover` in that project's frontmatter.
- [ ] **Resend account** (free) so the contact form can deliver email. Until a
      `RESEND_API_KEY` is set, the form shows your email address instead.
- [ ] **ML libraries.** The site lists scikit-learn, pandas and Streamlit (what your repos
      show). Add any others you have used in a real project.
- [ ] **Photo (optional).** A portrait for the About page, if you want one.
