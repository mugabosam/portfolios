"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useEffect, useId, useRef, useState } from "react";

import { DownloadIcon, LogoMark } from "@/components/ui/icons";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { getLenis } from "@/lib/motion/lenis";

/** "/#work" → "work" */
const sectionOf = (href: string) => href.split("#")[1] ?? "";
const SECTIONS = site.nav.map((item) => sectionOf(item.href));

type Tone = "hero" | "blue" | "light";

/** Scrolls to a home-page section, through Lenis when it is running. */
function scrollToSection(id: string) {
  const target = id ? document.getElementById(id) : null;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = getLenis();
  if (!target) {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  } else if (lenis) {
    lenis.scrollTo(target, { offset: 0 });
  } else {
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  history.replaceState(null, "", id ? `#${id}` : "/");
}

function Wordmark({
  onClick,
}: {
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="header-brand -ml-1 inline-flex min-h-tap items-center gap-2.5 rounded-md px-1 text-[1.0625rem] font-semibold tracking-[-0.01em] [font-stretch:108%]"
    >
      <LogoMark className="logo-mark size-7 shrink-0" />
      {site.name}
      <span className="sr-only">, home</span>
    </Link>
  );
}

/**
 * Fixed header for a one-page site. Each link scrolls to a section of the
 * home page (from any other page it navigates there first), and the link of
 * the section in view is marked as current while the page scrolls. Its
 * colours follow what is underneath: clear over the hero's sky, navy glass
 * over the blue sections (the logo turns white so it stays visible) and
 * paper glass over light ones. On small screens the links move into a modal
 * dialog (focus contained, Esc closes, focus returns to the Menu button).
 */
export function SiteHeader() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuId = useId();

  const openMenu = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const closeMenu = () => dialogRef.current?.close();

  // Close the menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia("(min-width: 48rem)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) dialogRef.current?.close();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open]);

  // Scroll spy and header tone, measured once per frame while scrolling.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = header.offsetHeight + 24;

      // Tone: the [data-tone] block under the header's left edge.
      let tone: Tone | undefined;
      for (const el of document.querySelectorAll<HTMLElement>("[data-tone]")) {
        const box = el.getBoundingClientRect();
        if (
          box.top <= line &&
          box.bottom > line &&
          box.left <= 24 &&
          box.right > 24
        )
          tone = el.dataset.tone as Tone;
      }
      if (tone) header.dataset.tone = tone;
      else delete header.dataset.tone;

      // Current section: the last one whose top has passed 40% of the screen.
      if (!home) return;
      const mark = window.innerHeight * 0.4;
      let current = "";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= mark) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // First measurement on the next frame, not inside hydration.
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      delete header.dataset.tone;
    };
  }, [home]);

  /** On the home page, scroll instead of navigating. */
  const onNav = (id: string) => (event: MouseEvent) => {
    if (!home) return;
    event.preventDefault();
    setActive(id);
    scrollToSection(id);
  };

  /** From the menu: close it first, then scroll once the page is unlocked. */
  const onMenuNav = (event: MouseEvent<HTMLAnchorElement>) => {
    dialogRef.current?.close();
    if (!home) return;
    event.preventDefault();
    const id = event.currentTarget.dataset.section ?? "";
    requestAnimationFrame(() => scrollToSection(id));
  };

  return (
    <>
      <header
        ref={headerRef}
        style={{ viewTransitionName: "site-header" }}
        className="site-header fixed inset-x-0 top-0 z-50 text-ink"
      >
        <div className="container-site flex h-(--header-h) items-center justify-between gap-6">
          <Wordmark onClick={onNav("")} />

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="header-nav flex items-center gap-1">
              {site.nav.map((item) => {
                const id = sectionOf(item.href);
                const current = home && active === id;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNav(id)}
                      aria-current={current ? "true" : undefined}
                      className="header-link relative inline-flex min-h-tap items-center rounded-md px-3 text-small font-medium transition-colors duration-(--dur-ui)"
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "header-underline absolute inset-x-3 bottom-2 h-0.5 origin-left rounded-full transition-transform duration-(--dur-move) ease-(--ease-out)",
                          current ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
              <li className="ml-3">
                <a
                  href="/resume.pdf"
                  download
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-sun px-4 text-small font-semibold text-ink transition-[background-color,translate] duration-(--dur-ui) hocus:-translate-y-px hocus:bg-sun-deep"
                >
                  <DownloadIcon className="size-4" />
                  Download CV
                </a>
              </li>
            </ul>
          </nav>

          <button
            type="button"
            onClick={openMenu}
            aria-expanded={open}
            aria-controls={menuId}
            className="menu-toggle header-brand -mr-2 inline-flex min-h-tap items-center rounded-md px-2 text-small font-semibold md:hidden"
          >
            Menu
          </button>
        </div>

        {/* Without JavaScript the menu dialog cannot open, so small screens
            get the links as a plain second row instead. */}
        <noscript>
          <style>{`@media (max-width: 47.99rem) { .menu-toggle { display: none !important; } .noscript-nav { display: flex !important; } }`}</style>
        </noscript>
        <nav
          aria-label="Primary (no script)"
          className="noscript-nav container-site hidden flex-wrap gap-x-5 pb-2"
        >
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="header-link inline-flex min-h-tap items-center text-small font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <dialog
        ref={dialogRef}
        id={menuId}
        aria-label="Site menu"
        data-lenis-prevent
        onClose={() => setOpen(false)}
        className="menu-dialog fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-paper p-0 text-ink md:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="container-site flex h-(--header-h) shrink-0 items-center justify-between">
            <Wordmark onClick={onMenuNav} />
            <button
              type="button"
              onClick={closeMenu}
              className="-mr-2 inline-flex min-h-tap items-center rounded-md px-2 text-small font-semibold"
            >
              Close
            </button>
          </div>

          <nav aria-label="Mobile" className="container-site flex-1 pt-10">
            <ul className="flex flex-col border-t border-line">
              {site.nav.map((item) => {
                const id = sectionOf(item.href);
                const current = home && active === id;
                return (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      data-section={id}
                      onClick={onMenuNav}
                      aria-current={current ? "true" : undefined}
                      className="flex min-h-16 items-center justify-between type-h3"
                    >
                      {item.label}
                      {current && (
                        <span
                          aria-hidden="true"
                          className="size-2 rounded-full bg-sky"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="container-site flex shrink-0 flex-col gap-4 pb-10">
            <a
              href="/resume.pdf"
              download
              className="inline-flex min-h-tap items-center justify-center gap-2 rounded-full bg-sun px-6 text-small font-semibold text-ink"
            >
              <DownloadIcon className="size-4" />
              Download CV
            </a>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-tap items-center justify-center text-body font-medium text-sky underline decoration-sky/35 underline-offset-4"
            >
              {site.email}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
