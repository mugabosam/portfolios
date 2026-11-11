"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { site } from "@/content/site";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Fixed, transparent header. `mix-blend-difference` keeps the white text
 * legible over the light section. On small screens the links move into a
 * full-screen modal dialog (focus contained, Esc closes, focus returns to the
 * Menu button).
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
      <header className="fixed inset-x-0 top-0 z-50 text-fg mix-blend-difference">
        <div className="container-site flex h-(--header-h) items-center justify-between">
          <Link
            href="/"
            aria-label={`${site.name}, home`}
            className="inline-flex min-h-tap items-center font-display text-wordmark italic"
          >
            <span aria-hidden="true" className="hidden sm:inline">
              {site.name}
            </span>
            <span aria-hidden="true" className="sm:hidden">
              {site.monogram}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="-mr-2 flex items-center gap-4">
              {site.nav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="group relative inline-flex min-h-tap items-center px-2 type-label"
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-2 bottom-3 h-px origin-left bg-current transition-transform duration-(--dur-ui) ease-out",
                          active
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={openMenu}
            aria-expanded={open}
            aria-controls={menuId}
            className="inline-flex min-h-tap min-w-tap items-center justify-end type-label md:hidden"
          >
            Menu
          </button>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        id={menuId}
        aria-label="Site menu"
        onClose={() => setOpen(false)}
        className="menu-dialog fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-bg p-0 text-fg md:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="container-site flex h-(--header-h) shrink-0 items-center justify-between">
            <Link
              href="/"
              onClick={closeMenu}
              aria-label={`${site.name}, home`}
              className="inline-flex min-h-tap items-center font-display text-wordmark italic"
            >
              <span aria-hidden="true">{site.monogram}</span>
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex min-h-tap min-w-tap items-center justify-end type-label"
            >
              Close
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="container-site flex flex-1 flex-col justify-center"
          >
            <ul className="flex flex-col gap-2">
              {site.nav.map((item, index) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className="inline-flex min-h-tap items-baseline gap-4 py-1 type-h2"
                    >
                      <span
                        aria-hidden="true"
                        className="type-label text-fg-muted tabular-nums"
                      >
                        {String(index + 1).padStart(3, "0")}
                      </span>
                      <span className={cn(active && "italic")}>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="container-site flex shrink-0 flex-col gap-2 pb-8">
            <span className="type-label text-fg-muted">Get in touch</span>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-h-tap items-center text-body underline decoration-line-strong underline-offset-4"
            >
              {site.email}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
