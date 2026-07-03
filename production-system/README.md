# AIBIZ.NEWS Production System

This folder is the operating manual for taking a technology business story from research to finished public assets:

- researched story brief
- source-backed article
- generated cover and video images
- Pixio Gemini TTS voiceover
- vertical short-form video
- metadata for YouTube and TikTok
- synced website article with audio
- scheduled or published platform posts

No secrets belong in this repo. Keep API keys in local `.env` files only.

## Project Locations

| Area | Local path | Purpose |
| --- | --- | --- |
| Automation | `C:\Users\alish\Desktop\youtube-automation` | Research, article draft, Pixio images, Pixio TTS audio, video rendering, metadata, browser publishing |
| Website | `C:\Users\alish\Documents\GitHub\aibiznews-website` | Public site, article markdown, cover images, audio, newsletter signup |
| Story folders | `C:\Users\alish\Desktop\youtube-automation\videos\{number}-{slug}` | One folder per story package |
| Articles | `content\articles\*.md` | Public article source files |
| Covers | `public\images\covers\*.jpg` | Article and social cover images |
| Audio | `public\audio\*.wav` or `*.mp3` | Narrated article audio files |

Current public site URL:

```text
https://aibiznews-website.vercel.app
```

Use this until `aibiznews.com` is verified to map to this Vercel project.

## Story Folder Standard

```text
videos/{number}-{story-slug}/
  research/sources.json
  article/article.md
  images/cover.jpg
  images/image_1.jpg
  images/image_2.jpg
  images/image_3.jpg
  images/image_4.jpg
  images/image_5.jpg
  script/script.txt
  voiceover/voiceover.wav
  video/final_video.mp4
  metadata/metadata.json
  metadata/run_record.json
```

## Fast Commands

Run from the automation folder:

```powershell
cd C:\Users\alish\Desktop\youtube-automation
```

Create one full asset package and sync to the website repo, without platform upload:

```powershell
python daily_automation.py --count 1 --live --no-publish --website-repo "C:\Users\alish\Documents\GitHub\aibiznews-website"
```

Create ten packages:

```powershell
python daily_automation.py --count 10 --live --no-publish --website-repo "C:\Users\alish\Documents\GitHub\aibiznews-website"
```

Deploy website:

```powershell
cd C:\Users\alish\Documents\GitHub\aibiznews-website
npm run build
git add .
git commit -m "Add AIBIZ story"
git push origin main
npx vercel --prod --yes
```

## Required Environment

```env
PIXIO_API_KEY=...
VOICEOVER_PROVIDER=pixio
PIXIO_TTS_MODEL=pixio/gemini-3.1-flash-tts-preview
PIXIO_IMAGE_MODEL=nano banana 2
PIXIO_PREFERRED_MODEL=nano banana 2
WEBSITE_REPO_PATH=C:\Users\alish\Documents\GitHub\aibiznews-website
PUBLIC_SITE_URL=https://aibiznews-website.vercel.app
DAILY_POST_TIMES=06:00,08:00,10:00,12:00,14:00,16:00,18:00,20:00,22:00,23:59
```

For live publishing:

```env
AUTOMATION_LIVE_POSTING=true
BROWSER_PROFILE_DIR=C:\Users\alish\Desktop\youtube-automation\browser-profile
```

Live browser publishing requires logged-in YouTube Studio and TikTok Studio sessions. Codex Chrome upload also requires Chrome extension file URL access.

## Read These In Order

1. [RUNBOOK.md](RUNBOOK.md)
2. [QUALITY-GATES.md](QUALITY-GATES.md)
3. [templates/story-brief.md](templates/story-brief.md)
4. [templates/article.md](templates/article.md)
5. [templates/voiceover-script.txt](templates/voiceover-script.txt)
6. [templates/asset-manifest.md](templates/asset-manifest.md)
7. [templates/publishing-log.md](templates/publishing-log.md)

## Definition Of Done

A story is done only when all of these exist:

- Multiple credible sources.
- Website article with source links at the bottom.
- Generated cover and vertical video images.
- Pixio Gemini TTS voiceover.
- Rendered `final_video.mp4`.
- Platform metadata with no source URLs.
- Matching website article, cover, and audio in this repo.
- Website build and production deploy completed if the story is public.
- YouTube/TikTok status captured in `metadata/run_record.json` or `published/publish-log.md`.
