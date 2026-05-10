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

1. Go to <https://giscus.app> and follow the configuration wizard for your repository.
2. The wizard will give you values for `repo`, `repoId`, `category`, and `categoryId`.
3. Open `src/components/GiscusComments.tsx` and replace the placeholder strings:

```tsx
// Before
repo="OWNER/REPO"
repoId="REPO_ID"
category="Announcements"
categoryId="CATEGORY_ID"

// After (example)
repo="AttilaMihaly/blog"
repoId="R_kgDO..."
category="General"
categoryId="DIC_kwDO..."
```

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