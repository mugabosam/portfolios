import { Button } from "@/components/ui/button";
import { CopyEmail } from "@/components/ui/copy-email";
import { availability } from "@/content/profile";
import { site } from "@/content/site";
import { getSiteUrl } from "@/lib/site-url";

import { ContactForm } from "./contact-form";

/**
 * The closing section on the orange band: the headline and the direct ways
 * to reach Sam on one side, the contact form on the other. The band opens
 * from a rounded card to the full width as it scrolls into view, and a
 * bright glow rises in its corner (CSS scroll-driven, see scenes.css).
 */
export function ContactSection() {
  const github = site.socials.find((social) => social.label === "GitHub");
  const thanksUrl = new URL("/thanks", getSiteUrl()).toString();
  return (
    <section id="contact" aria-labelledby="contact-title" className="pb-2">
      <div
        data-tone="accent"
        className="contact-band text-white [--focus:#fff]"
      >
        <div aria-hidden="true" className="contact-disc" />
        <div className="relative container-site grid-site gap-y-12 py-24 md:py-32">
          <div className="col-span-12 lg:col-span-6">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/10 py-1.5 pr-4 pl-3 text-small font-medium text-white">
              <span className="live-dot" aria-hidden="true" />
              {availability.status}
            </p>
            <h2
              id="contact-title"
              data-split
              className="mt-8 text-[clamp(3rem,7vw,6.25rem)] leading-[0.9] font-[820] tracking-[-0.04em] text-white [font-stretch:78%]"
            >
              Have something to build? Let’s talk.
            </h2>
            <p className="mt-8 max-w-md text-lead text-white" data-fade>
              A short note about the role or the product is enough. I reply
              within a few days.
            </p>
            <div className="mt-8 flex flex-col items-start gap-5" data-fade>
              <CopyEmail email={site.email} tone="dark" />
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="light"
                  href="/resume.pdf"
                  download
                  icon="download"
                >
                  Download CV
                </Button>
                {github && (
                  <Button variant="inverse" href={github.href} icon="github">
                    GitHub
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <div className="rounded-[1.75rem] bg-surface p-6 shadow-[0_30px_60px_-30px_rgb(11_27_43/0.35)] sm:p-8">
              <ContactForm thanksUrl={thanksUrl} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
