import { Button } from "@/components/ui/button";
import { CopyEmail } from "@/components/ui/copy-email";
import { availability } from "@/content/profile";
import { site } from "@/content/site";

/**
 * The closing band. It opens from a rounded card to the full width as it
 * scrolls into view (CSS scroll-driven, .contact-band), then the headline
 * rises line by line.
 */
export function ContactSection() {
  const github = site.socials.find((social) => social.label === "GitHub");
  return (
    <section id="contact" aria-labelledby="contact-title" className="pb-2">
      <div
        data-tone="blue"
        className="contact-band text-white [--focus:var(--sun)]"
      >
        <div
          aria-hidden="true"
          className="contact-glow pointer-events-none absolute inset-0"
        />
        <div aria-hidden="true" className="contact-sun" />
        <div className="relative container-site py-24 md:py-36">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-sky-deep/40 py-1.5 pr-4 pl-3 text-small font-medium text-white">
            <span className="live-dot" aria-hidden="true" />
            {availability.status}
          </p>
          <h2
            id="contact-title"
            data-split
            className="mt-8 max-w-5xl text-[clamp(3rem,9vw,8.5rem)] leading-[0.9] font-[820] tracking-[-0.04em] text-white [font-stretch:78%]"
          >
            Have something to build? Let’s talk.
          </h2>
          <div className="mt-12 flex flex-col gap-10 border-t border-white/25 pt-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-md" data-fade>
              <p className="text-lead text-white">
                A short note about the role or the product is enough. I reply
                within a few days. You can also leave a message with the
                assistant at the top of the page.
              </p>
              <CopyEmail email={site.email} tone="dark" className="mt-6" />
            </div>
            <div className="flex flex-wrap gap-3" data-fade>
              <Button
                variant="primary"
                href={`mailto:${site.email}`}
                icon="arrow"
                data-magnetic
              >
                Email me
              </Button>
              <Button
                variant="inverse"
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
      </div>
    </section>
  );
}
