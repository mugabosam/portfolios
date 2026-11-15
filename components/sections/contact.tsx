import { Button } from "@/components/ui/button";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Portrait } from "@/components/ui/portrait";
import { SectionCounter } from "@/components/ui/section-counter";
import { availability } from "@/content/profile";
import { site } from "@/content/site";

/** 008 / 008: mirrors the hero, portrait and all, perfectly still (brief §5.8). */
export function ContactSection() {
  const github = site.socials.find((social) => social.label === "GitHub");
  return (
    <section
      id="contact"
      aria-labelledby="contact-eyebrow contact-title"
      data-section="contact"
      className="relative min-h-svh overflow-hidden"
    >
      <div className="container-site grid-site min-h-svh content-center gap-y-10 py-32">
        <div
          className="col-span-12 flex justify-center md:col-span-5 md:col-start-8 md:row-start-1 md:justify-end"
          data-contact-portrait
        >
          <Portrait
            decorative
            sizes="(min-width: 768px) 34vw, 60vw"
            className="w-[60vw] max-w-xs md:w-full md:max-w-[min(100%,calc((100svh-16rem)*0.749))]"
          />
        </div>
        <div className="relative col-span-12 md:col-span-7 md:col-start-1 md:row-start-1">
          <Eyebrow id="contact-eyebrow">A circle, returned</Eyebrow>
          <DisplayHeading
            reveal
            id="contact-title"
            size="display"
            roman="Built"
            italic="to last"
            className="mt-6"
          />
          <p className="mt-8 max-w-xl text-lead text-fg-muted">
            Have a backend to build or a model to ship? Let’s talk.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href="/contact" icon="arrow">
              Start a conversation
            </Button>
            {github && (
              <Button variant="link" href={github.href} icon="external">
                GitHub
              </Button>
            )}
          </div>
          <p className="mt-8">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-tap items-center text-lead underline decoration-line-strong underline-offset-8 transition-colors duration-(--dur-ui) hocus:decoration-fg"
            >
              {site.email}
            </a>
          </p>
          <p className="mt-10 type-label text-fg-muted">{availability}</p>
        </div>
      </div>
      <SectionCounter
        index={8}
        className="absolute right-(--gutter) bottom-8"
      />
    </section>
  );
}
