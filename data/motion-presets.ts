// Only transform, opacity, filter and clip-path are animated here.
// Animating layout properties (width/height/top/left) is forbidden — it forces
// reflow on every frame and shows up directly in the INP metric.

export const PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, easing: [0.16, 1, 0.3, 1] },
  },
  fadeUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, easing: [0.16, 1, 0.3, 1] },
  },
  fadeDown: {
    initial: { opacity: 0, y: -24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, easing: [0.16, 1, 0.3, 1] },
  },
  fadeLeft: {
    initial: { opacity: 0, x: 32 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, easing: [0.16, 1, 0.3, 1] },
  },
  fadeRight: {
    initial: { opacity: 0, x: -32 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, easing: [0.16, 1, 0.3, 1] },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, easing: [0.16, 1, 0.3, 1] },
  },
  scaleOut: {
    initial: { opacity: 0, scale: 1.04 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, easing: [0.16, 1, 0.3, 1] },
  },
  maskUp: {
    initial: { clipPath: 'inset(100% 0 0 0)' },
    animate: { clipPath: 'inset(0% 0 0 0)' },
    transition: { duration: 1.0, easing: [0.16, 1, 0.3, 1] },
  },
  maskDown: {
    initial: { clipPath: 'inset(0 0 100% 0)' },
    animate: { clipPath: 'inset(0 0 0% 0)' },
    transition: { duration: 1.0, easing: [0.16, 1, 0.3, 1] },
  },
  blurIn: {
    initial: { opacity: 0, filter: 'blur(8px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 0.6, easing: [0.16, 1, 0.3, 1] },
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -3 },
    animate: { opacity: 1, rotate: 0 },
    transition: { duration: 0.6, easing: [0.16, 1, 0.3, 1] },
  },
  slowRise: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.6, easing: [0.16, 1, 0.3, 1] },
  },
  staggerParent: {
    initial: {},
    animate: {},
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
  staggerChild: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, easing: [0.16, 1, 0.3, 1] },
  },
} as const

export type PresetName = keyof typeof PRESETS
