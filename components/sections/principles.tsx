import { manifesto, values } from "@/content/profile";

/** How Sam works: the manifesto, then three working values. */
export function PrinciplesSection() {
  return (
    <section
      id="principles"
      aria-labelledby="principles-title"
      className="border-y border-line bg-surface"
    >
      <div className="container-site grid-site gap-y-10 py-24 md:py-32">
        <h2 id="principles-title" className="col-span-12 type-h2 md:col-span-4">
          How I work
        </h2>
        <div className="col-span-12 md:col-span-8">
          <p className="max-w-[34em] text-manifesto font-medium text-ink [font-stretch:104%]">
            {manifesto}
          </p>
          <dl className="mt-14 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {values.map((value) => (
              <div key={value.title} className="border-t-2 border-sky pt-5">
                <dt className="text-h4 font-semibold [font-stretch:104%]">
                  {value.title}
                </dt>
                <dd className="mt-2 text-small text-ink-2">{value.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
