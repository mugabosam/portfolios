"use client";

import {
  type CSSProperties,
  type FormEvent,
  type MouseEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { ArrowUpRightIcon, CheckIcon, CopyIcon } from "@/components/ui/icons";
import { answers, opening } from "@/content/assistant";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/** Opens a project's details sheet (see project-sheet.tsx). */
export const OPEN_PROJECT_EVENT = "portfolio:open-project";

type Action =
  | { kind: "download"; label: string; href: string }
  | { kind: "link"; label: string; href: string }
  | { kind: "project"; label: string; slug: string }
  | { kind: "command"; label: string; command: string }
  | { kind: "copy"; label: string; value: string }
  | { kind: "send"; label: string };

type Message = {
  id: number;
  from: "user" | "bot";
  text: string;
  actions?: Action[];
  /** Ms after mount (or after the intro, for the opening) before it shows. */
  at: number;
  opening?: boolean;
  /** A summary card of the message being written (contact flow). */
  draft?: Draft;
};

type Draft = { name: string; email: string; message: string };
type Step = "name" | "email" | "message" | "confirm" | "sending";

/** How long the "typing" dots show before a reply. */
const TYPING_MS = 650;
/** Delay between streamed words. */
const WORD_MS = 26;

const words = (text: string) => text.split(" ");

/** The opening exchange, timed one message after another. */
function openingMessages(): Message[] {
  let at = 900;
  return opening.map((message, index) => {
    const item: Message = {
      id: index,
      from: message.from,
      text: message.text,
      at: message.from === "bot" ? at + TYPING_MS : at,
      opening: true,
    };
    // Time to read a reply before the next question appears.
    at = item.at + (message.from === "bot" ? 1100 : 500);
    return item;
  });
}

const SUGGESTIONS = [
  { label: "Get the CV", command: "cv", href: "/resume.pdf" },
  { label: "Projects", command: "projects", href: "#work" },
  { label: "Skills", command: "skills", href: "#about" },
  { label: "Contact Sam", command: "contact", href: "#contact" },
] as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Follows a link from code, as if clicked (downloads, mailto). */
function follow(href: string, download = false) {
  const link = document.createElement("a");
  link.href = href;
  if (download) link.download = "";
  document.body.append(link);
  link.click();
  link.remove();
}

function mailtoFor(draft: Draft) {
  const subject = encodeURIComponent(`Portfolio message from ${draft.name}`);
  const body = encodeURIComponent(
    `${draft.message}\n\n${draft.name}\n${draft.email}`,
  );
  return `mailto:${site.email}?subject=${subject}&body=${body}`;
}

/**
 * The hero's assistant: a chat that answers questions about Sam from
 * pre-written facts and does a few things on request, like a small
 * terminal. "cv" downloads the CV, "contact" walks through a message
 * (sent through /api/contact when email delivery is configured, otherwise
 * handed to the visitor's email app), "projects" opens project summaries.
 *
 * The opening exchange is server-rendered and streams in with CSS, so it
 * reads the same without JavaScript; the suggestion buttons are real links
 * underneath (CV download, page sections).
 */
export function Assistant({ canSend }: { canSend: boolean }) {
  const [messages, setMessages] = useState<Message[]>(openingMessages);
  const [step, setStep] = useState<Step | null>(null);
  const [draft, setDraft] = useState<Draft>({
    name: "",
    email: "",
    message: "",
  });
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(opening.length);
  const inputId = useId();

  // Keep the newest message in view, and again once it has streamed in.
  useEffect(() => {
    const log = logRef.current;
    const last = messages.at(-1);
    if (!log || !last || last.opening) return;
    const toBottom = () =>
      log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
    toBottom();
    const streamed =
      last.from === "bot" ? last.at + words(last.text).length * WORD_MS : 0;
    const timer = window.setTimeout(toBottom, streamed + 200);
    return () => window.clearTimeout(timer);
  }, [messages]);

  const say = (
    from: Message["from"],
    text: string,
    extra?: Partial<Message>,
  ) => {
    const id = nextId.current++;
    setMessages((list) => [
      ...list,
      { id, from, text, at: from === "bot" ? TYPING_MS : 0, ...extra },
    ]);
  };
  const reply = (text: string, extra?: Partial<Message>) =>
    say("bot", text, extra);

  const send = async (current: Draft) => {
    if (!canSend) {
      follow(mailtoFor(current));
      reply(answers.contact.mailto, {
        actions: [
          { kind: "link", label: "Open it again", href: mailtoFor(current) },
        ],
      });
      setStep(null);
      return;
    }
    setStep("sending");
    reply(answers.contact.sending);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...current, company: "" }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };
      if (result.ok) reply(answers.contact.sent(current.email));
      else
        reply(answers.contact.failed(result.error ?? "It didn't go through."), {
          actions: [
            {
              kind: "link",
              label: "Open my email app",
              href: mailtoFor(current),
            },
          ],
        });
    } catch {
      reply(answers.contact.failed("The connection failed."), {
        actions: [
          {
            kind: "link",
            label: "Open my email app",
            href: mailtoFor(current),
          },
        ],
      });
    }
    setStep(null);
  };

  /** One step of the contact conversation. */
  const continueContact = (text: string) => {
    if (/^(cancel|stop|quit|exit)$/i.test(text)) {
      setStep(null);
      reply(answers.contact.cancelled);
      return;
    }
    if (step === "name") {
      if (text.length < 2) return reply(answers.contact.nameRetry);
      setDraft((d) => ({ ...d, name: text }));
      setStep("email");
      return reply(answers.contact.askEmail(text.split(" ")[0]!));
    }
    if (step === "email") {
      if (!EMAIL.test(text)) return reply(answers.contact.emailRetry);
      setDraft((d) => ({ ...d, email: text }));
      setStep("message");
      return reply(answers.contact.askMessage);
    }
    if (step === "message") {
      if (text.length < 20) return reply(answers.contact.messageRetry);
      const complete = { ...draft, message: text };
      setDraft(complete);
      setStep("confirm");
      return reply(answers.contact.confirm, {
        draft: complete,
        actions: [
          { kind: "send", label: canSend ? "Send it" : "Open in my email app" },
          { kind: "command", label: "Cancel", command: "cancel" },
        ],
      });
    }
  };

  /** Matches what was typed to an answer, the way a small terminal would. */
  const run = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    say("user", text);

    if (step && step !== "confirm" && step !== "sending")
      return continueContact(text);
    if (step === "confirm") {
      if (/^(send|yes|ok|okay|sure)/i.test(text)) return void send(draft);
      if (/^(cancel|no|stop)/i.test(text)) {
        setStep(null);
        return reply(answers.contact.cancelled);
      }
    }

    const q = text.toLowerCase();
    const tokens = q.split(/[^a-zà-ÿ0-9]+/).filter(Boolean);
    /** "word" matches exactly, "word*" as a prefix, "two words" as a phrase. */
    const has = (...keys: string[]) =>
      keys.some((key) =>
        key.includes(" ")
          ? q.includes(key)
          : key.endsWith("*")
            ? tokens.some((t) => t.startsWith(key.slice(0, -1)))
            : tokens.includes(key),
      );

    if (q === "clear") {
      setMessages([]);
      return;
    }
    if (has("help", "command*", "what can"))
      return reply(answers.help, { actions: helpActions });
    if (has("cv", "resume", "résumé", "curriculum*")) {
      follow("/resume.pdf", true);
      return reply(answers.cv, {
        actions: [
          { kind: "download", label: "Download again", href: "/resume.pdf" },
          { kind: "link", label: "Read it online", href: "/resume" },
        ],
      });
    }
    if (
      has(
        "contact*",
        "message",
        "hire",
        "reach",
        "interview*",
        "get in touch",
        "talk",
      )
    ) {
      setStep("name");
      setDraft({ name: "", email: "", message: "" });
      return reply(answers.contact.start, {
        actions: [{ kind: "command", label: "Cancel", command: "cancel" }],
      });
    }
    if (has("email*", "mail")) {
      return reply(answers.email, {
        actions: [
          { kind: "copy", label: "Copy the address", value: site.email },
          {
            kind: "link",
            label: "Open my email app",
            href: `mailto:${site.email}`,
          },
        ],
      });
    }
    if (
      has(
        "open",
        "available",
        "availability",
        "looking",
        "role",
        "roles",
        "hiring",
        "job",
        "jobs",
      )
    )
      return reply(answers.availability, {
        actions: [
          { kind: "command", label: "Send him a message", command: "contact" },
          { kind: "command", label: "Get the CV", command: "cv" },
        ],
      });
    if (
      has(
        "now",
        "current*",
        "eucl",
        "doing",
        "experience*",
        "working",
        "intern*",
      )
    )
      return reply(answers.now, {
        actions: [
          {
            kind: "project",
            label: "EUCL device system",
            slug: "eucl-internship",
          },
        ],
      });
    if (has("project*", "work", "built", "build", "portfolio", "app", "apps")) {
      return reply(answers.projects, {
        actions: projects.map((project) => ({
          kind: "project" as const,
          label: project.title,
          slug: project.slug,
        })),
      });
    }
    if (has("stud*", "education", "university", "degree", "school", "graduat*"))
      return reply(answers.education);
    if (has("speak*", "kinyarwanda", "english", "french"))
      return reply(answers.spoken);
    if (
      has(
        "skill*",
        "stack",
        "tech*",
        "tool*",
        "language*",
        "framework*",
        "react",
        "python",
        "flutter",
      )
    )
      return reply(answers.skills);
    if (
      has(
        "where",
        "based",
        "location",
        "remote",
        "timezone",
        "country",
        "live",
        "lives",
        "kigali",
        "rwanda",
      )
    )
      return reply(answers.location);
    if (has("github", "code", "repo*"))
      return reply(answers.github, {
        actions: [
          {
            kind: "link",
            label: "github.com/mugabosam",
            href: "https://github.com/mugabosam",
          },
        ],
      });
    if (has("who", "about", "sam", "yourself", "intro*"))
      return reply(answers.about);
    if (
      tokens.some((t) =>
        ["hi", "hello", "hey", "muraho", "bonjour"].includes(t),
      )
    )
      return reply(answers.greeting);
    if (has("thank", "merci", "murakoze")) return reply(answers.thanks);
    reply(answers.fallback, { actions: helpActions });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    run(value);
    setValue("");
    inputRef.current?.focus();
  };

  const onAction = (action: Action) => (event: MouseEvent) => {
    if (action.kind === "command") {
      event.preventDefault();
      run(action.command);
    } else if (action.kind === "project") {
      event.preventDefault();
      window.dispatchEvent(
        new CustomEvent(OPEN_PROJECT_EVENT, { detail: action.slug }),
      );
    } else if (action.kind === "copy") {
      event.preventDefault();
      void navigator.clipboard?.writeText(action.value).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      });
    } else if (action.kind === "send") {
      event.preventDefault();
      if (step === "confirm") void send(draft);
    }
    // download and link: the browser follows the real link.
  };

  const onSuggestion =
    (command: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      // Underneath it is a real link (CV download, page section) for when
      // JavaScript is off; here the assistant handles it instead.
      event.preventDefault();
      run(command);
    };

  const placeholder =
    step === "name"
      ? "Your name"
      : step === "email"
        ? "you@company.com"
        : step === "message"
          ? "Your message to Sam"
          : "Ask about Sam, or type cv";

  return (
    <div className="assistant flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-3 border-b border-line pb-4">
        <span
          aria-hidden="true"
          className="assistant-avatar flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-deep text-sun"
        >
          <SparkIcon className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-body leading-tight font-semibold text-ink">
            Ask about Sam
          </h2>
          <p className="text-caption text-ink-3">
            Answers written by Sam. Try “cv” or “contact”.
          </p>
        </div>
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        data-lenis-prevent
        className="assistant-log -mx-1 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-1 py-4"
      >
        {messages.map((message) => (
          <Bubble
            key={message.id}
            message={message}
            onAction={onAction}
            copied={copied}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-4">
        <ul className="flex flex-wrap gap-2" aria-label="Suggestions">
          {(step && step !== "confirm"
            ? [{ label: "Cancel", command: "cancel", href: "#contact" }]
            : SUGGESTIONS
          ).map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                download={item.command === "cv" ? "" : undefined}
                onClick={onSuggestion(item.command)}
                className="inline-flex min-h-9 items-center rounded-full border border-line-strong/60 bg-surface px-3.5 text-small font-medium text-ink-2 transition-colors duration-(--dur-ui) hocus:border-sky hocus:text-sky"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <form
          onSubmit={onSubmit}
          // The assistant checks the email itself and says what is wrong.
          noValidate
          className="assistant-form flex items-center gap-2"
        >
          <label htmlFor={inputId} className="sr-only">
            {step ? placeholder : "Ask about Sam"}
          </label>
          <div className="flex min-h-12 flex-1 items-center gap-2 rounded-full border border-line-strong/70 bg-paper pr-1.5 pl-4 focus-within:border-sky">
            <span
              aria-hidden="true"
              className="font-mono text-small font-semibold text-sky"
            >
              &gt;
            </span>
            <input
              ref={inputRef}
              id={inputId}
              type={step === "email" ? "email" : "text"}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={placeholder}
              autoComplete={
                step === "name" ? "name" : step === "email" ? "email" : "off"
              }
              maxLength={step === "message" ? 4000 : 200}
              disabled={step === "sending"}
              className="min-w-0 flex-1 bg-transparent py-2 text-small text-ink outline-none placeholder:text-ink-3"
            />
            <button
              type="submit"
              disabled={!value.trim() || step === "sending"}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-deep text-white transition-opacity duration-(--dur-ui) disabled:opacity-35"
            >
              <ArrowUpRightIcon className="size-4 -rotate-45" />
              <span className="sr-only">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const helpActions: Action[] = [
  { kind: "command", label: "cv", command: "cv" },
  { kind: "command", label: "projects", command: "projects" },
  { kind: "command", label: "skills", command: "skills" },
  { kind: "command", label: "experience", command: "experience" },
  { kind: "command", label: "contact", command: "contact" },
];

function Bubble({
  message,
  onAction,
  copied,
}: {
  message: Message;
  onAction: (action: Action) => (event: MouseEvent) => void;
  copied: boolean;
}) {
  const at = message.opening
    ? `calc(var(--intro, 0s) + ${message.at}ms)`
    : `${message.at}ms`;
  const style = { "--at": at } as CSSProperties;

  if (message.from === "user")
    return (
      <div className="msg msg-user self-end" style={style}>
        <p className="max-w-[16rem] rounded-2xl rounded-br-md bg-sky-deep px-4 py-2.5 text-small text-white">
          {message.text}
        </p>
      </div>
    );

  return (
    <div className="msg msg-bot relative flex gap-2.5" style={style}>
      <span
        aria-hidden="true"
        className="msg-avatar mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-sky-tint text-sky"
      >
        <SparkIcon className="size-3.5" />
      </span>
      <span aria-hidden="true" className="msg-dots">
        <span />
        <span />
        <span />
      </span>
      <div className="msg-body min-w-0 flex-1">
        <p className="rounded-2xl rounded-tl-md bg-paper px-4 py-2.5 text-small text-ink">
          {/* Replies stream in word by word; the opening exchange arrives a
              message at a time, which costs far less while the page loads. */}
          {message.opening
            ? message.text
            : words(message.text).map((word, index) => (
                <span
                  key={index}
                  className="msg-word"
                  style={{ "--w": index } as CSSProperties}
                >
                  {word}{" "}
                </span>
              ))}
        </p>
        {message.draft && (
          <dl className="mt-2 grid gap-1 rounded-2xl border border-line bg-surface p-4 text-small">
            <dt className="text-caption text-ink-3">From</dt>
            <dd className="text-ink">
              {message.draft.name}, {message.draft.email}
            </dd>
            <dt className="mt-1 text-caption text-ink-3">Message</dt>
            <dd className="whitespace-pre-line text-ink-2">
              {message.draft.message}
            </dd>
          </dl>
        )}
        {message.actions && message.actions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.actions.map((action) => {
              const className = cn(
                "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-caption font-semibold transition-colors duration-(--dur-ui)",
                action.kind === "send"
                  ? "bg-sun text-ink hocus:bg-sun-deep"
                  : "border border-sky/30 bg-sky-tint text-sky hocus:border-sky",
              );
              if (action.kind === "download" || action.kind === "link")
                return (
                  <a
                    key={action.label}
                    href={action.href}
                    download={action.kind === "download" ? "" : undefined}
                    className={className}
                  >
                    {action.label}
                  </a>
                );
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={onAction(action)}
                  className={className}
                >
                  {action.kind === "copy" &&
                    (copied ? (
                      <CheckIcon className="size-3.5" />
                    ) : (
                      <CopyIcon className="size-3.5" />
                    ))}
                  {action.kind === "copy" && copied ? "Copied" : action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SparkIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
      focusable={false}
      {...props}
    >
      <path d="M8 0.8c.35 3.2 1.4 4.9 4 5.9-2.6 1-3.65 2.7-4 6.5-.35-3.8-1.4-5.5-4-6.5 2.6-1 3.65-2.7 4-5.9Z" />
      <path d="M13 9.6c.15 1.3.6 2 1.7 2.4-1.1.4-1.55 1.1-1.7 2.6-.15-1.5-.6-2.2-1.7-2.6 1.1-.4 1.55-1.1 1.7-2.4Z" />
    </svg>
  );
}
