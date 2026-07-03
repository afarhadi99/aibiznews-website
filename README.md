# AIBIZ.NEWS

Markdown-powered news site for technology business articles, audio narration, newsletter signups, and related channel links.

## Content

- Articles live in `content/articles/*.md`.
- Cover images live in `public/images/covers/`.
- Each article uses frontmatter for category, tags, cover image, audio, and related channel links.
- Pixio cover generation is available with `npm run covers:pixio` and targets Nano Banana 2 by default.
- Full story packages are generated from `C:\Users\alish\Desktop\youtube-automation`.

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

Current verified production URL:

```text
https://aibiznews-website.vercel.app
```

Use that URL for platform metadata until `https://aibiznews.com` is confirmed to serve this same Vercel deployment.

## Production System

The full research-to-publishing workflow is documented in `production-system/`.

Start with:

```text
production-system/README.md
production-system/RUNBOOK.md
production-system/QUALITY-GATES.md
```

That folder explains how the automation at `C:\Users\alish\Desktop\youtube-automation` creates research, articles, Pixio images, Pixio Gemini TTS voiceovers, final videos, blog assets, and YouTube/TikTok publishing records.

## Newsletter

Set one of these environment variables before deploying newsletter signups:

- `DATABASE_URL`
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`

The app writes signups to the `newsletter_subscribers` table. The schema is also available at `db/schema.sql`.
