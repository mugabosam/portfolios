import type { Peek } from "@/content/showcase";
import { highlight } from "@/lib/content/highlight";
import { cn } from "@/lib/cn";

import { CodePanel } from "./code-panel";

/**
 * A few real lines from a project's repository, highlighted at build time,
 * or the bare architecture for confidential work. Long lines fade out at
 * the right edge instead of scrolling: the full code is in the case study.
 */
export async function CodePeek({
  peek,
  className,
  bodyClassName,
}: {
  peek: Peek;
  className?: string;
  /** Height limits for the code area. */
  bodyClassName?: string;
}) {
  if (peek.kind === "architecture") {
    return (
      <CodePanel
        title={peek.title}
        meta="Internal software, no code shown"
        className={className}
      >
        <div className={cn("code-peek", bodyClassName)}>
          <pre className="text-code-fg">
            <code>{peek.tree}</code>
          </pre>
        </div>
      </CodePanel>
    );
  }

  const html = await highlight(peek.code, peek.lang);
  return (
    <CodePanel title={peek.file} meta="Excerpt" className={className}>
      <div
        className={cn("code-peek", bodyClassName)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </CodePanel>
  );
}
