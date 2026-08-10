# Blog

An Astro blog with React islands, MDX posts, Tailwind CSS styling, Giscus comments, and automatic deployment to Cloudflare Pages via GitHub Actions.

## Tech stack

| Concern | Tool |
|---------|------|
| Framework | [Astro 6](https://astro.build) |
| Interactivity | [React 19](https://react.dev) (islands architecture) |
| Content | [MDX](https://mdxjs.com) via `@astrojs/mdx` |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Comments | [Giscus](https://giscus.app) |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) |
| CI/CD | GitHub Actions |

## Local development

```bash
npm install
npm run dev
```

Then open [http://localhost:4321](http://localhost:4321).

## Completing the setup

### 1. Giscus comments

GitHub Discussions is enabled on this repo and `src/components/GiscusComments.tsx` is configured to use the "Announcements" category. The only remaining step is to install the giscus GitHub App so it can create/read discussions on your behalf:

1. Go to <https://github.com/apps/giscus/installations/new>.
2. Choose the `AttilaMihaly/blog` repository (or "All repositories" if you prefer) and confirm.

If you ever need to reconfigure (different repo, category, or theme), rerun the wizard at <https://giscus.app> and update the props in `GiscusComments.tsx` accordingly.

### 2. Cloudflare Pages deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys to Cloudflare Pages on every push to `main`.

1. Create a Cloudflare Pages project named **blog** at <https://dash.cloudflare.com>.
   - Set the build command to `npm run build` and output directory to `dist`.
2. Generate a Cloudflare API token with **Cloudflare Pages: Edit** permissions at
   <https://dash.cloudflare.com/profile/api-tokens>.
3. Find your Account ID on the right-hand sidebar of the Cloudflare dashboard.
4. In your GitHub repository go to **Settings → Secrets and variables → Actions** and add:
   - `CLOUDFLARE_API_TOKEN` — the API token from step 2
   - `CLOUDFLARE_ACCOUNT_ID` — your Account ID from step 3

Push to `main` and the workflow will build and deploy automatically.

## Adding blog posts

Create a new `.mdx` file under `src/content/blog/`:

```mdx
---
title: "My Post Title"
description: "A short description shown on the index page."
pubDate: "2026-05-10"
---

Your content here. You can import and use React components as Astro islands:

import MyComponent from '../../components/MyComponent.tsx';

<MyComponent client:load />
```

The file name (without extension) becomes the URL slug, e.g. `my-post.mdx` → `/blog/my-post`.