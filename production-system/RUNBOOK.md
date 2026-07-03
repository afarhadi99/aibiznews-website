# Runbook: Research To End Product

Use this for manual review and for debugging automation runs.

## 0. Setup

```powershell
cd C:\Users\alish\Desktop\youtube-automation
pip install -r requirements.txt
python -m playwright install chromium
```

Required local environment:

```env
PIXIO_API_KEY=...
VOICEOVER_PROVIDER=pixio
PIXIO_TTS_MODEL=pixio/gemini-3.1-flash-tts-preview
PIXIO_IMAGE_MODEL=nano banana 2
WEBSITE_REPO_PATH=C:\Users\alish\Documents\GitHub\aibiznews-website
PUBLIC_SITE_URL=https://aibiznews-website.vercel.app
YOUTUBE_STUDIO_CHANNEL_URL=https://studio.youtube.com/channel/UCw_IqppHVBdxVuwf-1CtIkA
TIKTOK_UPLOAD_URL=https://www.tiktok.com/tiktokstudio/upload?from=creator_center&tab=video
DAILY_POST_TIMES=06:00,08:00,10:00,12:00,14:00,16:00,18:00,20:00,22:00,23:59
```

For browser publishing:

```env
AUTOMATION_LIVE_POSTING=true
BROWSER_PROFILE_DIR=C:\Users\alish\Desktop\youtube-automation\browser-profile
```

Chrome/Codex uploads require:

```text
chrome://extensions -> Codex extension -> Details -> Allow access to file URLs
```

## 1. Research

Current entry point:

```text
daily_automation.py -> src/news_research.py
```

Research rules:

- Cover technology business broadly, not AI-only.
- Prefer specific current events with named actors.
- Use multiple credible sources.
- Use distinct publishers and primary documents when possible; repeated articles from one publisher do not count as source diversity.
- Prefer primary filings/releases plus reputable business/tech press.
- Save source title, publisher, URL, date, and supported claim.

Reject:

- Generic trend recaps.
- One-source speculation.
- Thin product announcements with no business consequence.
- Duplicate stories.

## 2. Article

Entry point:

```text
src/content_writer.py
```

Outputs:

```text
videos/{number}-{slug}/article/article.md
content/articles/{slug}.md
```

Article requirements:

- Clear headline.
- Short description with business significance.
- Concrete details: companies, people, products, filings, prices, dates.
- Body explains what happened, why it matters, and what to watch next.
- Multiple source links in `## Sources`.
- No automation/process language.

Frontmatter:

```yaml
title:
slug:
date:
category:
description:
cover:
tags:
youtubeUrl:
tiktokUrl:
audioUrl:
sourceCount:
```

## 3. Images

Entry point:

```text
src/pixio_images.py
```

Defaults:

```env
PIXIO_IMAGE_MODEL=nano banana 2
```

Outputs:

```text
videos/{number}-{slug}/images/cover.jpg
videos/{number}-{slug}/images/image_1.jpg
...
public/images/covers/{slug}.jpg
```

Prompt rules:

- Name real companies, public figures, products, logos, and locations when relevant.
- Ask for editorial realism.
- Avoid text-heavy generated graphics.
- Cover: 16:9.
- Video images: 9:16.

## 4. Voiceover

Entry point:

```text
src/pixio_tts.py
```

Defaults:

```env
VOICEOVER_PROVIDER=pixio
PIXIO_TTS_MODEL=pixio/gemini-3.1-flash-tts-preview
```

Outputs:

```text
videos/{number}-{slug}/voiceover/voiceover.wav
public/audio/{slug}.wav
```

Voice rules:

- Rotate voice every run.
- Keep narration natural and around 45-60 seconds.
- Avoid spoken citations; keep source links in the article.
- Do not store signed Pixio output URLs.

## 5. Video

Entry point:

```text
src/video_generator.py
```

Output:

```text
videos/{number}-{slug}/video/final_video.mp4
```

Requirements:

- 1080x1920 vertical.
- MP4.
- Audio present.
- Visuals match narration.
- No obvious fake text, watermarks, bad crops, or black frames.

## 6. Metadata

Entry point:

```text
src/metadata_optimizer.py
```

Output:

```text
videos/{number}-{slug}/metadata/metadata.json
```

Rules:

- Link only to the live AIBIZ article URL.
- Do not include source URLs in platform metadata.
- YouTube title has no hashtags.
- YouTube description includes context, one article link, brand line, 3-4 hashtags.
- TikTok caption is concise and platform-native.

## 7. Story Tracker

Entry point:

```text
src/story_tracker.py
```

Outputs:

```text
tracking/aibiz_story_tracker.csv
tracking/aibiz_story_tracker.xlsx
```

Each story row must include description, category, entities, schedule time, source count, individual source publisher/title/URL fields, article URL, cover/audio/video paths, voice/model, YouTube and TikTok metadata, publish status, and notes.

Rebuild the formatted workbook:

```powershell
node tools\build_story_tracker_workbook.mjs
```

## 8. Website Build And Deploy

```powershell
cd C:\Users\alish\Documents\GitHub\aibiznews-website
npm run build
git status --short
git add .
git commit -m "Add AIBIZ story"
git push origin main
npx vercel --prod --yes
```

Verify:

- Article page returns 200.
- Cover returns 200.
- Audio returns 200.

## 9. Publishing

YouTube:

```text
https://studio.youtube.com/channel/UCw_IqppHVBdxVuwf-1CtIkA
```

TikTok:

```text
https://www.tiktok.com/tiktokstudio/upload?from=creator_center&tab=video
```

Run with upload enabled only after browser login and file upload are verified:

```powershell
python daily_automation.py --count 10 --live --website-repo "C:\Users\alish\Documents\GitHub\aibiznews-website"
```

Publishing records:

```text
videos/{number}-{slug}/metadata/run_record.json
logs/last_daily_run.json
```

## 10. Final Check

A finished public story has:

- Article live.
- Cover visible.
- Audio playable.
- Source links visible.
- Story tracker row complete.
- Final vertical video rendered.
- YouTube/TikTok published, scheduled, or blocker recorded.
