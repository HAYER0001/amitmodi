export const HERO_LAYOUT = {
  cutouts: [
    { asset: 'cut-rupee-500', top: '18%', left: '8%', width: 220, rotate: -12, zIndex: 2 },
    { asset: 'cut-coin-stack', top: '62%', left: '78%', width: 180, rotate: 7, zIndex: 2 },
    { asset: 'cut-paperclip', top: '78%', left: '14%', width: 120, rotate: -28, zIndex: 1 },
  ],
  marginalia: [
    { top: '2%', left: '10%', rotate: -10 },
    { top: '8%', left: '30%', rotate: 14 },
    { top: '15%', left: '50%', rotate: -5 },
    { top: '5%', left: '70%', rotate: 12 },
    { top: '30%', left: '10%', rotate: 18 },
    { top: '25%', left: '40%', rotate: -12 },
    { top: '10%', left: '75%', rotate: -18 },
    { top: '80%', left: '45%', rotate: 15 },
    { top: '78%', left: '18%', rotate: -16 },
    { top: '50%', left: '85%', rotate: 8 },
  ],
  cornerLabels: [
    { position: 'bottom-left', key: 'practiceName' },
    { position: 'bottom-center', key: 'tagline' },
    { position: 'bottom-right', key: 'location' },
    { position: 'top-right', key: 'liveTime' },
  ],
} as const;

export const MOBILE_HERO_LAYOUT = {
  cutouts: [
    { asset: 'cut-rupee-500', top: '18%', left: '8%', width: 220, rotate: -12, zIndex: 2 },
  ],
  marginalia: [
    { top: '2%', left: '10%', rotate: -10 },
    { top: '8%', left: '30%', rotate: 14 },
    { top: '15%', left: '50%', rotate: -5 },
    { top: '5%', left: '70%', rotate: 12 },
  ],
  cornerLabels: [
    { position: 'bottom-left', key: 'practiceName' },
    { position: 'bottom-center', key: 'tagline' },
    { position: 'bottom-right', key: 'location' },
    { position: 'top-right', key: 'liveTime' },
  ],
} as const;
