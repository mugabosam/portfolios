import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/cn";

import { ArrowDownIcon, ArrowRightIcon, ArrowUpRightIcon } from "./icons";

export type ButtonVariant = "ghost" | "solid" | "link";
export type ButtonIcon = "arrow" | "external" | "download";
/** Styleguide only: renders a state without interaction. */
export type ForcedState = "hover" | "focus" | "active";

type BaseProps = {
  /** ghost: thin outline (default). solid: white fill, once per page at most. link: underlined text. */
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
  "group relative isolate inline-flex min-h-tap items-center justify-center gap-3 whitespace-nowrap type-label transition-[color,translate] duration-(--dur-ui) ease-out is-active:translate-y-px disabled:pointer-events-none disabled:opacity-40";

const variants: Record<ButtonVariant, string> = {
  ghost: "border border-line-strong px-6 text-fg hocus:text-bg",
  solid: "bg-fg px-6 text-bg",
  // Small inline padding gives the focus ring room; negative margin keeps alignment.
  link: "-mx-1 px-1 text-fg",
};

/** Hover layers. Only transform and opacity animate (brief §6.2). */
function Decoration({ variant }: { variant: ButtonVariant }) {
  if (variant === "ghost") {
    return (
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-fg transition-transform duration-(--dur-ui) ease-out group-hocus:scale-y-100"
      />
    );
  }
  if (variant === "solid") {
    return (
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-bg opacity-0 transition-opacity duration-(--dur-ui) ease-out group-hocus:opacity-15"
      />
    );
  }
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-x-1 bottom-3 h-px bg-line-strong"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-1 bottom-3 h-px origin-left scale-x-0 bg-fg transition-transform duration-(--dur-ui) ease-out group-hocus:scale-x-100"
      />
    </>
  );
}

function Icon({ icon }: { icon: ButtonIcon }) {
  const motion =
    "size-3 shrink-0 transition-transform duration-(--dur-ui) ease-out";
  if (icon === "external") {
    return (
      <ArrowUpRightIcon
        className={cn(
          motion,
          "group-hocus:translate-x-1 group-hocus:-translate-y-1",
        )}
      />
    );
  }
  if (icon === "download") {
    return (
      <ArrowDownIcon className={cn(motion, "group-hocus:translate-y-1")} />
    );
  }
  return <ArrowRightIcon className={cn(motion, "group-hocus:translate-x-1")} />;
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
      variant = "ghost",
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
    const content = (
      <>
        <Decoration variant={variant} />
        <span>{children}</span>
        {icon && <Icon icon={icon} />}
        {newTab && <span className="sr-only"> (opens in a new tab)</span>}
      </>
    );
    const internal =
      (href.startsWith("/") || href.startsWith("#")) && !download;
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
    variant = "ghost",
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
      <Decoration variant={variant} />
      <span>{children}</span>
      {icon && <Icon icon={icon} />}
    </button>
  );
}
