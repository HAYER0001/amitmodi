# DEPLOYMENT RUNBOOK

This runbook covers the end-to-end process of deploying the "Compliance in Check" web application to Vercel, including setting up the GitHub repository, configuring environment variables, attaching a custom domain, and handling rollbacks.

## 1. Creating the GitHub Repository

We will create a GitHub repository to host the code and trigger Vercel deployments.

### Option A: Using the GitHub CLI (`gh`) - Recommended
1. **Authenticate the GitHub CLI**:
   ```bash
   gh auth login
   ```
   Follow the interactive prompts to authenticate via your web browser.

2. **Create the repository and push code**:
   ```bash
   # Run this from the root of your project
   gh repo create amitmodi-site --public --source=. --remote=origin --push
   ```

### Option B: Using the GitHub Web UI (Fallback)
If you don't have the `gh` CLI installed:
1. Go to [GitHub](https://github.com/new) and create a new repository (e.g., `amitmodi-site`).
2. Run the following commands in your local project root:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/amitmodi-site.git
   git branch -M main
   git push -u origin main
   ```

## 2. Connecting the Repository to Vercel

We use Vercel for zero-config deployments of our Next.js App Router application.

1. **Install the Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Authenticate with Vercel**:
   ```bash
   vercel login
   ```
   Select your preferred login method (e.g., GitHub).

3. **Link the project**:
   ```bash
   vercel link
   ```
   *Interactive Prompts:*
   - Set up and develop `~/path/to/amitmodi-site`? **Y**
   - Which scope do you want to deploy to? **(Select your team/personal account)**
   - Link to existing project? **N**
   - What's your project's name? **amitmodi-site**
   - In which directory is your code located? **./** (Leave as default, BUT see below)

   **CRITICAL SETTING:** Since Agent A is scaffolding the Next.js app into the `site/` subdirectory, Vercel needs to know this is the Root Directory. When configuring the project in the Vercel dashboard or CLI, ensure the **Root Directory** is explicitly set to `site`. If you miss this, the build will fail because it won't find `package.json`.

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## 3. Environment Variables

This project requires specific environment variables to function correctly. 

**CRITICAL RULE:** Never commit these values to git. Add them only to `.env.local` for local development, and the Vercel Dashboard (`Settings > Environment Variables`) for production.

| Variable Name | Required At | Where to Set | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Build time | Vercel UI | The production URL of the site (e.g., `https://www.yourdomain.com`). |
| `RESEND_API_KEY` | Runtime | Vercel UI | API key for Resend to send transactional emails (e.g., lead capture). |
| `CONTACT_TO_EMAIL` | Runtime | Vercel UI | The email address that receives the consultation form submissions. |
| `NEXT_PUBLIC_GA_ID` | Build time | Vercel UI | Google Analytics 4 Measurement ID (`G-XXXXXXXXXX`). |
| `NEXT_PUBLIC_GTM_ID` | Build time | Vercel UI | Google Tag Manager ID (if applicable). |

## 4. Custom Domain Configuration

To attach a custom domain, go to your Vercel Project Dashboard > **Settings** > **Domains**.

Add your domain (e.g., `example.com`). Vercel will recommend setting up the `www` subdomain and redirecting the apex (root) domain to it, or vice versa.

### DNS Records to Configure in your Domain Registrar

**1. Apex Domain Configuration (`example.com`)**
If you want users to visit `example.com` directly:
- **Type:** `A`
- **Name:** `@` (or leave blank, depending on registrar)
- **Value:** `76.76.21.21` (Vercel's Anycast IP)

**2. WWW Subdomain Configuration (`www.example.com`)**
If you want users to visit `www.example.com` directly:
- **Type:** `CNAME`
- **Name:** `www`
- **Value:** `cname.vercel-dns.com.`

*Best Practice:* Set `www.example.com` as your primary domain in Vercel, and configure `example.com` to redirect to `www.example.com` (Vercel does this automatically when you add both).

## 5. Rolling Back a Bad Deploy

If a deployment breaks production, you can roll back instantly from the Vercel Dashboard:

1. Go to your project on Vercel.
2. Click on the **Deployments** tab.
3. Find the previous successful deployment in the list.
4. Click the three dots (`...`) next to that deployment.
5. Select **Promote to Production** (or **Assign Custom Domains**).
6. Confirm the prompt.

The rollback is instantaneous because Vercel simply updates the routing at the Edge network to point to the previously built version.
