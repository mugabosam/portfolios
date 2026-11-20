import Link from "next/link";
import type { CSSProperties } from "react";

import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Portrait } from "@/components/ui/portrait";
import { availability, now, skillGroups } from "@/content/profile";

/** The giant word, one span per letter so the letters can rise in turn. */
const WORD = "Build";

/** A few of the tools behind the work, shown as overlapping badges. */
const STACK = [
  { short: "TS", name: "TypeScript", tone: "bg-white text-ink" },
  { short: "Py", name: "Python", tone: "bg-sun text-ink" },
  { short: "Nx", name: "Next.js", tone: "bg-ink text-white" },
  { short: "Ns", name: "NestJS", tone: "bg-sky-tint text-ink" },
  { short: "Fl", name: "Flutter", tone: "bg-leaf-tint text-ink" },
] as const;

/** Every other skill listed on /about. */
const MORE = skillGroups.flatMap((group) => group.skills).length - STACK.length;

const delay = (index: number) => ({ "--i": index }) as CSSProperties;

/**
 * The opening scene. A sky-blue panel with a rising sun, the giant word
 * BUILD and Sam's cut-out figure, which crosses into a white panel holding
 * what he is open to and what he is building now. On large screens the
 * scene pins while the page scrolls and the sky turns to night (pure CSS
 * scroll-driven animation, see .hero in globals.css); on phones the white
 * panel follows the sky as a normal block.
 */
export function HeroSection() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="hero">
      <div className="hero-stage">
        <div className="hero-sky">
          <div aria-hidden="true" className="hero-sun" data-parallax="0.9">
            <div className="hero-sun-disc" />
          </div>

          <p aria-hidden="true" className="hero-word" data-parallax="-0.45">
            {Array.from(WORD).map((letter, index) => (
              <span
                key={index}
                className="hero-letter-mask"
                style={delay(index)}
              >
                <span className="hero-letter">{letter}</span>
              </span>
            ))}
          </p>

          <div aria-hidden="true" className="hero-night" />

          <div className="hero-figure" data-parallax="0.25">
            <Portrait
              variant="cutout"
              preload
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 420px, 78vw"
              className="hero-figure-img"
            />
          </div>

          <div className="hero-copy container-site">
            <div className="hero-copy-inner">
              <h1 id="hero-title" className="hero-title" style={delay(0)}>
                I build software from the database to the interface.
              </h1>
              <div className="hero-actions" style={delay(1)}>
                <Button
                  variant="primary"
                  href="#work"
                  icon="arrow"
                  data-magnetic
                >
                  View work
                </Button>
                <Button
                  variant="inverse"
                  href="/resume.pdf"
                  download
                  icon="download"
                >
                  Download CV
                </Button>
              </div>
              <div className="hero-stack" style={delay(2)}>
                <ul className="flex" aria-label="Main languages and frameworks">
                  {STACK.map((item) => (
                    <li
                      key={item.short}
                      className={`-ml-2.5 flex size-11 items-center justify-center rounded-full text-caption font-bold ring-[3px] ring-[#0068a0] first:ml-0 ${item.tone}`}
                    >
                      <abbr title={item.name} className="no-underline">
                        {item.short}
                      </abbr>
                    </li>
                  ))}
                  <li className="-ml-2.5 flex size-11 items-center justify-center rounded-full bg-white/15 text-caption font-semibold text-white ring-[3px] ring-[#0068a0] backdrop-blur">
                    <span aria-hidden="true">+{MORE}</span>
                    <span className="sr-only">and {MORE} more</span>
                  </li>
                </ul>
                <p className="max-w-[17rem] text-caption text-white/85">
                  TypeScript, Python and Dart across web, mobile, APIs and data.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel-box">
            <div className="hero-panel-item" style={delay(0)}>
              <p className="flex items-center gap-1.5 text-small font-semibold text-sky">
                Available for
                <ArrowUpRightIcon className="size-3.5" />
              </p>
              <p className="mt-3 type-h3 text-ink">{availability.roles}</p>
              <p className="mt-2 text-small text-ink-2">{availability.where}</p>
            </div>

            <p className="hero-panel-item text-ink-2" style={delay(1)}>
              I’m Sam Mugabo, a software developer in Kigali. React, Next.js and
              Flutter on the front; NestJS, Django and PostgreSQL behind them.
            </p>

            <div
              className="hero-panel-item relative rounded-2xl border border-line bg-paper p-5"
              style={delay(2)}
            >
              <p className="flex items-center gap-2 text-small font-semibold text-ink">
                <span className="live-dot" aria-hidden="true" />
                Now
              </p>
              <p className="mt-2 text-small text-ink-2">{now.text}</p>
              <Link
                href={now.href}
                className="mt-3 inline-flex min-h-tap items-center gap-1.5 rounded-sm text-small font-semibold text-sky underline decoration-sky/35 underline-offset-4 hocus:decoration-sky"
              >
                Read the case study
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
