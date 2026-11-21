# Launch guide

Everything needed to put the portfolio online for free, receive messages in your inbox, count
visitors and use a `.me` address. Do the steps in order; each takes a few minutes.

## 1. Push the code to GitHub

The site is committed locally. Push it so Vercel can read it:

```bash
git push origin main
```

## 2. Put the site on Vercel (free)

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with your GitHub account.
2. Choose **Import** next to `mugabosam/portfolios`. Set **Project Name** to the address you
   want, for example `sammugabo`. Under **Environment Variables** add
   `ENABLE_EXPERIMENTAL_COREPACK` with the value `1`, so Vercel uses this project's pnpm
   version. Leave everything else as it is and press **Deploy**.
3. After about a minute you get an address like `portfolios-xxxx.vercel.app`. Every later
   `git push` to `main` updates the site; other branches get their own preview address.
4. Optional: under **Settings → Environment Variables**, add `GITHUB_TOKEN` (see
   `.env.example`) so the GitHub graph uses GitHub's official data. Redeploy after adding it.

## 3. Turn on visitor counts (free)

1. Open the project on Vercel, then the **Analytics** tab, and press **Enable**.
2. Visits are counted from then on: visitors, page views, countries, devices and where people
   came from (for example LinkedIn or a job site). It uses no cookies, so no consent banner is
   needed. The tracker is already in the code; it only runs on Vercel.

## 4. Check that messages reach your inbox

The contact form and the assistant send messages through
[Web3Forms](https://docs.web3forms.com), which emails them to **popesir112@gmail.com**. The
access key is already in `content/site.ts`, and a test message arrived on 2026-11-21.

1. Open your live site, go to **Contact** and send yourself a test message.
2. Check Gmail, including Spam. If it is in Spam, press **Report not spam**.
3. Press **Reply** in Gmail to answer a visitor directly.

If a message ever fails to send, visitors are offered their own email app with the message
already written.

## 5. Get a free `.me` address (students)

The [GitHub Student Developer Pack](https://education.github.com/pack) includes, from
Namecheap, one year of a `.me` domain (and an SSL certificate) for free.

1. Apply for the pack at [education.github.com/pack](https://education.github.com/pack) with
   your GitHub account. Use your university email address and, if asked, a photo of your
   student card or enrollment letter. Approval can take a few days.
2. Once approved, open the Namecheap offer from the pack (or [nc.me](https://nc.me)), search
   for the name you want, for example `sammugabo.me`, and claim it. Follow Namecheap's steps;
   the first year is free. Note when it renews, because the second year is paid.

## 6. Connect the `.me` address to Vercel

1. In the Vercel project, open **Settings → Domains**, type your domain (for example
   `sammugabo.me`) and press **Add**. Add `www.sammugabo.me` too and let Vercel redirect it to
   the main one.
2. Vercel then shows the exact DNS records for your project: an **A** record for
   `sammugabo.me` and a **CNAME** record for `www`. Copy the values Vercel shows; they are
   specific to your project.
3. In Namecheap, open **Domain List → Manage → Advanced DNS** for the domain. Delete the
   default parking records, then add the two records exactly as Vercel showed them
   (Host `@` for the A record, Host `www` for the CNAME).
4. Back in Vercel the domain turns green within minutes to a few hours. Vercel adds HTTPS by
   itself.
5. In **Settings → Environment Variables**, add `NEXT_PUBLIC_SITE_URL` =
   `https://sammugabo.me` (your domain), then **Redeploy**. Link previews, the sitemap and
   search engines then use the `.me` address.

## 7. Get found on Google

If you plan to use a `.me` address, connect it first so Google learns your final address once.

1. Open [Google Search Console](https://search.google.com/search-console) and choose
   **Add property**, then **URL prefix**. Enter your full address, such as
   `https://sammugabo.vercel.app/`.
2. Choose the **HTML tag** method. From the tag, copy only the code inside `content="..."`.
3. In Vercel, open **Settings → Environment Variables** and add `GOOGLE_SITE_VERIFICATION` with
   that code. Then open **Deployments**, and on the latest one choose **Redeploy**.
4. Back in Search Console, press **Verify**.
5. Open **Sitemaps**, enter `sitemap.xml` and press **Submit**.
6. Open **URL Inspection**, paste your home address and choose **Request indexing**.

Google says crawling can take from a few days to a few weeks, and it does not guarantee that a
page will appear. Links from your GitHub profile, CV and other profiles help it find you.

## 8. After launch

- Put the address on your CV, your GitHub profile and anywhere you apply.
- Check the Analytics tab now and then to see how many people visit and where they come from.
- To change any text, edit the files listed in the README under "Editing the site", commit and
  push; Vercel updates the site in about a minute.
