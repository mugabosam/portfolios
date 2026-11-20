import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  Button,
  type ButtonIcon,
  type ButtonVariant,
  type ForcedState,
} from "@/components/ui/button";
import { CodePeek } from "@/components/ui/code-peek";
import { CopyEmail } from "@/components/ui/copy-email";
import { ProjectCard } from "@/components/ui/project-card";
import { Tag } from "@/components/ui/tag";
import { Timeline } from "@/components/ui/timeline";
import { experience } from "@/content/profile";
import { peeks } from "@/content/showcase";
import { site } from "@/content/site";
import { getProjects, toSummary } from "@/lib/content/projects";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const colors = [
  { token: "--paper", value: "#F5F7FA", swatch: "bg-paper", role: "Page" },
  { token: "--surface", value: "#FFFFFF", swatch: "bg-surface", role: "Cards" },
  { token: "--ink", value: "#0B1B2B", swatch: "bg-ink", role: "Text, code" },
  { token: "--ink-2", value: "#435468", swatch: "bg-ink-2", role: "Body" },
  { token: "--ink-3", value: "#5B6B80", swatch: "bg-ink-3", role: "Meta" },
  { token: "--line", value: "#DCE3EB", swatch: "bg-line", role: "Dividers" },
  {
    token: "--line-strong",
    value: "#7C8DA3",
    swatch: "bg-line-strong",
    role: "Control borders",
  },
  { token: "--sky", value: "#0070A8", swatch: "bg-sky", role: "Links" },
  {
    token: "--sky-bright",
    value: "#00A1DE",
    swatch: "bg-sky-bright",
    role: "Graphics",
  },
  { token: "--sun", value: "#FAD201", swatch: "bg-sun", role: "Primary CTA" },
  { token: "--leaf", value: "#1E8E5A", swatch: "bg-leaf", role: "Live status" },
  {
    token: "--code-panel",
    value: "#11263C",
    swatch: "bg-code-panel",
    role: "Code chrome",
  },
] as const;

const typeScale = [
  {
    name: "Display",
    spec: "clamp(2.5rem, 5.6vw, 4.25rem), 720, wdth 112",
    sample: "I build the APIs and data behind useful software.",
    className: "type-display",
  },
  {
    name: "H1",
    spec: "clamp(2.25rem, 4.4vw, 3.375rem), 700, wdth 110",
    sample: "Selected work",
    className: "type-h1",
  },
  {
    name: "H2",
    spec: "clamp(1.875rem, 3.4vw, 2.625rem), 680, wdth 108",
    sample: "Stack, and where it’s used",
    className: "type-h2",
  },
  {
    name: "H3",
    spec: "clamp(1.375rem, 1.9vw, 1.625rem), 640, wdth 104",
    sample: "MalariaCheck",
    className: "type-h3",
  },
  {
    name: "Manifesto",
    spec: "clamp(1.375rem, 2.3vw, 1.875rem), 500",
    sample: "Software is never only software.",
    className: "text-manifesto font-medium",
  },
  {
    name: "Lead",
    spec: "clamp(1.125rem, 1.3vw, 1.3125rem)",
    sample: "Real projects with real code.",
    className: "text-lead text-ink-2",
  },
  {
    name: "Body",
    spec: "1.0625rem, line height 1.65",
    sample:
      "Each release should leave a system a little more honest than I found it.",
    className: "text-body",
  },
  {
    name: "Small",
    spec: "0.875rem",
    sample: "Updated Nov 2026",
    className: "text-small text-ink-2",
  },
  {
    name: "Mono",
    spec: "JetBrains Mono, code only",
    sample: "lib/ussd/config_verifier.dart",
    className: "font-mono text-small",
  },
] as const;

const states: { label: string; force?: ForcedState; disabled?: boolean }[] = [
  { label: "Default" },
  { label: "Hover", force: "hover" },
  { label: "Focus", force: "focus" },
  { label: "Active", force: "active" },
  { label: "Disabled", disabled: true },
];

const buttonVariants: {
  variant: ButtonVariant;
  label: string;
  icon?: ButtonIcon;
  dark?: boolean;
}[] = [
  { variant: "primary", label: "View work", icon: "arrow" },
  { variant: "secondary", label: "Download CV", icon: "download" },
  { variant: "inverse", label: "GitHub", icon: "github", dark: true },
  { variant: "link", label: "Code on GitHub", icon: "external" },
];

