import type { Metadata } from "next";
import type { ReactNode } from "react";

import {
  Button,
  type ButtonVariant,
  type ForcedState,
} from "@/components/ui/button";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ProjectCard } from "@/components/ui/project-card";
import { SectionCounter } from "@/components/ui/section-counter";
import { SpecCard } from "@/components/ui/spec-card";
import { Tag } from "@/components/ui/tag";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { cn } from "@/lib/cn";

import { PreloaderDemo } from "./preloader-demo";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const colors = [
  { token: "--bg", value: "#000000", swatch: "bg-bg" },
  { token: "--bg-elevated", value: "#0B0B0B", swatch: "bg-bg-elevated" },
  { token: "--surface-light", value: "#F4F3F0", swatch: "bg-surface-light" },
  { token: "--fg", value: "#FFFFFF", swatch: "bg-fg" },
  { token: "--fg-muted", value: "#B5B5B5", swatch: "bg-fg-muted" },
  { token: "--fg-subtle", value: "#8C8C8C", swatch: "bg-fg-subtle" },
  { token: "--line", value: "white 16%", swatch: "bg-line" },
  { token: "--line-strong", value: "white 60%", swatch: "bg-line-strong" },
] as const;

const typeScale = [
  {
    name: "Display",
    spec: "clamp(4rem, 12vw, 11rem) · 0.9",
    sample: "Built",
    className: "type-display",
  },
  {
    name: "Display italic",
    spec: "same size · italic",
    sample: "to last",
    className: "font-display text-display italic",
  },
  {
    name: "H2",
    spec: "clamp(2.5rem, 6vw, 5.5rem) · 0.95",
    sample: "Every side",
    className: "type-h2",
  },
  {
    name: "H3",
    spec: "clamp(1.75rem, 3.2vw, 3rem) · 1.05",
    sample: "MalariaCheck",
    className: "font-display text-h3",
  },
  {
    name: "Manifesto",
    spec: "clamp(1.5rem, 2.6vw, 2.5rem) · 1.25",
    sample: "Software is never only software.",
    className: "font-display text-manifesto",
  },
  {
    name: "H4",
    spec: "clamp(1.375rem, 1.8vw, 1.75rem) · 1.15",
    sample: "Software Development Intern",
    className: "font-display text-h4",
  },
  {
    name: "Lead",
    spec: "clamp(1.125rem, 1.4vw, 1.375rem) · 1.5",
    sample:
      "Backend systems and machine-learning tools, engineered with patience.",
    className: "text-lead",
  },
  {
    name: "Body",
    spec: "1.0625rem · 1.6",
    sample:
      "Each release should leave a system a little more honest than I found it.",
    className: "text-body",
  },
  {
    name: "Small",
    spec: "0.875rem · 1.5",
    sample: "Kigali, Rwanda · UTC+2",
    className: "text-small",
  },
  {
    name: "Label",
    spec: "0.75rem · tracking 0.2em · 500",
    sample: "The philosophy",
    className: "type-label",
  },
  {
    name: "Mono",
    spec: "JetBrains Mono · 0.875rem",
    sample: "def predict(symptoms): ...",
    className: "font-mono text-small",
  },
] as const;

const spacing = [
  { px: 4, className: "w-1" },
  { px: 8, className: "w-2" },
  { px: 12, className: "w-3" },
  { px: 16, className: "w-4" },
  { px: 24, className: "w-6" },
  { px: 32, className: "w-8" },
  { px: 48, className: "w-12" },
  { px: 64, className: "w-16" },
  { px: 96, className: "w-24" },
  { px: 128, className: "w-32" },
  { px: 192, className: "w-48" },
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
  icon?: "arrow" | "download";
}[] = [
  { variant: "ghost", label: "View selected work", icon: "arrow" },
  { variant: "solid", label: "Read case study", icon: "arrow" },
  { variant: "link", label: "Get in touch" },
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
    <section aria-labelledby={id} className="border-t border-line py-16">
      <h2 id={id} className="type-label text-fg">
        {title}
      </h2>
      {note && (
        <p className="mt-2 max-w-(--measure) text-small text-fg-muted">
          {note}
        </p>
      )}
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="mb-3 type-label text-fg-muted">{children}</p>;
}

