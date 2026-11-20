"use client";

import { useEffect } from "react";

import { getLenis, onLenis } from "@/lib/motion/lenis";

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

/** Large screens with room for a pinned card: the only place pinning runs. */
const DECK_QUERY = "(min-width: 64rem) and (min-height: 40rem)";

/**
 * The home page's GSAP layer. Everything it animates is already readable
 * without it: the intro and the hero's scroll scene are CSS, and this only
 * adds what CSS cannot do well.
 *
 * - Section headlines rise line by line inside masks (SplitText).
 * - Work cards pin and stack over each other, the covered card shrinking
 *   and dimming (large screens only, where a card fits the viewport).
 * - GitHub numbers count up the first time they are seen.
 * - Primary buttons lean towards the pointer; the hero's sun, word and
 *   figure drift at different depths as the pointer moves.
 *
 * One-time reveals are started by an IntersectionObserver, not
 * ScrollTrigger, so phones never load ScrollTrigger: its page measurement
 * would cancel a smooth jump to a section that is already under way. Only
 * the stacked deck uses ScrollTrigger, on large screens.
 *
 * GSAP loads after the first paint: on idle on desktop, at the first sign of
 * intent on phones (so a phone that only reads the hero never loads it).
 * Under reduced motion nothing here runs.
 */
