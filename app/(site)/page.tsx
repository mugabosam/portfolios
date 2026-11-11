import Link from "next/link";

/**
 * Phase 1 placeholder hero: proves tokens, fonts and layout. The full
 * eight-section home page replaces this in Phase 4.
 */
export default function HomePage() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative container-site flex min-h-svh flex-col justify-center pt-(--header-h) pb-24"
    >
      <p className="type-label text-fg-muted">Portfolio · Vol. 01</p>
      <h1 id="hero-title" className="mt-6">
        <span className="block type-display">Built</span>
        <span className="block font-display text-display italic">to last</span>
      </h1>
      <p className="mt-8 max-w-(--measure) text-lead text-fg-muted">
        Sam Mugabo: software developer building Python backends and
        machine-learning systems that keep working long after launch.
      </p>
      <div className="mt-12 flex flex-wrap items-center gap-6">
        <Link
          href="/work"
          className="inline-flex min-h-tap items-center border border-line-strong px-6 type-label transition-colors duration-(--dur-ui) hover:bg-fg hover:text-bg"
        >
          View selected work
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-h-tap items-center type-label underline decoration-line-strong underline-offset-8 hover:decoration-fg"
        >
          Get in touch
        </Link>
      </div>
      <p
        className="absolute right-(--gutter) bottom-8 type-label text-fg-muted"
        aria-hidden="true"
      >
        001 / 008
      </p>
    </section>
  );
}
