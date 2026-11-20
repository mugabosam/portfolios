import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/cn";

import {
  ArrowUpRightIcon,
  DownloadIcon,
  ExternalIcon,
  GitHubIcon,
} from "./icons";

/**
 * primary: sun fill, the one main action in view.
 * secondary: outlined, for everything else.
 * inverse: outlined in light ink, for the navy contact band.
 * link: sky text, underlined.
 */
export type ButtonVariant = "primary" | "secondary" | "inverse" | "link";
export type ButtonIcon = "external" | "download" | "github" | "arrow";
/** Styleguide only: renders a state without interaction. */
export type ForcedState = "hover" | "focus" | "active";

type BaseProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
  icon?: ButtonIcon;
  forceState?: ForcedState;
};

type LinkButtonProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps | "href"> & {
    href: string;
    /** Opens in a new tab and says so to screen readers. */
    newTab?: boolean;
  };

type NativeButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

const base =
  "group inline-flex min-h-tap items-center justify-center gap-2.5 whitespace-nowrap text-small font-semibold transition-[background-color,border-color,color,translate,box-shadow] duration-(--dur-ui) ease-out is-active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "rounded-full bg-sun px-6 text-ink shadow-[inset_0_-2px_0_rgb(11_27_43/0.12)] hocus:-translate-y-px hocus:bg-sun-deep",
  secondary:
    "rounded-full border border-line-strong bg-surface px-6 text-ink hocus:-translate-y-px hocus:border-ink",
  inverse:
    "rounded-full border border-white/45 px-6 text-white hocus:-translate-y-px hocus:border-white hocus:bg-white/5",
  // Small inline padding gives the focus ring room; negative margin keeps alignment.
  link: "-mx-1 rounded-sm px-1 text-sky underline decoration-sky/35 decoration-1 underline-offset-[5px] hocus:decoration-sky",
};

function Icon({ icon, variant }: { icon: ButtonIcon; variant: ButtonVariant }) {
  if (icon === "github") return <GitHubIcon className="size-4 shrink-0" />;
  if (icon === "arrow")
    return (
      <span
        className={cn(
          "-mr-3 inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-transform duration-(--dur-move) ease-(--ease-out) group-hocus:rotate-45",
          variant === "inverse"
            ? "bg-white text-sky-deep"
            : "bg-sky-deep text-white",
        )}
      >
        <ArrowUpRightIcon className="size-3.5" />
      </span>
    );
  if (icon === "download")
    return (
      <DownloadIcon className="size-4 shrink-0 transition-transform duration-(--dur-ui) ease-out group-hocus:translate-y-0.5" />
    );
  return (
    <ExternalIcon className="size-4 shrink-0 transition-transform duration-(--dur-ui) ease-out group-hocus:translate-x-0.5 group-hocus:-translate-y-0.5" />
  );
}

function isLink(props: ButtonProps): props is LinkButtonProps {
  return typeof props.href === "string";
}

/**
 * The site's one call-to-action component. Renders a Next.js <Link> for
 * internal paths, an <a> for everything else (external, mailto, downloads)
 * and a <button> when there is no href. Every variant is at least 44px tall.
 */
export function Button(props: ButtonProps) {
  if (isLink(props)) {
    const {
      variant = "secondary",
      children,
      className,
      icon,
      forceState,
      href,
      newTab,
      download,
      ...rest
    } = props;
    const classes = cn(base, variants[variant], className);
    const leading = icon === "github";
    const content = (
      <>
        {icon && leading && <Icon icon={icon} variant={variant} />}
        <span>{children}</span>
        {icon && !leading && <Icon icon={icon} variant={variant} />}
        {newTab && <span className="sr-only"> (opens in a new tab)</span>}
      </>
    );
    // Same-page "#section" links stay plain anchors, so the smooth scroller
    // (smooth-scroll.tsx) or the browser handles them, not the router.
    const internal = href.startsWith("/") && !download;
    if (internal) {
      return (
        <Link href={href} className={classes} data-force={forceState} {...rest}>
          {content}
        </Link>
      );
    }
    return (
      <a
        href={href}
        download={download}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className={classes}
        data-force={forceState}
        {...rest}
      >
        {content}
      </a>
    );
  }

  const {
    variant = "secondary",
    children,
    className,
    icon,
    forceState,
    type = "button",
    ...rest
  } = props;
  return (
    <button
      type={type}
      className={cn(base, variants[variant], className)}
      data-force={forceState}
      {...rest}
    >
      {icon && icon === "github" && <Icon icon={icon} variant={variant} />}
      <span>{children}</span>
      {icon && icon !== "github" && <Icon icon={icon} variant={variant} />}
    </button>
  );
}
