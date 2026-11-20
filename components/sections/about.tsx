import { Portrait } from "@/components/ui/portrait";
import { site } from "@/content/site";

/** What Sam does, in words a recruiter can use without a glossary. */
const SERVICES = [
  {
    title: "Websites and web apps",
    text: "Fast, accessible sites and dashboards that work on any screen.",
    tools: "React, Next.js, TypeScript",
    tone: "bg-sky",
  },
  {
    title: "Mobile apps",
    text: "Android apps that keep working with poor signal and speak the user's language.",
    tools: "Flutter, Dart",
    tone: "bg-sun",
  },
  {
    title: "Servers and data",
    text: "The systems, databases and security behind an app, and small machine-learning models.",
    tools: "NestJS, Django, PostgreSQL, Python",
    tone: "bg-leaf",
  },
] as const;

const FACTS = [
  { term: "Based in", value: `${site.location} (UTC+2), open to remote` },
  {
    term: "Studying",
    value: "Information Technology, University of Rwanda (2027)",
  },
  { term: "Now", value: "Software team at EUCL, Rwanda's electricity utility" },
  { term: "Speaks", value: "Kinyarwanda and English" },
] as const;

/** Who Sam is, what he does and the essentials: a white sheet on the blue page. */
export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      data-tone="blue"
      className="bg-canvas pb-4 md:pb-6"
    >
      <div className="container-site">
        <div className="grid-site gap-y-12 rounded-[2rem] bg-paper px-6 py-16 sm:px-10 md:py-24 lg:px-16">
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <figure className="about-portrait relative mx-auto max-w-xs md:sticky md:top-[calc(var(--header-h)+2rem)] md:max-w-none">
              <div
                aria-hidden="true"
                className="absolute -top-6 -right-6 size-32 rounded-full bg-sun"
              />
              <div className="relative overflow-hidden rounded-[1.75rem] bg-surface">
                <Portrait
                  variant="full"
                  sizes="(min-width: 1024px) 380px, (min-width: 768px) 40vw, 80vw"
                  className="w-full"
                />
              </div>
            </figure>
          </div>

          <div className="col-span-12 md:col-span-7 md:col-start-6 lg:col-start-6">
            <h2
              id="about-title"
              data-split
              className="text-[clamp(3rem,8vw,7rem)] leading-[0.92] font-[820] tracking-[-0.035em] [font-stretch:80%]"
            >
              About me
            </h2>
            <p
              className="mt-8 max-w-2xl text-[clamp(1.25rem,1.9vw,1.625rem)] leading-snug font-medium text-ink [font-stretch:104%]"
              data-fade
            >
              I’m Sam, a software developer from Kigali. I build web and mobile
              apps end to end: the screens people use and the systems behind
              them.
            </p>
            <p className="mt-5 max-w-2xl text-lead text-ink-2" data-fade>
              I care about software that is safe, simple to use and honest about
              what it does: a health tool that puts safety before its
              predictions, a payment app that never touches the money, a
              messenger that works with no internet.
            </p>

            <ul
              className="mt-12 grid gap-4 sm:grid-cols-3"
              aria-label="What I do"
            >
              {SERVICES.map((service) => (
                <li
                  key={service.title}
                  data-fade
                  className="flex flex-col rounded-[1.25rem] border border-line bg-surface p-5"
                >
                  <span
                    aria-hidden="true"
                    className={`size-2.5 rounded-full ${service.tone}`}
                  />
                  <h3 className="mt-4 text-h4 font-semibold [font-stretch:104%]">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-small text-ink-2">{service.text}</p>
                  <p className="mt-auto pt-4 text-caption text-ink-3">
                    {service.tools}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-10 grid gap-x-8 gap-y-5 border-t border-line pt-8 sm:grid-cols-2">
              {FACTS.map((fact) => (
                <div key={fact.term}>
                  <dt className="text-small font-semibold text-sky">
                    {fact.term}
                  </dt>
                  <dd className="mt-1 text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
