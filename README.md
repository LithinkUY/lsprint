<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

[![Deploy to GitHub Pages](https://github.com/LithinkUY/lsprint/actions/workflows/deploy.yml/badge.svg)](https://github.com/LithinkUY/lsprint/actions/workflows/deploy.yml)

- Live site: https://lithinkuy.github.io/lsprint/

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1nhRZofzGzrxWNVE17BJrViWFXCl41zhx

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy

This repo auto-deploys to GitHub Pages on each push to `master` using the workflow in `.github/workflows/deploy.yml`. The Vite base path is configured to `/lsprint/` for Pages.

If needed, trigger a manual deploy from the Actions tab: "Deploy to GitHub Pages" → Run workflow.

### Custom domain (optional)

To use a custom domain (e.g., `tudominio.com`):

- Set a repo Variable (Settings → Secrets and variables → Variables) named `CUSTOM_DOMAIN` with your domain name. The workflow will generate `dist/CNAME` automatically. Alternatively, you can add a `CNAME` file in the repo root.
- DNS: create a CNAME record pointing your subdomain (e.g. `www`) to `lithinkuy.github.io`. For apex domains, use ALIAS/ANAME if your DNS supports it, or A records to GitHub Pages IPs (see GitHub docs).
- After DNS propagates and a new deploy runs, GitHub Pages will issue HTTPS automatically.
