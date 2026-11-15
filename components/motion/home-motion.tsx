"use client";

import { useEffect } from "react";

import { artifact, setArtifactVisible } from "@/lib/motion/artifact-state";
import { getLenis, onLenis } from "@/lib/motion/lenis";

type Layout = Partial<
  Pick<typeof artifact, "x" | "y" | "scale" | "spin" | "inner">
> & { fade: number };

/**
 * Where the 3D Artifact sits while each part of the page is in view. It only
 * appears on desktop, at the orbit stage and behind the experience timeline;
 * everywhere else the canvas is faded out and its render loop stopped.
 */
const LAYOUT: { selector: string; desktop?: Layout; mobile?: Layout }[] = [
  { selector: "#hero", desktop: { fade: 0 }, mobile: { fade: 0 } },
  { selector: "#craft", desktop: { fade: 0 }, mobile: { fade: 0 } },
  { selector: "#featured", desktop: { fade: 0 }, mobile: { fade: 0 } },
  { selector: "#philosophy", desktop: { fade: 0 }, mobile: { fade: 0 } },
  {
    selector: "[data-orbit-stage]",
    desktop: { x: 0, y: 0, scale: 0.7, spin: 0.6, inner: 0, fade: 1 },
  },
  { selector: "#work-index", desktop: { fade: 0 }, mobile: { fade: 0 } },
  {
    selector: "#experience",
    desktop: { x: 0.82, y: -0.6, scale: 0.75, spin: 0.3, inner: 1, fade: 0.22 },
    mobile: { fade: 0 },
  },
  { selector: "#toolkit", desktop: { fade: 0 }, mobile: { fade: 0 } },
  { selector: "#contact", desktop: { fade: 0 }, mobile: { fade: 0 } },
];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Module-level: survives the component being unmounted and remounted. */
let scrollTriggerDisabled = false;

/** Resolves when the browser is idle, or after `timeout` ms at the latest. */
function whenIdle(timeout: number) {
  return new Promise<void>((resolve) => {
    if ("requestIdleCallback" in window)
      window.requestIdleCallback(() => resolve(), { timeout });
    else setTimeout(resolve, Math.min(timeout, 800));
  });
}

/** Resolves on the first scroll, touch, wheel or key press. */
function whenIntent(signal: { cancelled: boolean }) {
  return new Promise<void>((resolve) => {
    const events = [
      "scroll",
      "touchstart",
      "wheel",
      "keydown",
      "pointerdown",
    ] as const;
    const done = () => {
      events.forEach((event) => window.removeEventListener(event, done));
      if (!signal.cancelled) resolve();
    };
    events.forEach((event) =>
      window.addEventListener(event, done, { passive: true, once: true }),
    );
  });
}

/**
 * The home page's scroll choreography (brief §6). GSAP and ScrollTrigger load
 * after the opening paint (on idle on desktop, on first touch or scroll on
 * phones); SplitText (line-by-line reveals) and pinning are desktop only,
 * where the CPU can afford them. Under reduced motion nothing here runs: no pinning,
 * scrubbing or reveals, and the page stays static and fully readable.
 *
 * Order matters: ScrollTriggers are created top to bottom. Anything that
 * moves while a section is pinned lives in that pin's own timeline, and
 * triggers for content below a pin are created after it, so every start and
 * end includes the pinned scroll distance.
 */
