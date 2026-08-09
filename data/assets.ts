// Asset manifest — generated from the real files in public/images.
//
// The width/height values below are the ACTUAL pixel dimensions on disk. next/image
// uses them to reserve space before the image loads; if they disagree with reality the
// page shifts as images arrive, which is a Cumulative Layout Shift penalty.
//
// If you regenerate or resize any asset, re-run:
//   bash tools/optimize-assets.sh
// and update the numbers here to match.
//
// ALT TEXT RULE — decorative images carry alt: '' and decorative: true. An empty alt is
// correct, not lazy: a screen reader must skip a floating collage element silently.
// Meaningful images describe what they COMMUNICATE, not what they depict.
//
// ratio is the aspect ratio the asset was designed at, from MASTER-BUILD-PLAN.md Phase 4
// STEP 1 (fig 3:4, cut 1:1, tex 1:1 or 16:9, spread 4:3, cover 4:3, og 16:9, icons 1:1).

export type AssetKey = keyof typeof ASSETS

export interface Asset {
  src: string
  width: number
  height: number
  ratio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
  alt: string
  decorative: boolean
  key: 'white' | 'magenta' | 'none'
}

export const ASSETS = {
  // ── Ink figures — meaningful, each illustrates a real situation ──────────────
  'fig-shopkeeper': {
    src: '/images/fig-shopkeeper.png', width: 1400, height: 1184,
    ratio: '3:4',
    alt: 'A shopkeeper at his counter, the kind of business that crosses the GST registration threshold first',
    decorative: false, key: 'white',
  },
  'fig-exporter': {
    src: '/images/fig-exporter.png', width: 1400, height: 1118,
    ratio: '3:4',
    alt: 'An exporter checking a consignment against shipping documents before filing',
    decorative: false, key: 'white',
  },
  'fig-textile-trader': {
    src: '/images/fig-textile-trader.png', width: 969, height: 1400,
    ratio: '3:4',
    alt: 'A textile trader carrying stock, representing traders filing monthly GST returns',
    decorative: false, key: 'white',
  },
  'fig-founder': {
    src: '/images/fig-founder.png', width: 1181, height: 1400,
    ratio: '3:4',
    alt: 'A founder working on a laptop, at the stage of choosing a business structure',
    decorative: false, key: 'white',
  },
  'fig-restaurateur': {
    src: '/images/fig-restaurateur.png', width: 1400, height: 1160,
    ratio: '3:4',
    alt: 'A restaurant owner at the counter, a business with daily GST compliance obligations',
    decorative: false, key: 'white',
  },
  'fig-consultant': {
    src: '/images/fig-consultant.png', width: 679, height: 1400,
    ratio: '3:4',
    alt: 'A professional reading a document while walking between meetings',
    decorative: false, key: 'white',
  },
  'fig-worried': {
    src: '/images/fig-worried.png', width: 577, height: 1400,
    ratio: '3:4',
    alt: 'A business owner reading a departmental notice, shoulders dropped',
    decorative: false, key: 'white',
  },
  'fig-relieved': {
    src: '/images/fig-relieved.png', width: 482, height: 1400,
    ratio: '3:4',
    alt: 'The same business owner standing upright, the notice resolved',
    decorative: false, key: 'white',
  },
  'fig-couple-shop': {
    src: '/images/fig-couple-shop.png', width: 1400, height: 1001,
    ratio: '3:4',
    alt: 'Two partners running a shop together, the typical partnership firm client',
    decorative: false, key: 'white',
  },
  'fig-accountant-desk': {
    src: '/images/fig-accountant-desk.png', width: 1400, height: 1102,
    ratio: '3:4',
    alt: 'A desk buried under files, the state of records before a filing deadline',
    decorative: false, key: 'white',
  },
  'fig-handshake': {
    src: '/images/fig-handshake.png', width: 1400, height: 1297,
    ratio: '3:4',
    alt: 'Two people shaking hands at the start of an engagement',
    decorative: false, key: 'white',
  },
  'fig-walking-row': {
    src: '/images/fig-walking-row.png', width: 2400, height: 715,
    ratio: '16:9',
    alt: '', decorative: true, key: 'white',
  },

  // ── Photographic cut-outs — decorative collage, screen readers skip these ────
  'cut-rupee-500':      { src: '/images/cut-rupee-500.png',      width: 1000, height: 523, ratio: '1:1', alt: '', decorative: true, key: 'magenta' },
  'cut-rupee-crumpled': { src: '/images/cut-rupee-crumpled.png', width: 1000, height: 565, ratio: '1:1', alt: '', decorative: true, key: 'magenta' },
  'cut-coin-stack':     { src: '/images/cut-coin-stack.png',     width: 1000, height: 629, ratio: '1:1', alt: '', decorative: true, key: 'magenta' },
  'cut-revenue-stamp':  { src: '/images/cut-revenue-stamp.png',  width: 1000, height: 607, ratio: '1:1', alt: '', decorative: true, key: 'magenta' },
  'cut-rubber-stamp':   { src: '/images/cut-rubber-stamp.png',   width: 1000, height: 779, ratio: '1:1', alt: '', decorative: true, key: 'magenta' },
  'cut-brass-seal':     { src: '/images/cut-brass-seal.png',     width: 1000, height: 775, ratio: '1:1', alt: '', decorative: true, key: 'magenta' },
  'cut-paperclip':      { src: '/images/cut-paperclip.png',      width: 1000, height: 588, ratio: '1:1', alt: '', decorative: true, key: 'magenta' },
  'cut-file-folder':    { src: '/images/cut-file-folder.png',    width: 1000, height: 526, ratio: '1:1', alt: '', decorative: true, key: 'magenta' },
  'cut-calculator':     { src: '/images/cut-calculator.png',     width: 1000, height: 547, ratio: '1:1', alt: '', decorative: true, key: 'magenta' },
  'cut-ledger-book':    { src: '/images/cut-ledger-book.png',    width: 1000, height: 548, ratio: '1:1', alt: '', decorative: true, key: 'magenta' },

  // ── Surfaces — decorative ────────────────────────────────────────────────────
  'tex-ink-blot':  { src: '/images/tex-ink-blot.png',  width: 800,  height: 620, ratio: '1:1',  alt: '', decorative: true, key: 'white' },
  'tex-torn-edge': { src: '/images/tex-torn-edge.png', width: 2400, height: 340, ratio: '16:9', alt: '', decorative: true, key: 'white' },

  // ── Document spreads — meaningful, they show what the guides contain ─────────
  'spread-filing-calendar': {
    src: '/images/spread-filing-calendar.jpg', width: 1600, height: 1194,
    ratio: '4:3',
    alt: 'A printed compliance calendar showing filing dates across the year',
    decorative: false, key: 'none',
  },
  'spread-penalty-table': {
    src: '/images/spread-penalty-table.jpg', width: 1600, height: 872,
    ratio: '4:3',
    alt: 'A printed table setting out late fees and interest by return type',
    decorative: false, key: 'none',
  },
  'spread-gst-flow': {
    src: '/images/spread-gst-flow.jpg', width: 1600, height: 872,
    ratio: '4:3',
    alt: 'A flowchart of the GST registration and return filing sequence',
    decorative: false, key: 'none',
  },
  'spread-itr-forms': {
    src: '/images/spread-itr-forms.jpg', width: 1600, height: 872,
    ratio: '4:3',
    alt: 'A comparison of income tax return forms and who each one applies to',
    decorative: false, key: 'none',
  },
  'spread-appeal-process': {
    src: '/images/spread-appeal-process.jpg', width: 1600, height: 872,
    ratio: '4:3',
    alt: 'A timeline of the appeal process from assessment order to hearing',
    decorative: false, key: 'none',
  },
  'spread-iec-checklist': {
    src: '/images/spread-iec-checklist.jpg', width: 1600, height: 872,
    ratio: '4:3',
    alt: 'A printed checklist of documents required for import-export registration',
    decorative: false, key: 'none',
  },

  // ── Guide covers — meaningful ────────────────────────────────────────────────
  'cover-entity-formation': {
    src: '/images/cover-entity-formation.jpg', width: 1200, height: 896,
    ratio: '4:3',
    alt: 'The guide to registering a business entity in India',
    decorative: false, key: 'none',
  },
  'cover-gst-compliance': {
    src: '/images/cover-gst-compliance.jpg', width: 1200, height: 896,
    ratio: '4:3',
    alt: 'The GST compliance guide for a growing business',
    decorative: false, key: 'none',
  },
  'cover-tax-notices': {
    src: '/images/cover-tax-notices.jpg', width: 1200, height: 654,
    ratio: '4:3',
    alt: 'The guide to responding to income tax notices',
    decorative: false, key: 'none',
  },
  'cover-exporter': {
    src: '/images/cover-exporter.jpg', width: 1200, height: 654,
    ratio: '4:3',
    alt: "The first-time exporter's compliance guide",
    decorative: false, key: 'none',
  },

  // ── Social and icons — decorative ────────────────────────────────────────────
  'og-default':  { src: '/images/og-default.jpg',  width: 1200, height: 630,  ratio: '16:9', alt: '', decorative: true, key: 'none' },
  'og-service':  { src: '/images/og-service.jpg',  width: 1200, height: 630,  ratio: '16:9', alt: '', decorative: true, key: 'none' },
  'favicon-src': { src: '/images/favicon-src.png', width: 1024, height: 1024, ratio: '1:1',  alt: '', decorative: true, key: 'none' },
  'apple-touch': { src: '/images/apple-touch.png', width: 180,  height: 180,  ratio: '1:1',  alt: '', decorative: true, key: 'none' },
} as const satisfies Record<string, Asset>

/** Returns the asset, or undefined for an unknown key — never throws. */
export function getAsset(key: string): Asset | undefined {
  return (ASSETS as Record<string, Asset>)[key]
}

/** A missing asset must degrade quietly, never crash a page. */
export function assetExists(key: string): boolean {
  return key in ASSETS
}

export const ASSET_COUNT = Object.keys(ASSETS).length
