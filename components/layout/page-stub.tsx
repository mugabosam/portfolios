/**
 * Temporary page body for routes whose real content lands in a later phase
 * (Work: Phase 3; About, Resume, Contact: Phase 7). Delete when replaced.
 */
export function PageStub({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string;
  title: string;
  note: string;
}) {
  return (
    <section
      aria-labelledby="page-title"
      className="container-site flex min-h-[70svh] flex-col justify-end pt-(--header-h) pb-24"
    >
      <p className="type-label text-fg-muted">{eyebrow}</p>
      <h1 id="page-title" className="mt-6 type-h2">
        {title}
      </h1>
      <p className="mt-6 max-w-(--measure) text-fg-muted">{note}</p>
    </section>
  );
}
