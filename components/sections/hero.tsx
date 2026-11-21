import type { CSSProperties } from "react";

import { Assistant } from "@/components/assistant/assistant";
import { Button } from "@/components/ui/button";
import { Portrait } from "@/components/ui/portrait";
import { skillGroups } from "@/content/profile";

/** The giant word, one span per letter so the letters can rise in turn. */
const WORD = "Build";

/** A few of the tools behind the work, shown as overlapping badges. */
const STACK = [
  { short: "TS", name: "TypeScript", tone: "bg-white text-ink" },
  { short: "Py", name: "Python", tone: "bg-[#ffc4a3] text-ink" },
  { short: "Nx", name: "Next.js", tone: "bg-ink text-white" },
  { short: "Ns", name: "NestJS", tone: "bg-accent-tint text-ink" },
  { short: "Fl", name: "Flutter", tone: "bg-leaf-tint text-ink" },
] as const;

/** Every other skill listed in the About section. */
const MORE = skillGroups.flatMap((group) => group.skills).length - STACK.length;

const delay = (index: number) => ({ "--i": index }) as CSSProperties;

/**
 * The opening scene. An orange panel with a warm disc rising behind Sam, the giant word
 * BUILD and Sam's cut-out figure, which crosses into a white panel holding
 * the assistant: a chat that answers questions about Sam and hands over the
 * CV or takes a message. On large screens the scene pins while the page
 * scrolls while the copy and panel leave and the sun sets (CSS scroll-driven,
 * see scenes.css);
 * on phones the assistant follows the panel as a normal block.
 */
export function HeroSection() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="hero">
      <div className="hero-stage">
        <div className="hero-sky" data-tone="hero">
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
                I build web and mobile apps, front to back.
              </h1>
              <div className="hero-actions" style={delay(1)}>
                <Button variant="light" href="#work" icon="arrow" data-magnetic>
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
                      className={`-ml-2.5 flex size-11 items-center justify-center rounded-full text-caption font-bold ring-[3px] ring-[#b83400] first:ml-0 ${item.tone}`}
                    >
                      <abbr title={item.name} className="no-underline">
                        {item.short}
                      </abbr>
                    </li>
                  ))}
                  <li className="-ml-2.5 flex size-11 items-center justify-center rounded-full bg-white/15 text-caption font-semibold text-white ring-[3px] ring-[#b83400] backdrop-blur">
                    <span aria-hidden="true">+{MORE}</span>
                    <span className="sr-only">and {MORE} more</span>
                  </li>
                </ul>
                <p className="max-w-[17rem] text-caption text-white/85">
                  Websites, mobile apps, and the servers and data behind them.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-panel" data-tone="light">
          <div className="hero-panel-box">
            <Assistant />
          </div>
        </div>
      </div>
    </section>
  );
}
