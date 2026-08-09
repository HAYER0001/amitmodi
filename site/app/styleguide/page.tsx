import React from 'react';

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default function Styleguide() {
  return (
    <main className="bg-paper text-ink min-h-screen p-12">
      <div className="max-w-5xl mx-auto space-y-16">
        
        <header>
          <h1 className="font-display text-5xl mb-4">Design System & Styleguide</h1>
          <p className="font-body text-ink opacity-80">Internal reference for the "Compliance in Check" component system.</p>
        </header>

        {/* Color Swatches */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl border-b border-rule pb-2">Palette & Contrast</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Paper */}
            <div className="p-4 border border-rule rounded flex flex-col gap-2 bg-[#EFEDE8]">
              <span className="font-label text-ink">--paper (#EFEDE8)</span>
              <div className="text-sm font-body text-ink">vs --paper: 1:1 (FAIL)</div>
              <div className="text-sm font-body text-ink">vs --ink: 15.6:1 (PASS AAA)</div>
            </div>

            {/* Paper Deep */}
            <div className="p-4 border border-rule rounded flex flex-col gap-2 bg-[#E4E1DA]">
              <span className="font-label text-ink">--paper-deep (#E4E1DA)</span>
              <div className="text-sm font-body text-ink">vs --paper: 1.1:1 (FAIL)</div>
              <div className="text-sm font-body text-ink">vs --ink: 14.1:1 (PASS AAA)</div>
            </div>

            {/* Ink */}
            <div className="p-4 border border-rule rounded flex flex-col gap-2 bg-[#14140F]">
              <span className="font-label text-[#EFEDE8]">--ink (#14140F)</span>
              <div className="text-sm font-body text-[#EFEDE8]">vs --paper: 15.6:1 (PASS AAA)</div>
              <div className="text-sm font-body text-[#EFEDE8]">vs --ink: 1:1 (FAIL)</div>
            </div>

            {/* Ink Soft */}
            <div className="p-4 border border-rule rounded flex flex-col gap-2 bg-[#55534B]">
              <span className="font-label text-[#EFEDE8]">--ink-soft (#55534B)</span>
              <div className="text-sm font-body text-[#EFEDE8]">vs --paper: 6.9:1 (PASS AA)</div>
              <div className="text-sm font-body text-[#EFEDE8]">vs --ink: 2.2:1 (FAIL)</div>
            </div>

            {/* Rule */}
            <div className="p-4 border border-rule rounded flex flex-col gap-2 bg-[#D9D6CE]">
              <span className="font-label text-ink">--rule (#D9D6CE)</span>
              <div className="text-sm font-body text-ink">vs --paper: 1.2:1 (FAIL)</div>
              <div className="text-sm font-body text-ink">vs --ink: 12.8:1 (PASS AAA)</div>
            </div>

            {/* Seal */}
            <div className="p-4 border border-rule rounded flex flex-col gap-2 bg-[#0A6B4E]">
              <span className="font-label text-[#EFEDE8]">--seal (#0A6B4E)</span>
              <div className="text-sm font-body text-[#EFEDE8]">vs --paper: 5.7:1 (PASS AA)</div>
              <div className="text-sm font-body text-[#EFEDE8]">vs --ink: 2.7:1 (FAIL)</div>
            </div>

            {/* Seal Deep */}
            <div className="p-4 border border-rule rounded flex flex-col gap-2 bg-[#064834]">
              <span className="font-label text-[#EFEDE8]">--seal-deep (#064834)</span>
              <div className="text-sm font-body text-[#EFEDE8]">vs --paper: 8.9:1 (PASS AAA)</div>
              <div className="text-sm font-body text-[#EFEDE8]">vs --ink: 1.7:1 (FAIL)</div>
            </div>

            {/* Stamp */}
            <div className="p-4 border border-rule rounded flex flex-col gap-2 bg-[#B3392B]">
              <span className="font-label text-[#EFEDE8]">--stamp (#B3392B)</span>
              <div className="text-sm font-body text-[#EFEDE8]">vs --paper: 4.6:1 (PASS AA)</div>
              <div className="text-sm font-body text-[#EFEDE8]">vs --ink: 3.4:1 (FAIL)</div>
            </div>

            {/* Brass */}
            <div className="p-4 border border-rule rounded flex flex-col gap-2 bg-[#A8842C]">
              <span className="font-label text-ink">--brass (#A8842C)</span>
              <div className="text-sm font-body text-ink">vs --paper: 2.6:1 (FAIL)</div>
              <div className="text-sm font-body text-ink">vs --ink: 5.9:1 (PASS AA)</div>
            </div>

            {/* Night */}
            <div className="p-4 border border-rule rounded flex flex-col gap-2 bg-[#12130F]">
              <span className="font-label text-[#EFEDE8]">--night (#12130F)</span>
              <div className="text-sm font-body text-[#EFEDE8]">vs --paper: 16.1:1 (PASS AAA)</div>
              <div className="text-sm font-body text-[#EFEDE8]">vs --ink: 1.05:1 (FAIL)</div>
            </div>
            
          </div>
        </section>

        {/* Type Scale */}
        <section className="space-y-8">
          <h2 className="font-display text-3xl border-b border-rule pb-2">Type Scale Specimen</h2>
          <div className="flex flex-col gap-8">
            <div>
              <div className="font-label text-ink opacity-60 mb-2">Display (Instrument Serif)</div>
              <div className="font-display text-6xl leading-tight text-ink">Strategic Defense Against Unjust GST Demands</div>
            </div>
            <div>
              <div className="font-label text-ink opacity-60 mb-2">H1 (Instrument Serif)</div>
              <h1 className="font-display text-5xl leading-tight text-ink">Filing the GSTR-9 Annual Return with Precision</h1>
            </div>
            <div>
              <div className="font-label text-ink opacity-60 mb-2">H2 (Newsreader)</div>
              <h2 className="font-body font-bold text-3xl leading-snug text-ink">The threshold limit for mandatory tax audit under Section 44AB.</h2>
            </div>
            <div>
              <div className="font-label text-ink opacity-60 mb-2">H3 (Newsreader)</div>
              <h3 className="font-body font-bold text-2xl leading-snug text-ink">Reconciling ITC claims against GSTR-2B mismatches.</h3>
            </div>
            <div>
              <div className="font-label text-ink opacity-60 mb-2">Body (Newsreader)</div>
              <p className="font-body text-lg leading-relaxed text-ink">
                Interest under Section 234A is levied at 1% per month for delay in filing the Income Tax Return. A prompt and accurate filing ensures compliance and eliminates unnecessary financial penalties during the assessment year.
              </p>
            </div>
            <div>
              <div className="font-label text-ink opacity-60 mb-2">Label (IBM Plex Mono)</div>
              <span className="font-label text-sm uppercase tracking-wider text-ink">Form 26AS Available</span>
            </div>
          </div>
        </section>

        {/* Marginalia */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl border-b border-rule pb-2">Marginalia & Texture</h2>
          <div className="flex flex-wrap gap-12 p-16 bg-[#E4E1DA] rounded relative overflow-hidden h-64 items-center justify-center">
            <span className="marginalia font-margin text-3xl text-ink opacity-40" style={{ transform: 'rotate(-4deg)' }}>Sec 44AB</span>
            <span className="marginalia font-margin text-3xl text-ink opacity-40" style={{ transform: 'rotate(2deg)' }}>GSTR-3B</span>
            <span className="marginalia font-margin text-3xl text-ink opacity-40" style={{ transform: 'rotate(-7deg)' }}>Form 26AS</span>
            <span className="marginalia font-margin text-3xl text-ink opacity-40" style={{ transform: 'rotate(5deg)' }}>Rule 46</span>
            <span className="marginalia font-margin text-3xl text-ink opacity-40" style={{ transform: 'rotate(-1deg)' }}>u/s 139(1)</span>
            <span className="marginalia font-margin text-3xl text-ink opacity-40" style={{ transform: 'rotate(8deg)' }}>ITC-04</span>
          </div>
        </section>

        {/* Structural Panels */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl border-b border-rule pb-2">Structural Panels</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="ledger-grid h-80 border border-rule rounded flex items-center justify-center p-6 text-center">
              <span className="font-label bg-paper px-4 py-2 border border-rule shadow-sm">.ledger-grid</span>
            </div>
            <div className="paper h-80 border border-rule rounded shadow-lg flex items-center justify-center p-6 text-center relative overflow-hidden">
              <div className="cut-out absolute -right-6 -bottom-6 w-32 h-32 bg-seal rounded opacity-20"></div>
              <span className="font-label z-10 text-stamp">.paper with .cut-out and text-stamp</span>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
