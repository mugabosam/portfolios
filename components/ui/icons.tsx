import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M2.5 8h11M9.5 4l4 4-4 4" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M13.5 8h-11M6.5 4l-4 4 4 4" />
    </svg>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </svg>
  );
}

/** Marks links that leave the site. */
export function ExternalIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M5 11l6-6M6 5h5v5" />
    </svg>
  );
}

export function DownloadIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M8 2.5v8M4.5 7.5 8 11l3.5-3.5M3 13.5h10" />
    </svg>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 3.5v-.5A1.5 1.5 0 0 0 9 1.5H3A1.5 1.5 0 0 0 1.5 3v6A1.5 1.5 0 0 0 3 10.5h.5" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  );
}

export function GitHubIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
      focusable={false}
      {...props}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

/**
 * The site's mark: a prompt chevron and sun cursor on a rounded square. The
 * square and chevron colours come from --logo-bg and --logo-fg, so the header
 * can invert the mark on dark sections.
 */
export function LogoMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden focusable={false} {...props}>
      <rect width="32" height="32" rx="8" fill="var(--logo-bg, var(--ink))" />
      <path
        d="M9 11l5 5-5 5"
        fill="none"
        stroke="var(--logo-fg, var(--sky-bright))"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="16"
        y="19.5"
        width="8"
        height="2.75"
        rx="1.2"
        fill="var(--sun)"
      />
    </svg>
  );
}
