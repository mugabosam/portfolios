/** First focusable element on every page (WCAG 2.4.1). */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-[100] type-label focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:inline-flex focus:min-h-tap focus:items-center focus:border focus:border-fg focus:bg-bg focus:px-6 focus:text-fg"
    >
      Skip to content
    </a>
  );
}
