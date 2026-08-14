"use client";

/*
 * MetaPixel.tsx — Meta (Facebook) Pixel, for the paid campaign.
 *
 * OFF BY DEFAULT. With no NEXT_PUBLIC_META_PIXEL_ID set, this renders nothing
 * at all: no script, no cookies, no request to Meta. That is deliberate — the
 * pixel drops third-party cookies and reports visitor behaviour to Meta, so it
 * should not be the default state of a tax practice's website. It switches on
 * only when someone deliberately sets the ID for a campaign.
 *
 * WHY A CLICK DELEGATE RATHER THAN onClick HANDLERS
 * The conversion on this site is "the visitor started a conversation" — a
 * WhatsApp deep link or a phone tap. Those anchors are spread across the tool
 * CTAs, the contact page and the article footers, and several live in server
 * components. Wiring an onClick into each one would mean converting them to
 * client components and leaving a tracking call in five files that must not
 * drift apart. One delegated listener on the document catches every current
 * and future wa.me / tel: link from a single place, and if the pixel is off it
 * is never installed at all.
 */

import Script from "next/script";
import { useEffect } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function MetaPixel() {
  useEffect(() => {
    if (!PIXEL_ID) return;

    /* Delegated on the document so it covers links rendered later — the tool
       CTA appears only once a calculator has produced a result. */
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const isConversation =
        href.startsWith("https://wa.me/") || href.startsWith("tel:");
      if (!isConversation) return;
      window.fbq?.("track", "Lead", {
        content_name: href.startsWith("tel:") ? "phone" : "whatsapp",
        content_category: window.location.pathname,
      });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
