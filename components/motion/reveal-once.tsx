"use client";

import { type ReactNode, useEffect, useRef } from "react";

/**
 * Sets `data-seen` on its wrapper the first time it scrolls into view, then
 * stops watching. CSS decides what that does (see .graph-sweep).
 */
export function RevealOnce({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.dataset.seen = "";
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
