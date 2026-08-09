# MOTION & INTERACTION RULES

This document serves as the absolute governing framework for all animation, transition, and motion decisions across the "Compliance in Check" web application. These rules are finalized decisions, documented here so later phases do not relitigate them.

## 1. The Global Easing Curve
There is exactly **one easing curve** for the entire project: `[0.16, 1, 0.3, 1]`. 

**Why:** A single, global easing curve is what makes a site feel *designed* rather than *assembled*. When every element accelerates and decelerates with the identical physical physics, the interface feels like a unified environment. Mixing cubic-beziers breaks this illusion immediately.

## 2. The Motion Budget
**No more than 3 animated elements may be active in any single viewport at one time.**

Complex, overlapping animations exhaust the user and degrade performance. A strict budget of three concurrent animations forces us to prioritize what actually matters on the screen. If a fourth thing needs to move, one of the first three must become static.

## 3. The Typography Rule
**Display type (`--font-display`) animates at most twice per page.**

Display typography is loud, authoritative, and demanding. If every headline flies in on scroll, the effect turns from impactful to annoying. Display type must remain an *event*. 

Furthermore, **no animation on anything a user is trying to read while it moves.** If it contains body copy, it must finish its entry animation *before* the user's eye begins to parse the words.

## 4. The Hover Rule
**Hover effects never move layout.**

When a user hovers over a button, card, or link, it may only change color, opacity, or a CSS transform (like a slight scale or translation that does not affect document flow). Hover states must never alter `width`, `height`, `margin`, `padding`, or `border-width` in a way that shifts surrounding elements.

## 5. The Four Legitimate Jobs of Motion
Every animation must justify its existence. If an animation does none of the following four jobs, it gets deleted:

1. **Directing Attention:** Guiding the user's eye to the primary action or a critical penalty warning.
2. **Showing Spatial Relationship:** Explaining where an element came from or where it went (e.g., an accordion expanding to reveal content).
3. **Giving Feedback:** Confirming a user's action (e.g., a button's magnetic pull or a form's success state).
4. **Expressing Brand at Moments of Transition:** Using the brief window during page loads or section transitions to reinforce the calm, strategic aesthetic of the practice.

## 6. Motion Quality = Search Ranking (Core Web Vitals)
Motion is an SEO concern. Scroll-linked animations that force the browser to recalculate layout on the main thread will ruin the site's **Interaction to Next Paint (INP)** score. 

INP is a direct Google search ranking signal. If an animation causes layout thrashing, the site feels sluggish to the user and is actively penalized by search engines. Therefore, motion quality and search ranking are the exact same problem here, not competing concerns. All animations must be hardware-accelerated (`transform` and `opacity` only) to preserve our INP score and protect our organic search traffic.
