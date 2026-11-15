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
  "inline-flex min-h-tap items-center underline decoration-line-strong underline-offset-4 transition-colors duration-(--dur-ui) hover:decoration-fg";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line bg-bg">
      <div className="container-site grid-site gap-y-12 py-16">
        <div className="col-span-12 md:col-span-6">
          <p className="font-display text-wordmark italic">{site.name}</p>
          <p className="mt-2 text-small text-fg-muted">{site.location}</p>
        </div>

        <div className="col-span-12 sm:col-span-6 md:col-span-3">
          <h2 className="type-label text-fg-muted">Contact</h2>
          <a
            href={`mailto:${site.email}`}
            className={`${linkClass} mt-1 text-small break-all`}
          >
            {site.email}
          </a>
        </div>

        <div className="col-span-12 sm:col-span-6 md:col-span-3">
          <h2 className="type-label text-fg-muted">Elsewhere</h2>
          <ul className="mt-1">
            {site.socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  rel="me noopener"
                  className={`${linkClass} text-small`}
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 flex flex-col gap-2 border-t border-line pt-6 text-small text-fg-muted sm:flex-row sm:justify-between">
          <p>
            &copy; {year} {site.name}. Built by {site.name}.
          </p>
          <p>
            Last updated <time dateTime={builtAt.toISOString()}>{updated}</time>
          </p>
        </div>
      </div>
    </footer>
  );
}