function Block({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-14">
      <h2 id={id} className="type-h3">
        {title}
      </h2>
      {note && (
        <p className="mt-2 max-w-(--measure) text-small text-ink-2">{note}</p>
      )}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function StyleguidePage() {
  const projects = getProjects().map(toSummary);
  const card = projects.find((project) => project.slug === "zunga");
  const architecture = peeks["eucl-internship"];

  return (
    <div className="container-site pt-(--header-h) pb-24">
      <header className="py-14">
        <p className="text-small font-semibold text-sky">
          Internal, not indexed
        </p>
        <h1 className="mt-3 type-h1">Styleguide</h1>
        <p className="mt-4 max-w-(--measure) text-ink-2">
          Every token and UI primitive, in every state. Hover, focus and active
          are forced with a data attribute so they can be checked without a
          mouse. The header, mobile menu, footer and skip link are live on this
          page.
        </p>
      </header>

      <Block
        id="sg-colour"
        title="Colour"
        note="Cool paper and navy ink, with the flag’s sky, sun and green used for links, the primary action and live status. Contrast for every pair is in docs/contrast.md."
      >
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {colors.map((color) => (
            <li
              key={color.token}
              className="overflow-hidden rounded-lg border border-line bg-surface"
            >
              <div className={cn("h-20 border-b border-line", color.swatch)} />
              <div className="p-3">
                <p className="font-mono text-caption">{color.token}</p>
                <p className="text-caption text-ink-3">
                  {color.value}, {color.role}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Block>

      <Block
        id="sg-type"
        title="Type scale"
        note="Mona Sans for everything, its width axis widened for headlines; JetBrains Mono only for code."
      >
        <ul className="flex flex-col">
          {typeScale.map((item) => (
            <li
              key={item.name}
              className="grid gap-3 border-t border-line py-6 first:border-t-0 md:grid-cols-12"
            >
              <div className="md:col-span-3">
                <p className="text-small font-semibold">{item.name}</p>
                <p className="mt-1 text-caption text-ink-3">{item.spec}</p>
              </div>
              <p
                className={cn(
                  "min-w-0 break-words md:col-span-9",
                  item.className,
                )}
              >
                {item.sample}
              </p>
            </li>
          ))}
        </ul>
      </Block>

      <Block
        id="sg-buttons"
        title="Buttons"
        note="One primary (sun) action per view. All variants are at least 44px tall."
      >
        <div className="flex flex-col gap-8">
          {buttonVariants.map(({ variant, label, icon, dark }) => (
            <div
              key={variant}
              className={cn(
                "rounded-xl p-5",
                dark ? "bg-ink text-white [--focus:var(--code-key)]" : "",
              )}
            >
              <p
                className={cn(
                  "mb-3 text-small font-semibold",
                  dark && "text-white",
                )}
              >
                {variant}
              </p>
              <div className="flex flex-wrap items-end gap-x-6 gap-y-5">
                {states.map((state) => (
                  <div
                    key={state.label}
                    className="flex flex-col items-start gap-2"
                  >
                    <span
                      className={cn(
                        "text-caption",
                        dark ? "text-code-fg" : "text-ink-3",
                      )}
                    >
                      {state.label}
                    </span>
                    <Button
                      variant={variant}
                      icon={icon}
                      forceState={state.force}
                      disabled={state.disabled}
                    >
                      {label}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block id="sg-tags" title="Tags">
        <div className="flex flex-wrap items-center gap-3">
          <Tag>Python</Tag>
          <Tag href="/work/malaria-check">Linked tag</Tag>
          <Tag href="/work/malaria-check" forceState="hover">
            Hover
          </Tag>
          <Tag href="/work/malaria-check" forceState="focus">
            Focus
          </Tag>
        </div>
      </Block>

      <Block
        id="sg-code"
        title="Code panels"
        note="Real excerpts, highlighted at build time; confidential work shows its architecture only."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {peeks.zunga && <CodePeek peek={peeks.zunga} />}
          {architecture && <CodePeek peek={architecture} />}
        </div>
      </Block>

      {card && (
        <Block
          id="sg-card"
          title="Project card"
          note="Default, hover and focus."
        >
          <ul className="grid gap-5 lg:grid-cols-3">
            {(["default", "hover", "focus"] as const).map((state) => (
              <li key={state} className="flex">
                <ProjectCard
                  project={card}
                  className="w-full"
                  forceState={state === "default" ? undefined : state}
                />
              </li>
            ))}
          </ul>
        </Block>
      )}

      <Block id="sg-copy" title="Copy email">
        <div className="flex flex-wrap items-center gap-6">
          <CopyEmail email={site.email} />
          <div className="rounded-xl bg-ink p-5 [--focus:var(--code-key)]">
            <CopyEmail email={site.email} tone="dark" />
          </div>
        </div>
      </Block>

      <Block id="sg-timeline" title="Timeline">
        <Timeline
          className="max-w-2xl"
          groups={[{ label: "Work", entries: experience }]}
        />
      </Block>
    </div>
  );
}