export function HomeMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const signal = { cancelled: false };
    let teardown = () => {};
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const deck = window.matchMedia(DECK_QUERY).matches;

    (async () => {
      await (finePointer ? whenIdle(1500) : whenIntent(signal));
      if (signal.cancelled) return;
      const [{ gsap }, { SplitText }, scrollTriggerModule] = await Promise.all([
        import("gsap"),
        import("gsap/SplitText"),
        deck ? import("gsap/ScrollTrigger") : Promise.resolve(null),
      ]);
      if (signal.cancelled) return;
      gsap.registerPlugin(SplitText);
      const ScrollTrigger = scrollTriggerModule?.ScrollTrigger ?? null;
      let stopLenisSync = () => {};
      if (ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        // Re-arm only after a previous visit disabled it on teardown;
        // enable() on an already-enabled ScrollTrigger starts a second loop.
        if (scrollTriggerDisabled) {
          ScrollTrigger.enable();
          scrollTriggerDisabled = false;
        }
        // Keep ScrollTrigger in step with Lenis, whenever Lenis arrives.
        const syncLenis = (lenis: ReturnType<typeof getLenis>) =>
          lenis?.on("scroll", ScrollTrigger.update);
        syncLenis(getLenis());
        const off = onLenis(syncLenis);
        stopLenisSync = () => {
          off();
          getLenis()?.off("scroll", ScrollTrigger.update);
        };
      }

      const qa = <T extends Element = HTMLElement>(selector: string) =>
        gsap.utils.toArray<T>(selector);

      /** Plays each registered tween once its element comes into view. */
      const plays = new Map<Element, () => void>();
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer.unobserve(entry.target);
            plays.get(entry.target)?.();
            plays.delete(entry.target);
          }
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
      const whenSeen = (el: Element, play: () => void) => {
        plays.set(el, play);
        observer.observe(el);
      };

      const mm = gsap.matchMedia();

      // ── Every screen size ──────────────────────────────────────────────
      mm.add("all", () => {
        // Headlines: each line rises out of its own mask.
        qa("[data-split]").forEach((heading) => {
          SplitText.create(heading, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit: (split) => {
              const tween = gsap.from(split.lines, {
                yPercent: 112,
                rotate: 2.5,
                transformOrigin: "0% 100%",
                duration: 1.2,
                stagger: 0.1,
                ease: "expo.out",
                paused: true,
              });
              whenSeen(heading, () => tween.play());
              return tween;
            },
          });
        });

        qa("[data-fade]").forEach((el) => {
          const tween = gsap.from(el, {
            autoAlpha: 0,
            y: 32,
            duration: 1.1,
            ease: "power3.out",
            paused: true,
          });
          whenSeen(el, () => tween.play());
        });

        // GitHub numbers count up from zero, then settle on the exact text.
        const format = new Intl.NumberFormat("en-US");
        const restores: (() => void)[] = [];
        qa("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          const final = el.textContent;
          if (!Number.isFinite(target)) return;
          const box = el.getBoundingClientRect();
          if (box.top < window.innerHeight && box.bottom > 0) return;
          el.textContent = "0";
          restores.push(() => {
            el.textContent = final;
          });
          const state = { value: 0 };
          whenSeen(el, () =>
            gsap.to(state, {
              value: target,
              duration: 1.8,
              ease: "power3.out",
              onUpdate: () => {
                el.textContent = format.format(Math.round(state.value));
              },
              onComplete: () => {
                el.textContent = final;
              },
            }),
          );
        });
        return () => restores.forEach((restore) => restore());
      });

      // ── Smaller screens: work cards rise in as they arrive ─────────────
      mm.add("(max-width: 63.99rem)", () => {
        qa("[data-deck-item]").forEach((item) => {
          const tween = gsap.from(item, {
            y: 64,
            autoAlpha: 0,
            duration: 1.1,
            ease: "power3.out",
            paused: true,
          });
          whenSeen(item, () => tween.play());
        });
      });

      // ── Large screens: the stacked deck ────────────────────────────────
      if (ScrollTrigger)
        mm.add(DECK_QUERY, () => {
          const items = qa("[data-deck-item]");
          if (items.length < 2) return;
          const rem = parseFloat(
            getComputedStyle(document.documentElement).fontSize,
          );
          const header =
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--header-h",
              ),
            ) * rem;
          const topFor = (index: number) => header + 24 + index * 20;
          const last = items[items.length - 1]!;

          items.forEach((item, index) => {
            const next = items[index + 1];
            if (!next) return;
            ScrollTrigger.create({
              trigger: item,
              start: () => `top top+=${topFor(index)}`,
              endTrigger: last,
              end: () => `top top+=${topFor(items.length - 1)}`,
              pin: true,
              pinSpacing: false,
            });
            const card = item.querySelector(".deck-card");
            const shade = item.querySelector("[data-deck-shade]");
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: next,
                  start: "top bottom",
                  end: () => `top top+=${topFor(index + 1)}`,
                  scrub: true,
                },
              })
              .to(
                card,
                { scale: 0.92, transformOrigin: "50% 0%", ease: "none" },
                0,
              )
              .to(shade, { opacity: 1, ease: "none" }, 0);
          });
        });

      // ── Fine pointers: magnetic buttons, card light and hero depth ─────
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const removers: (() => void)[] = [];

        qa("[data-magnetic]").forEach((el) => {
          const x = gsap.quickTo(el, "x", {
            duration: 0.7,
            ease: "elastic.out(1, 0.45)",
          });
          const y = gsap.quickTo(el, "y", {
            duration: 0.7,
            ease: "elastic.out(1, 0.45)",
          });
          const move = (event: PointerEvent) => {
            const box = el.getBoundingClientRect();
            x((event.clientX - (box.left + box.width / 2)) * 0.3);
            y((event.clientY - (box.top + box.height / 2)) * 0.4);
          };
          const leave = () => {
            x(0);
            y(0);
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          removers.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
          });
        });

        qa("[data-spotlight]").forEach((el) => {
          const move = (event: PointerEvent) => {
            const box = el.getBoundingClientRect();
            el.style.setProperty("--mx", `${event.clientX - box.left}px`);
            el.style.setProperty("--my", `${event.clientY - box.top}px`);
          };
          el.addEventListener("pointermove", move);
          removers.push(() => el.removeEventListener("pointermove", move));
        });

        const hero = document.querySelector<HTMLElement>(".hero-sky");
        if (hero) {
          const layers = qa("[data-parallax]").map((el) => ({
            depth: Number(el.dataset.parallax) || 0,
            x: gsap.quickTo(el, "x", { duration: 1.4, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 1.4, ease: "power3.out" }),
          }));
          const move = (event: PointerEvent) => {
            const nx = event.clientX / window.innerWidth - 0.5;
            const ny = event.clientY / window.innerHeight - 0.5;
            for (const layer of layers) {
              layer.x(nx * 44 * layer.depth);
              layer.y(ny * 26 * layer.depth);
            }
          };
          const leave = () => {
            for (const layer of layers) {
              layer.x(0);
              layer.y(0);
            }
          };
          hero.addEventListener("pointermove", move);
          hero.addEventListener("pointerleave", leave);
          removers.push(() => {
            hero.removeEventListener("pointermove", move);
            hero.removeEventListener("pointerleave", leave);
          });
        }

        return () => removers.forEach((remove) => remove());
      });

      // Pin positions depend on the final fonts.
      if (ScrollTrigger)
        document.fonts?.ready.then(() => {
          if (!signal.cancelled) ScrollTrigger.refresh();
        });

      teardown = () => {
        observer.disconnect();
        plays.clear();
        mm.revert();
        if (ScrollTrigger) {
          // Also stops ScrollTrigger's idle frame loop, which would otherwise
          // keep ticking on every other page after a visit to the home page.
          ScrollTrigger.disable(false, true);
          scrollTriggerDisabled = true;
        }
        stopLenisSync();
      };
    })();

    return () => {
      signal.cancelled = true;
      teardown();
    };
  }, []);

  return null;
}
