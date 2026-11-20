"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  useId,
  useRef,
  useState,
} from "react";

import type { Endpoint } from "@/content/api";
import { cn } from "@/lib/cn";

type Token = { kind: "key" | "string" | "punct"; text: string };
type Line = { indent: number; tokens: Token[] };

/** Arrays stay on one line while the whole line fits the card. */
const INLINE_LIMIT = 48;

const str = (value: string): Token => ({
  kind: "string",
  text: JSON.stringify(value),
});
const punct = (text: string): Token => ({ kind: "punct", text });

/** Pretty-prints a flat JSON object into coloured lines. */
function toLines(body: Endpoint["body"]): Line[] {
  const entries = Object.entries(body);
  const lines: Line[] = [{ indent: 0, tokens: [punct("{")] }];
  entries.forEach(([key, value], index) => {
    const comma = index < entries.length - 1 ? [punct(",")] : [];
    const keyTokens = [
      { kind: "key", text: JSON.stringify(key) } as Token,
      punct(": "),
    ];
    if (typeof value === "string") {
      lines.push({ indent: 1, tokens: [...keyTokens, str(value), ...comma] });
      return;
    }
    const inline = `${JSON.stringify(key)}: ${JSON.stringify(value).replaceAll(",", ", ")}`;
    if (inline.length <= INLINE_LIMIT) {
      const items = value.flatMap((item, i) =>
        i === 0 ? [str(item)] : [punct(", "), str(item)],
      );
      lines.push({
        indent: 1,
        tokens: [...keyTokens, punct("["), ...items, punct("]"), ...comma],
      });
      return;
    }
    lines.push({ indent: 1, tokens: [...keyTokens, punct("[")] });
    value.forEach((item, i) => {
      lines.push({
        indent: 2,
        tokens: [str(item), ...(i < value.length - 1 ? [punct(",")] : [])],
      });
    });
    lines.push({ indent: 1, tokens: [punct("]"), ...comma] });
  });
  lines.push({ indent: 0, tokens: [punct("}")] });
  return lines;
}

const tokenClass: Record<Token["kind"], string> = {
  key: "text-code-key",
  string: "text-code-string",
  punct: "text-code-muted",
};

/**
 * The hero's response card. It renders the same JSON the real /api/sam
 * endpoints return. On load the status and body arrive in sequence (CSS,
 * so it runs without JavaScript too); the tabs switch endpoints.
 */
export function ApiCard({
  endpoints,
  className,
}: {
  endpoints: readonly Endpoint[];
  className?: string;
}) {
  const id = useId();
  const [active, setActive] = useState(0);
  const [swapped, setSwapped] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const endpoint = endpoints[active]!;
  const lines = toLines(endpoint.body);
  const maxLines = Math.max(...endpoints.map((e) => toLines(e.body).length));

  const select = (index: number) => {
    if (index === active) return;
    setActive(index);
    setSwapped(true);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = endpoints.length - 1;
    const next =
      event.key === "ArrowRight"
        ? active === last
          ? 0
          : active + 1
        : event.key === "ArrowLeft"
          ? active === 0
            ? last
            : active - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };

  return (
    <div
      className={cn(
        "overflow-hidden code-panel shadow-float ring-1 ring-white/5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-code-line pr-4 pl-1.5">
        <div
          role="tablist"
          aria-label="Endpoints"
          className="api-tabs flex items-center"
        >
          {endpoints.map((item, index) => {
            const selected = index === active;
            return (
              <button
                key={item.path}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${index}`}
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(index)}
                onKeyDown={onKeyDown}
                className={cn(
                  "relative inline-flex min-h-tap items-center px-2.5 font-mono text-caption transition-colors duration-(--dur-ui)",
                  selected
                    ? "text-white"
                    : "text-code-muted hocus:text-code-fg",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-2.5 -bottom-px h-0.5 rounded-full bg-sun transition-transform duration-(--dur-move) ease-(--ease-out)",
                    selected ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            );
          })}
        </div>{" "}
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        tabIndex={0}
        className="px-4 pt-4 pb-4 font-mono text-[0.72rem] leading-[1.75] focus-visible:outline-offset-[-4px] sm:px-5 sm:text-[0.78rem]"
      >
        <p className="flex items-center gap-3">
          <span className="rounded-sm bg-sky-bright/15 px-1.5 font-semibold text-code-key">
            GET
          </span>
          <span className="text-white">{endpoint.path}</span>
        </p>
        <div
          key={endpoint.path}
          className="api-response"
          data-swap={swapped || undefined}
        >
          <p className="api-status mt-3 flex items-center gap-3 font-sans text-caption">
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-code-number/15 px-1.5 py-px font-mono font-semibold text-code-number">
              200 OK
            </span>
            <span className="text-code-muted">application/json</span>
          </p>
          <pre
            className="mt-3 overflow-x-auto [contain:inline-size]"
            style={{ minHeight: `${maxLines * 1.75}em` }}
          >
            <code>
              {lines.map((line, index) => (
                <span
                  key={index}
                  className="api-line block whitespace-pre"
                  style={{ "--line": index } as CSSProperties}
                >
                  {"  ".repeat(line.indent)}
                  {line.tokens.map((token, t) => (
                    <span key={t} className={tokenClass[token.kind]}>
                      {token.text}
                    </span>
                  ))}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>

      <p className="flex flex-wrap items-center justify-between gap-x-4 border-t border-code-line px-5 font-sans text-caption text-code-muted">
        <span>A real endpoint on this site.</span>
        <a
          href={endpoint.path}
          className="inline-flex min-h-tap items-center rounded-sm font-mono text-code-key underline decoration-code-key/40 underline-offset-4 hocus:decoration-code-key"
        >
          Open {endpoint.path}
        </a>
      </p>
    </div>
  );
}
