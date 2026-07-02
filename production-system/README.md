# AI Biz News Production System

This folder is the operating manual for taking an AI business story from research to finished assets:

- researched story brief
- source-backed article
- generated cover and video images
- ElevenLabs voiceover
- vertical short-form video
- metadata for YouTube and TikTok
- synced blog article with audio
- scheduled or published platform posts

It does not store secrets. Keep API keys in local `.env` files only.

## Project Locations

| Area | Local path | Purpose |
| --- | --- | --- |
| Automation | `C:\Users\alish\Desktop\youtube-automation` | Research, article draft, Pixio images, ElevenLabs audio, video rendering, metadata, browser publishing |
| Website | `C:\Users\alish\Documents\GitHub\aibiznews-website` | Public blog, article markdown, cover images, audio, newsletter signup |
| Generated story folders | `C:\Users\alish\Desktop\youtube-automation\videos\{number}-{slug}` | One folder per finished story package |
| Published website articles | `content\articles\*.md` | Blog article source files |
| Published cover images | `public\images\covers\*.jpg` | Article and social cover images |
| Published audio | `public\audio\*.mp3` | Narrated article audio files |

## One Story Folder Standard

Every story package should end up in this shape:

```text
videos/{number}-{story-slug}/
  research/
    research.json
    source-review.md
  article/
    article.md
  images/
    cover.jpg
    image_1.jpg
    image_2.jpg
    image_3.jpg
    image_4.jpg
    image_5.jpg
    image_6.jpg
  script/
    script.txt
  voiceover/
    voiceover.mp3
  video/
    final_video.mp4
  metadata/
    metadata.json
    run_record.json
  published/
    publish-log.md
```

## Fast Commands

Run these from the automation folder:

```powershell
cd C:\Users\alish\Desktop\youtube-automation
```

Dry run one story without paid generation or publishing:

```powershell
python daily_automation.py --count 1 --dry-run --no-publish --website-repo C:\Users\alish\Documents\GitHub\aibiznews-website
```

Create ten complete asset packages, sync articles/audio/covers to the blog, but do not publish:

```powershell
python daily_automation.py --count 10 --live --no-publish --website-repo C:\Users\alish\Documents\GitHub\aibiznews-website
```

Create ten complete asset packages and schedule through the browser:

```powershell
python daily_automation.py --count 10 --live --website-repo C:\Users\alish\Documents\GitHub\aibiznews-website
```

Before live publishing, set this in `C:\Users\alish\Desktop\youtube-automation\.env`:

```env
AUTOMATION_LIVE_POSTING=true
WEBSITE_REPO_PATH=C:\Users\alish\Documents\GitHub\aibiznews-website
PIXIO_IMAGE_MODEL=nano banana 2
DAILY_POST_TIMES=06:00,08:00,10:00,12:00,14:00,16:00,18:00,20:00,22:00,23:59
```

Also keep the required API keys in `.env`, not in Git:

```env
PIXIO_API_KEY=...
ELEVENLABS_API_KEY=...
PUBLIC_SITE_URL=...
```

## Read These In Order

1. [RUNBOOK.md](RUNBOOK.md) - exact process from research to finished posts.
2. [QUALITY-GATES.md](QUALITY-GATES.md) - what must be checked before anything goes live.
3. [templates/story-brief.md](templates/story-brief.md) - manual research brief format.
4. [templates/article.md](templates/article.md) - article/frontmatter format.
5. [templates/voiceover-script.txt](templates/voiceover-script.txt) - narration format.
6. [templates/asset-manifest.md](templates/asset-manifest.md) - one-page asset tracker.
7. [templates/publishing-log.md](templates/publishing-log.md) - publish record format.

## Definition Of Done

A story is done only when all of these exist:

- `research/research.json` with multiple credible sources
- `article/article.md` with source links at the bottom
- `images/cover.jpg` and video images generated with real people/companies/logos when relevant
- `voiceover/voiceover.mp3`
- `video/final_video.mp4`
- `metadata/metadata.json`
- matching website article in `content/articles`
- matching cover in `public/images/covers`
- matching audio in `public/audio`
- YouTube/TikTok status captured in `published/publish-log.md` or `metadata/run_record.json`
