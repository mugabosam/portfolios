import { type ReactNode, ViewTransition } from "react";

/**
 * Page transitions. The root template remounts on every top-level
 * navigation, so the old page leaves ("page" exit) and the new one arrives
 * ("page" enter) through the browser's View Transitions API; the header
 * stays put (see ::view-transition rules in globals.css). Browsers without
 * the API, and visitors who prefer reduced motion, get an instant swap.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      {children}
    </ViewTransition>
  );
}
