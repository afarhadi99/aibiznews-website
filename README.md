# AI Biz News Network

Markdown-powered news site for AI business videos and articles.

## Content

- Articles live in `content/articles/*.md`.
- Cover images live in `public/images/covers/`.
- Each article uses frontmatter for category, tags, cover, and video links.

## Development

```bash
npm install
npm run dev
```

## Vercel

Import this repository in Vercel and use the default Next.js settings:

- Build command: `npm run build`
- Output: managed by Next.js

The video automation syncs generated articles and cover images into this repo.
