# AI Biz News Network

Markdown-powered news site for AI business articles, audio narration, newsletter signups, and related channel links.

## Content

- Articles live in `content/articles/*.md`.
- Cover images live in `public/images/covers/`.
- Each article uses frontmatter for category, tags, cover image, audio, and related channel links.
- Pixio cover generation is available with `npm run covers:pixio` and targets Nano Banana 2 by default.

## Development

```bash
npm install
npm run dev
```

To regenerate article covers, set `PIXIO_API_KEY` locally, then run:

```bash
npm run covers:pixio:force
```

## Vercel

Import this repository in Vercel and use the default Next.js settings:

- Build command: `npm run build`
- Output: managed by Next.js

Articles, cover images, and audio live in this repo with the site code.

## Newsletter

Set one of these environment variables before deploying newsletter signups:

- `DATABASE_URL`
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`

The app writes signups to the `newsletter_subscribers` table. The schema is also available at `db/schema.sql`.
