/** First focusable element on every page (WCAG 2.4.1). */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-[100] text-small font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:inline-flex focus:min-h-tap focus:items-center focus:rounded-md focus:bg-ink focus:px-5 focus:text-white"
    >
      Skip to content
    </a>
  );
}
