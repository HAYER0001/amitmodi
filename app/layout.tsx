import type { Metadata } from "next";
import {
  Instrument_Serif,
  Newsreader,
  IBM_Plex_Mono,
  Caveat,
} from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import ScrollRail from "@/components/ui/ScrollRail";
import SmoothScroll from "@/components/ui/SmoothScroll";
import { WebSiteSchema, OrganizationSchema, LocalBusinessSchema } from "@/components/seo/SchemaEmitters";
import { Analytics } from "@vercel/analytics/next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://amitmodi.com";
const display = Instrument_Serif({
  variable: "--font-display",
  display: "swap",
  subsets: ["latin"],
  weight: "400",
});

const body = Newsreader({
  variable: "--font-body",
  display: "swap",
  subsets: ["latin"],
});

const label = IBM_Plex_Mono({
  variable: "--font-label",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const margin = Caveat({
  variable: "--font-margin",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amit Modi & Co.",
  description:
    "Tax and compliance guidance for Indian businesses — registration, filing, and appeals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      data-motion="full"
    >
      <head>
        {/* set data-motion before paint so CSS can respond pre-hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.motion=window.matchMedia("(prefers-reduced-motion: reduce)").matches?"reduced":"full"`,
          }}
        />
        <WebSiteSchema domain={SITE_URL} />
        <OrganizationSchema domain={SITE_URL} />
        <LocalBusinessSchema domain={SITE_URL} />
      </head>
      <body
        className={`${display.variable} ${body.variable} ${label.variable} ${margin.variable} paper ledger-grid antialiased`}
      >
        {/* first focusable element: skip to the real content landmark */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-paper focus:px-4 focus:py-2 focus:font-label focus:text-sm focus:text-ink focus:ring-2 focus:ring-seal"
        >
          Skip to content
        </a>
        {/* enableSystem makes next-themes read
            window.matchMedia('(prefers-color-scheme: dark)') and follow the
            operating system until the visitor explicitly picks a theme. Without
            it, someone whose phone has been in dark mode all evening gets a
            full-brightness page — and defaultTheme="light" meant that was
            everyone. defaultTheme="system" is what makes the toggle a
            *preference* rather than the only way to get dark mode. */}
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SmoothScroll>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </SmoothScroll>
          <ScrollRail />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
