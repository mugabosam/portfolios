import { Button } from "@/components/ui/button";
import { CopyEmail } from "@/components/ui/copy-email";
import { availability } from "@/content/profile";
import { site } from "@/content/site";

/** The page's closing band: the one dark section, and the way to reach Sam. */
export function ContactSection() {
  const github = site.socials.find((social) => social.label === "GitHub");
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-ink text-white [--focus:var(--code-key)]"
    >
      <div className="container-site grid-site gap-y-10 py-24 md:py-28">
        <div className="col-span-12 lg:col-span-7">
          <p className="inline-flex items-center gap-2.5 text-small font-medium text-code-fg">
            <span className="live-dot" aria-hidden="true" />
            {availability.status}
          </p>
          <h2 id="contact-title" className="mt-5 type-h1 text-white">
            Have a backend to build? Let’s talk.
          </h2>
          <p className="mt-5 max-w-xl text-lead text-code-fg">
            A short note about what you’re building is enough. I reply within a
            few days. {availability.where}
          </p>
        </div>
        <div className="col-span-12 flex flex-col items-start gap-4 lg:col-span-5 lg:items-end lg:justify-end">
          <CopyEmail email={site.email} tone="dark" />
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" href="/contact">
              Write to me
            </Button>
            {github && (
              <Button variant="inverse" href={github.href} icon="github">
                GitHub
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
