"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { GitHubIcon, LogoMark } from "@/components/ui/icons";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="-ml-1 inline-flex min-h-tap items-center gap-2.5 rounded-md px-1 text-[1.0625rem] font-semibold tracking-[-0.01em] [font-stretch:108%]"
    >
      <LogoMark className="size-7 shrink-0" />
      {site.name}
      <span className="sr-only">, home</span>
    </Link>
  );
}

const github = site.socials.find((social) => social.label === "GitHub");

/**
 * Fixed header. It starts transparent over the page and settles onto a
 * blurred paper background once the page scrolls (CSS scroll-driven, see
 * .site-header). On small screens the links move into a full-screen modal
 * dialog (focus contained, Esc closes, focus returns to the Menu button).
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuId = useId();

  const openMenu = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const closeMenu = () => dialogRef.current?.close();

  // If the viewport grows past the mobile breakpoint, the overlay no longer
  // applies: close it.
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia("(min-width: 48rem)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) dialogRef.current?.close();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open]);

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-50 text-ink">
        <div className="container-site flex h-(--header-h) items-center justify-between gap-6">
          <Wordmark />

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {site.nav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex min-h-tap items-center rounded-md px-3 text-small font-medium transition-colors duration-(--dur-ui)",
                        active ? "text-ink" : "text-ink-2 hocus:text-ink",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-3 bottom-2 h-0.5 origin-left rounded-full bg-sky transition-transform duration-(--dur-move) ease-(--ease-out)",
                          active ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
              {github && (
                <li className="ml-2 border-l border-line pl-3">
                  <a
                    href={github.href}
                    rel="me noopener"
                    className="inline-flex min-h-tap min-w-tap items-center justify-center rounded-md text-ink-2 transition-colors duration-(--dur-ui) hocus:text-ink"
                  >
                    <GitHubIcon className="size-5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                </li>
              )}
            </ul>
          </nav>

          <button
            type="button"
            onClick={openMenu}
            aria-expanded={open}
            aria-controls={menuId}
            className="menu-toggle -mr-2 inline-flex min-h-tap items-center rounded-md px-2 text-small font-semibold md:hidden"
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
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex min-h-tap items-center text-small font-medium"
            >
              {item.label}
            </Link>
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
            <Wordmark onClick={closeMenu} />
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
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className="flex min-h-16 items-center justify-between type-h3"
                    >
                      {item.label}
                      {active && (
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

          <div className="container-site flex shrink-0 flex-col gap-1 pb-10">
            <p className="text-small text-ink-3">Email</p>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-tap items-center text-body font-medium text-sky underline decoration-sky/35 underline-offset-4"
            >
              {site.email}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
