# Compliance in Check

"Compliance in Check" is a modern, high-performance web application designed for a GST, Tax, and Compliance Practice. Built on Next.js App Router and optimized for both Generative Engine Optimization (GEO) and Core Web Vitals, it treats tax compliance like a game of chess—proactive, strategic, and definitive.

## The Three-Agent Workflow

This repository is built using a highly structured 20-phase, parallel 3-agent workflow:
- **Agent A (Architect):** Handles Next.js core, routing, 3D assets, components, state, and `package.json`.
- **Agent B (Content & SEO Engineer):** Responsible for editorial strategy, MDX pages, SEO data, and runbooks (you are reading an Agent B file).
- **Agent C (Data & Copy Hand):** Focuses on JSON/TS data files, checklists, FAQs, and tightly constrained structured data.

Each agent operates strictly within its designated folder ownership. If an agent needs a file modified outside its zone, it leaves a request in `HANDOFF.md`.

## Running Locally

To run the Next.js frontend locally:

Everything runs from the repository root — there is no separate frontend folder.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

For further information regarding content and deployment strategy, please refer to:
- [Deployment Runbook](./DEPLOYMENT.md) - A zero-assumed-knowledge guide for setting up the Vercel deployment, environments, and domain mapping.
- [Content Strategy](./CONTENT-STRATEGY.md) - The editorial spine detailing service mappings, keyword SEO, interlinking, and AI-optimized quotable statistics.
