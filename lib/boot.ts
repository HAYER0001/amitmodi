"use client";

/*
 * boot.ts — the shared state behind the boot screen's one trick: the chat
 * launcher's knight is the only knight on the page, and during load it fills
 * itself with brass as the page loads. This module hands the loading overlay's
 * progress MotionValue to the knight (which renders the fill) and lets the
 * knight's first rendered frame tell the overlay the reveal may proceed.
 */

import { motionValue, type MotionValue } from "framer-motion";

/** Fill 0..1 driven by the boot milestones. 0 = empty ghost knight, 1 = solid
    brass knight. Read by Model3D inside useFrame, so no re-renders. */
export const bootFill: MotionValue<number> = motionValue(0);

let readyHandler: (() => void) | null = null;

/** The loading overlay registers its completion handler here. */
export function setBootReadyHandler(handler: (() => void) | null) {
  readyHandler = handler;
}

/** Called by ChatLauncher when the knight's model renders its first frame —
    the fill is real, the reveal may proceed. */
export function notifyKnightReady() {
  readyHandler?.();
}
