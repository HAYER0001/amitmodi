# DESIGN SYSTEM & STYLEGUIDE

This document outlines the design system for the "Compliance in Check" web application, defining the visual language, typography, color usage rules, and accessibility standards.

## 1. Concept Translation

The visual identity is based on translating a chess metaphor into tax compliance vocabulary, presenting the practice as strategic and proactive.

| Reference Used | Our Translation |
| :--- | :--- |
| Chessboard grid background | **Ledger grid** — accountant's ruled paper, same faint 8×8 feel |
| Chess notation marginalia (`Nf3`, `Bc4`) | **Statute marginalia** — `Sec 44AB`, `GSTR-3B`, `Form 26AS`, `Rule 46`, `u/s 139(1)` in pencil, scattered, low opacity, slightly rotated |
| Floating cut-out dollar bills | **Cut-out ₹500 notes, revenue stamps, brass seals, a steel paperclip** — desaturated, drop-shadowed |
| Hand-drawn ink figures | **Indian business owners** — shopkeeper, exporter, textile trader, startup founder — same sketchy ink line style |
| Book-spread horizontal gallery | **Compliance-guide spreads** — filing calendars, penalty tables, flowcharts |
| Chess knight hero object | **Brass chess knight on a ledger board**, rupee coins as pawns (3D) |
| "The Book" / "The Author" | **"The Practice" / "The Principal"** |
| Emerald green | Kept exactly — reads as both money and "cleared/approved" |

## 2. Usage Rules

### The Display Type Rule
**The `--font-display` (Instrument Serif) must be used at most twice per page.** 
It should be reserved exclusively for massive, high-contrast headline statements (like the H1 and Hero text). Display type must stay an *event* rather than becoming a repetitive texture throughout the page.

### The `--stamp` Color Rule
**The `--stamp` (#B3392B) color is reserved exclusively for deadlines, penalties, and warnings.**
It must *never* be used for decoration, general buttons, or accents. When users see `--stamp`, it should instantly communicate a compliance risk, a looming due date, or a statutory penalty.

## 3. Marginalia Vocabulary

The `.marginalia` class is used to scatter faded, rotated, handwritten text across the background (`.ledger-grid`). Use the following 30 real statute and form references to create this texture. Never invent references or use lorem ipsum.

1. `Sec 44AB`
2. `GSTR-3B`
3. `Form 26AS`
4. `Rule 46`
5. `u/s 139(1)`
6. `ITC-04`
7. `Form 16`
8. `Form 16A`
9. `GSTR-1`
10. `GSTR-9`
11. `GSTR-9C`
12. `Sec 80C`
13. `Sec 194J`
14. `Sec 194C`
15. `Sec 234A`
16. `Sec 234B`
17. `Sec 234C`
18. `Form 3CD`
19. `Form 10B`
20. `DRC-01`
21. `DRC-03`
22. `AS-26`
23. `GSTR-2A`
24. `GSTR-2B`
25. `Sec 12A`
26. `Sec 80G`
27. `Rule 42`
28. `Rule 43`
29. `ITR-1`
30. `ITR-4`

## 4. Accessibility Contract

Every component built in this project must strictly adhere to the following accessibility guarantees:

- **Touch Targets:** All clickable and interactive elements must have a minimum touch target size of 44×44px.
- **Visible Focus:** Every interactive element must have a clear, visible focus state for keyboard navigation (never `outline: none` without a custom focus ring).
- **Color Independence:** Any meaning communicated by color (like `--stamp` for errors, or `--seal` for success) must also be conveyed through text or a supplementary icon. Color cannot be the only visual means of conveying information.
- **Keyboard Operability:** Full keyboard operability is required. Users must be able to navigate, interact with, and submit every form and component built in later phases using only the keyboard.
