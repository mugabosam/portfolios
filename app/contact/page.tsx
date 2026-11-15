import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { availability } from "@/content/profile";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} about backend work, machine-learning projects, internships or junior roles.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const formEnabled = Boolean(process.env.RESEND_API_KEY);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const github = site.socials.find((social) => social.label === "GitHub");

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        roman="Start a"
        italic="conversation"
        intro="Have a backend to build, a model to ship, or a team with room for a junior developer who takes testing seriously? Write to me."
      />

      <section
        aria-labelledby="contact-ways"
        className="container-site grid-site gap-y-16 pb-32"
      >
        <h2 id="contact-ways" className="sr-only">
          Ways to get in touch
        </h2>

        <div className="col-span-12 md:col-span-7">
          {formEnabled ? (
            <ContactForm turnstileSiteKey={turnstileSiteKey} />
          ) : (
            <div className="border border-line p-8">
              <p className="type-label text-fg-muted">Email</p>
              <a
                href={`mailto:${site.email}`}
                className="mt-4 inline-flex min-h-tap items-center font-display text-h3 break-all underline decoration-line-strong underline-offset-8 transition-colors duration-(--dur-ui) hocus:decoration-fg"
              >
                {site.email}
              </a>
              <p className="mt-6 max-w-(--measure) text-fg-muted">
                A short note about what you are building is enough. I reply
                within a few days.
              </p>
            </div>
          )}
        </div>

        <aside className="col-span-12 flex flex-col gap-10 md:col-span-4 md:col-start-9">
          <div>
            <h3 className="type-label text-fg-muted">Direct</h3>
            <ul className="mt-4 flex flex-col items-start">
              <li>
                <Button variant="link" href={`mailto:${site.email}`}>
                  {site.email}
                </Button>
              </li>
              {github && (
                <li>
                  <Button variant="link" href={github.href} icon="external">
                    GitHub
                  </Button>
                </li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="type-label text-fg-muted">Availability</h3>
            <p className="mt-4 text-fg-muted">{availability}</p>
          </div>
          <div>
            <h3 className="type-label text-fg-muted">Based in</h3>
            <p className="mt-4 text-fg-muted">{site.location}</p>
          </div>
        </aside>
      </section>
    </>
  );
}
