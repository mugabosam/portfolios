import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Mona_Sans } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SkipLink } from "@/components/ui/skip-link";
import { site } from "@/content/site";
import { getSiteUrl } from "@/lib/site-url";

import "./globals.css";
import "./scenes.css";

const sans = Mona_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-mona",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: false, // code panels only; Mona Sans carries all other text
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: "https://github.com/mugabosam" }],
  creator: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f5f7fa",
  colorScheme: "light",
};

/**
 * Runs before the first paint: if the home page's intro already played in
 * this tab, mark it seen so a reload does not show it again.
 */
const introScript = `try{if(sessionStorage.getItem("intro-seen"))document.documentElement.dataset.intro="seen"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable}`}
      // The intro script may add data-intro before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <SkipLink />
        <SmoothScroll />
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
