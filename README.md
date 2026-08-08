# Amit Modi & Associates - Tax Compliance Practice

This is the repository for "Compliance in Check", a high-performance Next.js 15 web application tailored for an Indian GST, Income Tax, and compliance practice.

## Overview

The site architecture focuses on:
- High Core Web Vitals (Edge caching, zero unused CSS, optimized static assets)
- Modern design aesthetics using a "Compliance in Check" theme with a ledger-inspired visual language
- Search engine optimization for LLMs and Generative AI (GEO)
- Automated deployment to Vercel

## The Three-Agent Workflow

This project is built using a coordinated, parallel AI agent workflow. The build is structured into 20 phases, each executed by three specialized agents simultaneously:
- **Agent A (Architect):** Handles hard architecture, animation, Next.js build config, state, and dependencies.
- **Agent B (Content & SEO Engineer):** Owns pages, Markdown content, schema markup, SEO, and the editorial spine.
- **Agent C (Data & Copy Hand):** Focuses on precise, mechanical data entry, typing constants, JSON structures, and data files.

## Documentation Reference

For more detailed information on specific areas, see the following documentation:
- [Deployment Runbook](./DEPLOYMENT.md) - A step-by-step guide for setting up GitHub, environment variables, and Vercel deployments.
- [Content Strategy](./CONTENT-STRATEGY.md) - The editorial spine detailing service mappings, internal linking, seasonal calendars, and quotable statistics.

## How to Run Locally

To spin up the development server locally:

1. **Install Dependencies:**
   Ensure you are in the `site/` subdirectory.
   ```bash
   cd site
   npm install
   ```

2. **Run the Development Server:**
   ```bash
   npm run dev
   ```

3. **View the Application:**
   Open your browser and navigate to `http://localhost:3000`.