function ButtonMatrix() {
  return (
    <div className="flex flex-col gap-10">
      {buttonVariants.map(({ variant, label, icon }) => (
        <div key={variant}>
          <Caption>{variant}</Caption>
          <div className="flex flex-wrap items-end gap-x-8 gap-y-6">
            {states.map((state) => (
              <div
                key={state.label}
                className="flex flex-col items-start gap-2"
              >
                <span className="text-small text-fg-muted">{state.label}</span>
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
  );
}

export default function StyleguidePage() {
  return (
    <div className="container-site pt-(--header-h) pb-24">
      <header className="py-16">
        <Eyebrow>Internal · Not indexed</Eyebrow>
        <h1 className="mt-6 type-h2">Styleguide</h1>
        <p className="mt-6 max-w-(--measure) text-fg-muted">
          Every token and UI primitive, in every state. Hover, focus and active
          are forced with a data attribute so they can be checked without a
          mouse. The header, mobile menu, footer and skip link are live on this
          page.
        </p>
      </header>

      <Block
        id="sg-colour"
        title="Colour"
        note="Contrast for every text pair is recorded in docs/contrast.md."
      >
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {colors.map((color) => (
            <li key={color.token}>
              <div className={cn("h-24 border border-line", color.swatch)} />
              <p className="mt-3 font-mono text-small">{color.token}</p>
              <p className="text-small text-fg-muted">{color.value}</p>
            </li>
          ))}
        </ul>
      </Block>

      <Block
        id="sg-type"
        title="Type scale"
        note="Instrument Serif for display, Inter for text and labels, JetBrains Mono for code."
      >
        <ul className="flex flex-col">
          {typeScale.map((item) => (
            <li
              key={item.name}
              className="grid gap-4 border-t border-line py-6 first:border-t-0 md:grid-cols-12"
            >
              <div className="md:col-span-3">
                <p className="type-label text-fg">{item.name}</p>
                <p className="mt-1 font-mono text-small text-fg-muted">
                  {item.spec}
                </p>
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
        id="sg-spacing"
        title="Spacing scale"
        note="4 to 192px. These are the only steps used for margins, padding and gaps."
      >
        <ul className="flex flex-col gap-3">
          {spacing.map((step) => (
            <li key={step.px} className="flex items-center gap-6">
              <span className="w-12 font-mono text-small text-fg-muted tabular-nums">
                {step.px}
              </span>
              <span className={cn("h-3 bg-fg", step.className)} />
            </li>
          ))}
        </ul>
      </Block>

      <Block
        id="sg-button"
        title="Button"
        note="ghost is the default call to action; solid appears once per page at most; link is for secondary actions."
      >
        <ButtonMatrix />
        <div className="mt-12 surface-light p-8">
          <Caption>On the light surface</Caption>
          <ButtonMatrix />
        </div>
      </Block>

      <Block id="sg-labels" title="Eyebrow and section counter">
        <div className="flex flex-wrap items-baseline justify-between gap-8">
          <Eyebrow>The philosophy</Eyebrow>
          <Eyebrow>Featured · AI / ML</Eyebrow>
          <SectionCounter index={4} />
        </div>
      </Block>

      <Block
        id="sg-heading"
        title="Display heading"
        note="Uppercase roman lines followed by an italic line, at display or H2 size."
      >
        <div className="flex flex-col gap-16">
          <DisplayHeading
            as="h3"
            size="display"
            roman="Built"
            italic="to last"
          />
          <DisplayHeading
            as="h3"
            roman={["Seen from", "every side"]}
            italic="where the logic lives"
          />
          <DisplayHeading
            as="h3"
            roman="Let’s make it"
            italic="your next build"
            align="end"
          />
        </div>
      </Block>

      <Block id="sg-spec" title="Spec card">
        <SpecCard
          label="The core"
          title="Python & TypeScript"
          items={[
            "Django",
            "NestJS",
            "REST APIs",
            "PostgreSQL",
            "Prisma",
            "scikit-learn",
          ]}
        />
      </Block>

      <Block
        id="sg-tag"
        title="Tag"
        note="Static chips list a stack; linked chips filter the work index."
      >
        <div className="flex flex-col gap-8">
          <div>
            <Caption>Static</Caption>
            <ul className="flex flex-wrap gap-2" aria-label="Example stack">
              {["Python", "Django", "PostgreSQL", "Docker"].map((item) => (
                <li key={item}>
                  <Tag>{item}</Tag>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Caption>Linked: default, hover, focus</Caption>
            <div className="flex flex-wrap gap-4">
              <Tag href="/work">Python</Tag>
              <Tag href="/work" forceState="hover">
                TypeScript
              </Tag>
              <Tag href="/work" forceState="focus">
                Flutter
              </Tag>
            </div>
          </div>
        </div>
      </Block>

      <Block
        id="sg-project"
        title="Project card"
        note="Default, hover and focus. The whole row is one link; the focus ring wraps the row."
      >
        <ProjectCard
          index={1}
          title="MalariaCheck"
          href="/work/malaria-check"
          summary="A symptom-based malaria risk screener trained on 1,622 lab-confirmed hospital records, with safety rules that always send a feverish patient for a blood test."
          year="2026"
          category={["AI / ML"]}
          stack={["Python", "scikit-learn", "pandas", "Streamlit"]}
        />
        <ProjectCard
          index={2}
          title="Zunga"
          href="/work/zunga"
          summary="A USSD shortcut layer for mobile money in Rwanda. It fills in the carrier’s own session so you only type your PIN, and it never touches money."
          year="2026"
          category={["Mobile"]}
          stack={["Flutter", "Dart", "Kotlin"]}
          forceState="hover"
        />
        <ProjectCard
          index={3}
          title="BlueSnap"
          href="/work/bluesnap"
          summary="Offline peer-to-peer messaging over Bluetooth and Wi-Fi, end-to-end encrypted, with messages that wait and deliver when a friend comes back into range."
          year="2026"
          category={["Mobile"]}
          stack={["Flutter", "Riverpod", "Hive"]}
          forceState="focus"
        />
      </Block>

      <Block
        id="sg-timeline"
        title="Timeline"
        note="Filled dots mark entries already reached; unfilled ones are still ahead."
      >
        <Timeline>
          <TimelineItem
            period="Sep 2026 – Present"
            title="Software Development Intern"
            org="EUCL, Kigali"
            filled
          >
            Backend and frontend work on an internal inventory and device
            management system.
          </TimelineItem>
          <TimelineItem
            period="Jun 2023 – Present"
            title="Information Technology"
            org="University of Rwanda, College of Science and Technology"
          />
        </Timeline>
      </Block>

      <Block
        id="sg-preloader"
        title="Preloader"
        note="Counts 0 to 100, then fades; 1.5 seconds at most, works without JavaScript and is skipped entirely under reduced motion."
      >
        <PreloaderDemo />
      </Block>
    </div>
  );
}
