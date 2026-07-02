# AI Biz News Network

Markdown-powered news site for AI business articles, audio narration, and related channel links.

## Content

- Articles live in `content/articles/*.md`.
- Cover images live in `public/images/covers/`.
- Each article uses frontmatter for category, tags, cover image, audio, and related channel links.

## Development

```bash
npm install
npm run dev
```

## Vercel

Import this repository in Vercel and use the default Next.js settings:

- Build command: `npm run build`
- Output: managed by Next.js

The content workflow syncs generated articles, cover images, and audio into this repo.
