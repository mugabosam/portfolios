import Link from "next/link";

import { LogoMark } from "@/components/ui/icons";
import { site } from "@/content/site";

/** BUILD_DATE is stamped by next.config.ts at build time. */
const builtAt = new Date(process.env.BUILD_DATE ?? "2026-01-01T00:00:00.000Z");
const updated = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Africa/Kigali",
}).format(builtAt);
const year = builtAt.getUTCFullYear();

const linkClass =
  "inline-flex min-h-tap items-center rounded-sm text-small md:min-h-9 text-ink-2 transition-colors duration-(--dur-ui) hocus:text-sky";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line bg-paper">
      <div className="container-site grid-site gap-y-10 pt-14 pb-10">
        <div className="col-span-12 md:col-span-5">
          <p className="flex items-center gap-2.5 font-semibold [font-stretch:108%]">
            <LogoMark className="size-7" />
            {site.name}
          </p>
          <p className="mt-3 max-w-xs text-small text-ink-2">
            Backend developer in {site.location}. Python, TypeScript and the
            interfaces on top of them.
          </p>
        </div>

        <nav aria-label="Footer" className="col-span-6 md:col-span-2">
          <h2 className="text-small font-semibold">Pages</h2>
          <ul className="mt-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 md:col-span-2">
          <h2 className="text-small font-semibold">Elsewhere</h2>
          <ul className="mt-2">
            {site.socials.map((social) => (
              <li key={social.href}>
                <a href={social.href} rel="me noopener" className={linkClass}>
                  {social.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/api/sam" className={linkClass}>
                /api/sam
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-12 md:col-span-3">
          <h2 className="text-small font-semibold">Email</h2>
          <a
            href={`mailto:${site.email}`}
            className={`${linkClass} mt-2 break-all`}
          >
            {site.email}
          </a>
        </div>

        <div className="col-span-12 flex flex-col gap-1 border-t border-line pt-6 text-caption text-ink-3 sm:flex-row sm:justify-between">
          <p>
            &copy; {year} {site.name}. Designed and built by {site.name} with
            Next.js.
          </p>
          <p>
            Last updated <time dateTime={builtAt.toISOString()}>{updated}</time>
          </p>
        </div>
      </div>
    </footer>
  );
}
