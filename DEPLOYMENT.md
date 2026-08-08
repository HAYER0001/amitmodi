# Deployment Runbook

This guide covers the complete deployment process, from GitHub creation to going live on Vercel.

## 1. Creating the GitHub Repository

We use the GitHub CLI (`gh`) for seamless repository creation.

**Authenticate with GitHub CLI:**
If this is your first time using `gh`, you must authenticate:
```bash
gh auth login
```
Follow the interactive prompts to log in via your web browser.

**Create the Repository:**
```bash
gh repo create amitmodi-site --public --source=. --remote=origin
```
*(You can use `--private` if you prefer a private repository.)*

**Fallback (if `gh` is not installed):**
1. Go to https://github.com/new and create a new repository named `amitmodi-site`.
2. In your local terminal, link it and push:
```bash
git remote add origin https://github.com/<your-username>/amitmodi-site.git
git push -u origin main
```

## 2. Connecting to Vercel

We deploy to Vercel for zero-config serverless hosting and Edge caching.

**Install Vercel CLI:**
```bash
npm i -g vercel
```

**Log in to Vercel:**
```bash
vercel login
```

**Link and Deploy:**
Run the following command at the repository root:
```bash
vercel link
```

**CRITICAL: Vercel Interactive Prompts**
When you run `vercel link` or `vercel`, you will be asked a series of questions. Answer exactly as follows:
- Set up and deploy? **Y**
- Which scope do you want to deploy to? **(Select your account)**
- Link to existing project? **N**
- What's your project's name? **amitmodi-site**
- In which directory is your code located? **./site** *(THIS IS CRUCIAL! Do not accept the default `./`. The Next.js app lives in the `site` subdirectory.)*
- Auto-detected Project Settings (Next.js): **Leave as defaults**

**Deploy to Production:**
Once linked, trigger a production deployment:
```bash
vercel --prod
```

## 3. Environment Variables

This project requires specific environment variables to function correctly. 
**NEVER commit these values to git.** They should be stored in `.env.local` for local development and entered securely in the Vercel dashboard.

| Variable Name | Purpose | Required At | Where Set |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The base URL of the site (e.g., https://amitmodi.com) | Build/Runtime | Vercel (Production/Preview), `.env.local` (Local) |
| `RESEND_API_KEY` | API key for Resend to send transactional emails (forms) | Runtime | Vercel (Production), `.env.local` (Local) |
| `CONTACT_TO_EMAIL` | The practice's email address receiving form submissions | Runtime | Vercel (Production), `.env.local` (Local) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID | Runtime | Vercel (Production), `.env.local` (Local) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager Container ID | Runtime | Vercel (Production), `.env.local` (Local) |

To add these in Vercel:
Go to **Project Settings > Environment Variables** in the Vercel Dashboard and paste the keys and values.

## 4. Custom Domain Attachment

To use a custom domain (e.g., `amitmodi.com`), configure it in Vercel and your DNS provider.

1. Go to **Project Settings > Domains** in the Vercel Dashboard.
2. Enter your domain (e.g., `amitmodi.com`).
3. Vercel will recommend adding the `www` subdomain and setting one to redirect to the other (usually `www` redirects to the apex domain).

**DNS Records:**
You must configure the following records with your DNS registrar (e.g., GoDaddy, Namecheap, Cloudflare):

| Type | Name | Value | Purpose |
| --- | --- | --- | --- |
| A | `@` (Apex) | `76.76.21.21` | Points the apex domain (`amitmodi.com`) to Vercel |
| CNAME | `www` | `cname.vercel-dns.com.` | Points `www.amitmodi.com` to Vercel |

*(Note: Vercel will automatically provision SSL certificates once DNS propagates.)*

## 5. Rollback a Bad Deploy

If a deployment breaks production, you can revert instantly without waiting for a new build.

1. Open the Vercel Dashboard and go to the **Deployments** tab.
2. Find the previous successful deployment that you want to restore.
3. Click the three dots (`...`) next to that deployment.
4. Select **Assign Custom Domains** or **Promote to Production** (depending on the project setup).
5. Confirm. The rollback takes effect in under a minute via Vercel's Edge Network.
