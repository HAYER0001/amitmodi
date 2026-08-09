import { homepageMetadata } from "./metadata";
import Hero from "@/components/sections/Hero";
import HeroBridge from "@/components/sections/HeroBridge";
import TheProblem from "@/components/sections/TheProblem";
import TheServices from "@/components/sections/TheServices";
import TheProcess from "@/components/sections/TheProcess";
import TheProof from "@/components/sections/TheProof";
import CredentialBar from "@/components/sections/CredentialBar";
import TestimonialCarousel from "@/components/sections/TestimonialCarousel";
import ClientMarquee from "@/components/sections/ClientMarquee";
import ClosingCTA from "@/components/sections/ClosingCTA";

export const metadata = homepageMetadata;

/*
 * Homepage — the narrative, one beat of an argument per section.
 *
 * 1. Hero          — the claim
 * 2. HeroBridge    — the thesis
 * 3. TheProblem    — what going wrong actually costs
 * 4. TheServices   — the eight moves available
 * 5. TheProcess    — what happens after you contact us
 * 6. TheProof      — evidence
 * 7. Trust         — CredentialBar, TestimonialCarousel, ClientMarquee
 *                    (Phase 13; each returns nothing until there is a real,
 *                    consent-backed fact to show, so conservative mode and a
 *                    not-yet-filled data store leave the page unchanged)
 * 8. ClosingCTA    — the ask
 *
 * Hero and HeroBridge are delivered on the Phase 8 parallel track
 * (components/sections/Hero.tsx, HeroBridge.tsx).
 */

export default function Home() {
  return (
    <>
      <Hero />
      <HeroBridge />
      <TheProblem />
      <TheServices />
      <TheProcess />
      <TheProof />
      <CredentialBar />
      <TestimonialCarousel />
      <ClientMarquee />
      <ClosingCTA />
    </>
  );
}
