import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { CopyEmail } from "@/components/ui/copy-email";
import { availability } from "@/content/profile";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} about software development roles, web and mobile products, APIs or machine-learning projects.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const formEnabled = Boolean(process.env.RESEND_API_KEY);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const github = site.socials.find((social) => social.label === "GitHub");

  return (
    <>
      <PageHeader
        title="Let’s talk"
        intro="Have a product to build, a team to join or a system that needs work, front or back? Write to me."
      />

      <section
        aria-labelledby="contact-ways"
        className="container-site grid-site gap-y-10 pb-24 md:pb-32"
      >
        <h2 id="contact-ways" className="sr-only">
          Ways to get in touch
        </h2>

        <div className="col-span-12 md:col-span-7">
          <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
            {formEnabled ? (
              <ContactForm turnstileSiteKey={turnstileSiteKey} />
            ) : (
              <>
                <h3 className="type-h3">Email me directly</h3>
                <p className="mt-3 max-w-(--measure) text-ink-2">
                  A short note about what you are building is enough. I reply
                  within a few days.
                </p>
                <CopyEmail email={site.email} className="mt-6" />
              </>
            )}
          </div>
        </div>

        <aside className="col-span-12 flex flex-col gap-8 md:col-span-4 md:col-start-9">
          <div>
            <h3 className="text-small font-semibold">Availability</h3>
            <p className="mt-2 inline-flex items-center gap-2.5 text-ink-2">
              <span className="live-dot shrink-0" aria-hidden="true" />
              {availability.status}
            </p>
            <p className="mt-1 text-ink-2">{availability.where}</p>
          </div>
          {formEnabled && (
            <div>
              <h3 className="text-small font-semibold">Email</h3>
              <Button
                variant="link"
                href={`mailto:${site.email}`}
                className="mt-1"
              >
                {site.email}
              </Button>
            </div>
          )}
          {github && (
            <div>
              <h3 className="text-small font-semibold">Code</h3>
              <Button href={github.href} icon="github" className="mt-3">
                github.com/mugabosam
              </Button>
            </div>
          )}
        </aside>
      </section>
    </>
  );
}
