import React from 'react';
// These components are built by Agent A in components/ui
import { 
  Reveal, 
  ScrollScale, 
  HorizontalScroll, 
  Magnetic, 
  StaggerGroup, 
  StaggerItem 
} from '@/components/ui/motion';

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default function MotionStyleguide() {
  return (
    <main className="bg-paper text-ink min-h-screen p-12 overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-24">
        
        <header>
          <h1 className="font-display text-5xl mb-4">Motion & Interaction Styleguide</h1>
          <p className="font-body text-ink-soft opacity-80">Reference for the motion primitives governing the Compliance in Check aesthetic.</p>
        </header>

        {/* Reveal Demos */}
        <section className="space-y-8 border-t border-rule pt-8">
          <div>
            <h2 className="font-display text-3xl mb-2">&lt;Reveal&gt;</h2>
            <p className="font-label text-sm text-ink-soft mb-1">Props: direction (up | down | left | right), delay</p>
            <p className="font-body text-sm mb-6">Use when standard content blocks (text, figures) enter the viewport to establish reading hierarchy.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <Reveal direction="up" delay={0.1}>
              <div className="p-6 bg-white border border-rule rounded-sm shadow-sm">
                <span className="font-label text-seal mb-2 block">Direction: Up</span>
                <p className="font-body">Interest under Section 234A is levied at 1% per month for delay in filing the Income Tax Return.</p>
              </div>
            </Reveal>

            <Reveal direction="down" delay={0.2}>
              <div className="p-6 bg-white border border-rule rounded-sm shadow-sm">
                <span className="font-label text-seal mb-2 block">Direction: Down</span>
                <p className="font-body">GST registration is mandatory for businesses crossing the ₹20 Lakh turnover threshold.</p>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.3}>
              <div className="p-6 bg-white border border-rule rounded-sm shadow-sm">
                <span className="font-label text-seal mb-2 block">Direction: Left</span>
                <p className="font-body">Linking Aadhaar with PAN is a statutory requirement to prevent your PAN from becoming inoperative.</p>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.4}>
              <div className="p-6 bg-white border border-rule rounded-sm shadow-sm">
                <span className="font-label text-seal mb-2 block">Direction: Right</span>
                <p className="font-body">Filing an appeal with the CIT(A) strictly requires adherence to the 30-day submission window.</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ScrollScale Demo */}
        <section className="space-y-8 border-t border-rule pt-8">
          <div>
            <h2 className="font-display text-3xl mb-2">&lt;ScrollScale&gt;</h2>
            <p className="font-label text-sm text-ink-soft mb-1">Props: None (tied to scroll position)</p>
            <p className="font-body text-sm mb-6">Use sparingly for massive display headlines that establish the section's core thesis.</p>
          </div>
          
          <div className="h-96 flex items-center justify-center bg-paper-deep border border-rule overflow-hidden relative">
            <ScrollScale>
              <h3 className="font-display text-6xl md:text-7xl text-ink text-center max-w-4xl px-4">
                Strategic Defense Against Unjust GST Demands.
              </h3>
            </ScrollScale>
          </div>
        </section>

        {/* Magnetic Demo */}
        <section className="space-y-8 border-t border-rule pt-8">
          <div>
            <h2 className="font-display text-3xl mb-2">&lt;Magnetic&gt;</h2>
            <p className="font-label text-sm text-ink-soft mb-1">Props: strength (number)</p>
            <p className="font-body text-sm mb-6">Use exclusively on primary Call to Action (CTA) buttons to give them tactile feedback.</p>
          </div>
          
          <div className="flex items-center justify-center h-48 bg-white border border-rule rounded-sm">
            <Magnetic strength={40}>
              <button className="bg-seal hover:bg-seal-deep transition-colors text-white font-label px-10 py-4 rounded-full shadow-lg">
                Request a Compliance Audit
              </button>
            </Magnetic>
          </div>
        </section>

        {/* Staggered List Demo */}
        <section className="space-y-8 border-t border-rule pt-8">
          <div>
            <h2 className="font-display text-3xl mb-2">&lt;StaggerGroup&gt; &amp; &lt;StaggerItem&gt;</h2>
            <p className="font-label text-sm text-ink-soft mb-1">Props: staggerDelay (number on Group)</p>
            <p className="font-body text-sm mb-6">Use for bulleted lists, grids, or process steps where items should animate in sequence.</p>
          </div>
          
          <StaggerGroup staggerDelay={0.15}>
            <ul className="space-y-4 max-w-2xl">
              <StaggerItem>
                <li className="flex items-start gap-4 p-4 bg-white border border-rule shadow-sm">
                  <span className="font-label text-seal mt-1">01</span>
                  <p className="font-body">We audit your current filings and identify any immediate exposure to penalties.</p>
                </li>
              </StaggerItem>
              <StaggerItem>
                <li className="flex items-start gap-4 p-4 bg-white border border-rule shadow-sm">
                  <span className="font-label text-seal mt-1">02</span>
                  <p className="font-body">We create a blueprint of exact deadlines and required data for your entity type.</p>
                </li>
              </StaggerItem>
              <StaggerItem>
                <li className="flex items-start gap-4 p-4 bg-white border border-rule shadow-sm">
                  <span className="font-label text-seal mt-1">03</span>
                  <p className="font-body">You send the raw data. We do the math, format the files, and submit them securely.</p>
                </li>
              </StaggerItem>
            </ul>
          </StaggerGroup>
        </section>

        {/* HorizontalScroll Demo */}
        <section className="space-y-8 border-t border-rule pt-8">
          <div>
            <h2 className="font-display text-3xl mb-2">&lt;HorizontalScroll&gt;</h2>
            <p className="font-label text-sm text-ink-soft mb-1">Props: items (array of ReactNodes)</p>
            <p className="font-body text-sm mb-6">Use for galleries of related documents, timelines, or cases that disrupt vertical rhythm purposefully.</p>
          </div>
          
          {/* This wrapper simulates a large scrollable area so the component can pin and track */}
          <div className="bg-paper-deep border border-rule rounded-sm p-4 relative h-[80vh]">
            <HorizontalScroll>
              <div className="w-[60vw] h-64 bg-white border border-rule shadow-sm p-8 flex flex-col justify-center flex-shrink-0">
                <span className="font-label text-ink-soft">Phase 1</span>
                <h4 className="font-display text-4xl mt-2">Initial Assessment Order</h4>
              </div>
              <div className="w-[60vw] h-64 bg-white border border-rule shadow-sm p-8 flex flex-col justify-center flex-shrink-0">
                <span className="font-label text-ink-soft">Phase 2</span>
                <h4 className="font-display text-4xl mt-2">Filing the Appeal (30 Days)</h4>
              </div>
              <div className="w-[60vw] h-64 bg-white border border-rule shadow-sm p-8 flex flex-col justify-center flex-shrink-0">
                <span className="font-label text-ink-soft">Phase 3</span>
                <h4 className="font-display text-4xl mt-2">Drafting Grounds of Appeal</h4>
              </div>
              <div className="w-[60vw] h-64 bg-white border border-rule shadow-sm p-8 flex flex-col justify-center flex-shrink-0">
                <span className="font-label text-ink-soft">Phase 4</span>
                <h4 className="font-display text-4xl mt-2">Tribunal Hearing Representation</h4>
              </div>
              <div className="w-[60vw] h-64 bg-white border border-rule shadow-sm p-8 flex flex-col justify-center flex-shrink-0">
                <span className="font-label text-ink-soft">Phase 5</span>
                <h4 className="font-display text-4xl mt-2">Securing Stay of Demand</h4>
              </div>
              <div className="w-[60vw] h-64 bg-white border border-rule shadow-sm p-8 flex flex-col justify-center flex-shrink-0">
                <span className="font-label text-ink-soft">Phase 6</span>
                <h4 className="font-display text-4xl mt-2">Final Appellate Order</h4>
              </div>
            </HorizontalScroll>
          </div>
        </section>

      </div>
    </main>
  );
}
