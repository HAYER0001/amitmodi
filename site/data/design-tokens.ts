export const tokens = Object.freeze({
  colors: {
    paper: "#EFEDE8",
    paperDeep: "#E4E1DA",
    ink: "#14140F",
    inkSoft: "#55534B",
    rule: "#D9D6CE",
    seal: "#0A6B4E",
    sealDeep: "#064834",
    stamp: "#B3392B",
    brass: "#A8842C",
    night: "#12130F",
  },
  fonts: {
    display: "var(--font-display)",
    body: "var(--font-body)",
    label: "var(--font-label)",
    margin: "var(--font-margin)",
  },
  ease: {
    standard: [0.16, 1, 0.3, 1],
  },
  radius: {
    sm: "2px",
    md: "6px",
    pill: "999px",
  },
} as const);

export type TokenColor = keyof typeof tokens["colors"];
