import type { ReactNode } from "react";

/**
 * Layout for the short pages that report a state: 404, errors, and the
 * contact form's no-JavaScript landing pages. The status reads like an HTTP
 * response line, which is what it is.
 */
export function StatusPage({
  id,
  code,
  status,
  title,
  children,
  actions,
}: {
  id: string;
  /** HTTP-style status code, e.g. 404. */
  code: number;
  status: string;
  title: string;
  children: ReactNode;
  actions: ReactNode;
}) {
  const ok = code < 400;
  return (
    <section
      aria-labelledby={id}
      className="container-site flex min-h-[80svh] flex-col justify-center pt-(--header-h) pb-20"
    >
      <p className="inline-flex w-fit items-center gap-2 rounded-sm bg-accent-ink px-2.5 py-1 font-mono text-small text-white">
        <span className={ok ? "text-white" : "text-accent-tint"}>{code}</span>
        {status}
      </p>
      <h1 id={id} className="mt-6 max-w-3xl type-h1">
        {title}
      </h1>
      <div className="mt-6 max-w-(--measure) text-lead text-ink-2">
        {children}
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-3">{actions}</div>
    </section>
  );
}