export function HomeMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const signal = { cancelled: false };
    let teardown = () => {};
    const desktopQuery = window.matchMedia("(min-width: 48rem)");

    (async () => {
      // Desktop: as soon as the browser is idle. Phones: on the first sign of
      // intent to scroll, so the opening paint carries no animation code and
      // the libraries never compete with it for a slow CPU.
      await (desktopQuery.matches ? whenIdle(2000) : whenIntent(signal));
      if (signal.cancelled) return;
      const [{ gsap }, { ScrollTrigger }, splitModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        desktopQuery.matches ? import("gsap/SplitText") : Promise.resolve(null),
      ]);
      if (signal.cancelled) return;
      const SplitText = splitModule?.SplitText ?? null;
      gsap.registerPlugin(ScrollTrigger);
      if (SplitText) gsap.registerPlugin(SplitText);
      // Re-arm only after a previous visit disabled it on teardown (see below);
      // enable() on an already-enabled ScrollTrigger starts a second idle loop.
      if (scrollTriggerDisabled) {
        ScrollTrigger.enable();
        scrollTriggerDisabled = false;
      }

      // Keep ScrollTrigger in step with Lenis, whenever Lenis arrives.
      const syncLenis = (lenis: ReturnType<typeof getLenis>) =>
        lenis?.on("scroll", ScrollTrigger.update);
      syncLenis(getLenis());
      const stopLenisSync = onLenis(syncLenis);

      const root = document.documentElement;
      let hideTimer: ReturnType<typeof setTimeout> | undefined;
      const setFade = (value: number) => {
        root.style.setProperty("--artifact-opacity", String(value));
        clearTimeout(hideTimer);
        if (value > 0) setArtifactVisible(true);
        // Stop the render loop once the CSS fade-out (700ms) has finished.
        else hideTimer = setTimeout(() => setArtifactVisible(false), 750);
      };

      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 48rem)", mobile: "(max-width: 47.99rem)" },
        (context) => {
          const desktop = Boolean(context.conditions?.desktop);
          const q = (selector: string) =>
            document.querySelector<HTMLElement>(selector);
          const qa = (selector: string) =>
            gsap.utils.toArray<HTMLElement>(selector);
          const once = (trigger: Element) => ({
            trigger,
            start: "top 85%",
            once: true,
          });

          /**
           * Section heading reveal: masked lines on desktop, a soft rise on mobile.
           * Built only when the heading comes within a viewport of the fold, so
           * splitting seven headlines never lands in one long task on load.
           */
          const lazy = new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                lazy.unobserve(entry.target);
                buildReveal(entry.target as HTMLElement);
              }
            },
            { rootMargin: "100% 0px" },
          );
          const reveal = (heading: HTMLElement | null) => {
            if (heading) lazy.observe(heading);
          };
          const buildReveal = (heading: HTMLElement) => {
            if (!SplitText) {
              gsap.from(heading, {
                autoAlpha: 0,
                y: 24,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: once(heading),
              });
              return;
            }
            SplitText.create(heading, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (split) =>
                gsap.from(split.lines, {
                  yPercent: 105,
                  duration: 0.9,
                  stagger: 0.08,
                  ease: "power3.out",
                  scrollTrigger: once(heading),
                }),
            });
          };

          // ── 001 Hero: the copy steps back, the portrait eases closer. Pinned on
          //    desktop; on phones a plain scrub, so no spacer is ever inserted. ──
          gsap
            .timeline({
              scrollTrigger: {
                trigger: "#hero",
                start: "top top",
                end: desktop ? "+=70%" : "+=40%",
                pin: desktop,
                scrub: true,
              },
            })
            .to(
              "[data-hero-copy]",
              { autoAlpha: 0, yPercent: -12, ease: "none", duration: 0.4 },
              0,
            )
            .to(
              "[data-hero-portrait] img",
              { scale: 1.08, yPercent: -4, ease: "none", duration: 1 },
              0,
            );

          // ── 002 Craft: pinned; facets appear in sequence beside the portrait ─
          reveal(q("#craft-title"));
          const facets = qa("[data-facet]");
          const spec = q("[data-spec]");
          if (desktop) {
            const craft = gsap.timeline({
              scrollTrigger: {
                trigger: "#craft",
                start: "top top",
                end: "+=150%",
                pin: true,
                scrub: true,
              },
            });
            facets.forEach((facet, i) =>
              craft.from(facet, { autoAlpha: 0, y: 32, duration: 1 }, i * 1.2),
            );
            if (spec)
              craft.from(
                spec,
                { autoAlpha: 0, y: 24, duration: 1 },
                facets.length * 1.2,
              );
            craft.to(
              "[data-craft-portrait] img",
              {
                yPercent: -6,
                scale: 1.04,
                duration: facets.length * 1.2 + 1,
                ease: "none",
              },
              0,
            );
          } else {
            [...facets, spec].forEach((el) => {
              if (el)
                gsap.from(el, {
                  autoAlpha: 0,
                  y: 24,
                  duration: 0.8,
                  ease: "power3.out",
                  scrollTrigger: once(el),
                });
            });
          }

          // ── 003 Featured: the white card slides in from the right ───────
          reveal(q("#featured-title"));
          gsap.from("[data-featured-card]", {
            xPercent: desktop ? 14 : 0,
            yPercent: desktop ? 0 : 8,
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: {
              trigger: "#featured",
              start: "top 80%",
              end: "top 25%",
              scrub: true,
            },
          });
          gsap.from("[data-featured-render]", {
            yPercent: 6,
            autoAlpha: 0.2,
            ease: "none",
            scrollTrigger: {
              trigger: "#featured",
              start: "top 85%",
              end: "top 30%",
              scrub: true,
            },
          });

          // ── 004 Philosophy: pinned; progress line, then the paragraph reveals ─
          const manifesto = q("[data-manifesto]");
          if (manifesto) {
            const philosophy = gsap.timeline({
              scrollTrigger: desktop
                ? {
                    trigger: "#philosophy",
                    start: "top top",
                    end: "+=120%",
                    pin: true,
                    scrub: true,
                  }
                : {
                    trigger: "#philosophy",
                    start: "top 75%",
                    end: "top 15%",
                    scrub: true,
                  },
            });
            philosophy.from("[data-progress]", {
              scaleX: 0,
              ease: "none",
              duration: 1,
            });
            if (SplitText) {
              // Lines only, so every word stays intact for screen readers; "aria: none"
              // because aria-label is not allowed on a paragraph.
              const split = SplitText.create(manifesto, {
                type: "lines",
                mask: "lines",
                aria: "none",
              });
              philosophy.from(
                split.lines,
                {
                  yPercent: 105,
                  stagger: 0.25,
                  duration: 0.8,
                  ease: "power2.out",
                },
                ">-0.1",
              );
            } else {
              philosophy.fromTo(
                manifesto,
                { clipPath: "inset(0 0 100% 0)" },
                { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: "none" },
                ">-0.1",
              );
            }
          }

          // ── 005 Work: facets orbit, then collapse into the Artifact ─────
          if (desktop) {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: "[data-orbit-stage]",
                  start: "top top",
                  end: "+=150%",
                  pin: true,
                  scrub: true,
                  onUpdate: (self) => {
                    artifact.orbit = clamp01(self.progress / 0.45);
                    artifact.collapse = clamp01((self.progress - 0.55) / 0.4);
                  },
                  onLeaveBack: () => {
                    artifact.orbit = 0;
                    artifact.collapse = 0;
                  },
                },
              })
              // CSS fallback (no 3D): the ring of stills turns, then collapses.
              .fromTo(
                "[data-orbit-ring]",
                { rotate: 0 },
                { rotate: 90, duration: 0.55, ease: "none" },
              )
              .to(
                "[data-orbit-ring]",
                { scale: 0, autoAlpha: 0, duration: 0.4, ease: "power2.in" },
                0.55,
              );
          }
          reveal(q("#work-title"));
          const indexList = q("#work-index ol");
          if (indexList) {
            gsap.from("#work-index ol > li", {
              autoAlpha: 0,
              y: 32,
              stagger: 0.08,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: once(indexList),
            });
          }

          // ── 006 Experience: timeline dots fill as they are reached ──────
          reveal(q("#experience-title"));
          qa("[data-timeline] [data-filled]").forEach((dot) => {
            dot.dataset.filled = "false";
            ScrollTrigger.create({
              trigger: dot,
              start: "top 65%",
              onEnter: () => (dot.dataset.filled = "true"),
              onLeaveBack: () => (dot.dataset.filled = "false"),
            });
          });

          // ── 007, 008 ────────────────────────────────────────────────────
          reveal(q("#toolkit-title"));
          reveal(q("#contact-title"));

          // ── Artifact layout per section (last, so pins are accounted for) ─
          LAYOUT.forEach(({ selector, ...layouts }) => {
            const layout = desktop ? layouts.desktop : layouts.mobile;
            if (!layout || !q(selector)) return;
            const { fade, ...targets } = layout;
            ScrollTrigger.create({
              trigger: selector,
              start: "top 55%",
              end: "bottom 45%",
              onToggle: (self) => {
                if (!self.isActive) return;
                Object.assign(artifact, targets);
                setFade(fade);
              },
            });
          });

          return () => {
            lazy.disconnect();
            qa("[data-timeline] [data-filled]").forEach(
              (dot) => (dot.dataset.filled = "false"),
            );
          };
        },
      );

      ScrollTrigger.refresh();

      teardown = () => {
        mm.revert();
        // Also stops ScrollTrigger's permanent idle frame loop, which would
        // otherwise keep ticking on every other page after a visit to the home page.
        ScrollTrigger.disable(false, true);
        scrollTriggerDisabled = true;
        stopLenisSync();
        getLenis()?.off("scroll", ScrollTrigger.update);
        clearTimeout(hideTimer);
        root.style.removeProperty("--artifact-opacity");
        setArtifactVisible(true);
      };
    })();

    return () => {
      signal.cancelled = true;
      teardown();
    };
  }, []);

  return null;
}
