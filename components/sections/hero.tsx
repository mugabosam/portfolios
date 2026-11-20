import { Button } from "@/components/ui/button";
import { Portrait } from "@/components/ui/portrait";
import { endpoints } from "@/content/api";
import { availability } from "@/content/profile";
import { site } from "@/content/site";

import { ApiCard } from "./api-card";

/**
 * Who Sam is, in words and as a response from his own endpoint. The portrait
 * sits on the right with the API card overlapping it; on phones the card
 * tucks under the portrait.
 */
export function HeroSection() {
  const github = site.socials.find((social) => social.label === "GitHub");
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate overflow-x-clip"
    >
      {/* A quiet sky wash behind the portrait column. */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 bottom-10 -z-10 hidden w-[38%] rounded-bl-[3rem] bg-sky-tint md:block"
      />

      <div className="container-site grid-site items-center gap-y-14 pt-[calc(var(--header-h)+3rem)] pb-16 md:pt-[calc(var(--header-h)+4.5rem)] md:pb-28">
        <div className="col-span-12 md:col-span-7 lg:col-span-6">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1 pr-3.5 pl-3 text-caption font-medium text-ink-2">
            <span className="live-dot" aria-hidden="true" />
            {availability.status}
          </p>

          <h1 id="hero-title" className="mt-7 type-display">
            I build the APIs and data behind useful software.
          </h1>

          <p className="mt-7 max-w-xl text-lead text-ink-2">
            I’m Sam Mugabo, a backend developer in Kigali working in Python and
            TypeScript. I design APIs and data models, build the interfaces on
            top of them, and I’m currently a software development intern at
            EUCL.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button variant="primary" href="#work">
              See selected work
            </Button>
            <Button href="/resume.pdf" download icon="download">
              Download CV
            </Button>
            {github && (
              <Button
                variant="link"
                href={github.href}
                icon="github"
                className="ml-2 no-underline"
              >
                github.com/mugabosam
              </Button>
            )}
          </div>
        </div>

        <div className="relative col-span-12 mx-auto w-full max-w-sm sm:max-w-md md:col-span-5 md:col-start-8 md:max-w-none lg:col-span-5 lg:col-start-8">
          <div className="overflow-hidden rounded-xl border border-line bg-surface md:ml-auto md:w-[86%]">
            <Portrait
              preload
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 420px, (min-width: 768px) 38vw, 90vw"
              className="w-full"
            />
          </div>
          <ApiCard
            endpoints={endpoints}
            className="relative -mt-20 w-full sm:ml-auto sm:w-[88%] md:absolute md:-bottom-12 md:-left-[8%] md:mt-0 md:ml-0 md:w-[min(24rem,100%)] lg:-left-[14%]"
          />
        </div>
      </div>
    </section>
  );
}
