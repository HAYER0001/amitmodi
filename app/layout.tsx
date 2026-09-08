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
import CursorField from "@/components/ui/CursorField";
import SmoothScroll from "@/components/ui/SmoothScroll";
import ChatLauncher from "@/components/ui/ChatLauncher";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { WebSiteSchema, OrganizationSchema, LocalBusinessSchema } from "@/components/seo/SchemaEmitters";
import { Analytics } from "@vercel/analytics/next";
import MetaPixel from "@/components/analytics/MetaPixel";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://amitmodi-one.vercel.app";
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
  metadataBase: new URL(SITE_URL),
  /*
   * No `icons` block on purpose. app/favicon.ico, app/icon.png and
   * app/apple-icon.png are App Router file conventions — Next finds them and
   * emits the <link> tags itself, with cache-busting hashes.
   *
   * Declaring them by hand pointed at /favicon.ico etc. in public/, and those
   * duplicates ALSO shadowed the convention: every request for /favicon.ico
   * returned 500 ("A conflicting public file and page file was found"). The
   * public/ copies were three renamed copies of the same JPEG — a JPEG called
   * .ico and a JPEG called .png — so the tab icon was broken everywhere it was
   * not silently ignored.
   */
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
      <body
        className={`${display.variable} ${body.variable} ${label.variable} ${margin.variable} overflow-x-hidden antialiased`}
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
        {/* The knight IS the loading screen, so its download must start with
            the document — not after the JS bundle parses and the dynamic import
            resolves. React 19 hoists this <link> into <head> automatically.
            An explicit <head> element in an App Router layout is dropped, which
            is why the first attempt at this never reached the HTML. */}
        <link
          rel="preload"
          as="fetch"
          href="/models/knight-brass.glb"
          type="model/gltf-binary"
          crossOrigin="anonymous"
        />
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
          <CursorField />
          <ChatLauncher />
          <LoadingScreen />
        </ThemeProvider>
        {/* Structured data. These were imported here but never rendered, so the
            site was shipping no schema.org markup at all — for a practice whose
            visitors search "GST advisor Suratgarh", LocalBusiness is the single
            most valuable tag on the page.

            Each emitter is self-suppressing: LocalBusinessSchema returns null
            until real coordinates exist, and the hours/telephone fields are
            filtered through hasFact(). Nothing here can publish a detail the
            practice has not supplied. */}
        {/* Renders nothing unless NEXT_PUBLIC_META_PIXEL_ID is set — no script,
            no cookies, no request to Meta. Only on for a live campaign. */}
        <MetaPixel />
        <WebSiteSchema domain={SITE_URL} />
        <OrganizationSchema domain={SITE_URL} />
        <LocalBusinessSchema domain={SITE_URL} />
        <Analytics />
      </body>
    </html>
  );
}
