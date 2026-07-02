# Runbook: Research To End Product

This is the daily operating path. Use it for manual review and for debugging the automation.

## 0. Setup

From the automation repo:

```powershell
cd C:\Users\alish\Desktop\youtube-automation
pip install -r requirements.txt
python -m playwright install chromium
```

Required local environment:

```env
PIXIO_API_KEY=...
PIXIO_IMAGE_MODEL=nano banana 2
ELEVENLABS_API_KEY=...
WEBSITE_REPO_PATH=C:\Users\alish\Documents\GitHub\aibiznews-website
PUBLIC_SITE_URL=...
YOUTUBE_STUDIO_CHANNEL_URL=https://studio.youtube.com/channel/UCw_IqppHVBdxVuwf-1CtIkA
TIKTOK_UPLOAD_URL=https://www.tiktok.com/tiktokstudio/upload?from=creator_center&tab=video
DAILY_POST_TIMES=06:00,08:00,10:00,12:00,14:00,16:00,18:00,20:00,22:00,23:59
```

For live browser scheduling:

```env
AUTOMATION_LIVE_POSTING=true
BROWSER_PROFILE_DIR=browser-profile
```

Open the browser profile once and confirm YouTube Studio and TikTok Studio are logged in.

## 1. Research

Automation entry point:

```text
daily_automation.py -> src/news_research.py
```

Expected output:

```text
videos/{number}-{slug}/research/research.json
```

Research rules:

- Use multiple credible sources for each story.
- Prefer official company posts, SEC filings, earnings calls, reputable business press, technical docs, and regulator/public-sector pages.
- Do not use one-source stories unless they are clearly labeled as a developing report.
- Capture the business consequence, not just the announcement.
- Save source title, publisher, URL, date, and the specific claim supported.

Manual review:

1. Open `research/research.json`.
2. Confirm there are enough credible sources.
3. Check dates and avoid stale stories unless they are background context.
4. Add notes to `research/source-review.md` if facts need correction.

## 2. Story Selection

Automation picks stories with:

```text
discover_ai_business_stories(count)
```

Good stories usually include one of these:

- company strategy shift
- product launch with business impact
- funding, earnings, valuation, or customer traction
- chip, data center, power, or infrastructure constraint
- policy, copyright, labor, safety, or legal development
- competitive movement between major AI companies

Reject stories that are:

- generic AI trend recaps
- thin announcements with no business consequence
- unsourced speculation
- duplicates of a recently published article

## 3. Article

Automation entry point:

```text
daily_automation.py -> src/content_writer.py -> draft_article()
```

Generated output:

```text
videos/{number}-{slug}/article/article.md
```

Website sync:

```text
src/blog_sync.py -> content/articles/{slug}.md
```

Article requirements:

- Clear headline.
- Short description explaining the business significance.
- Body that answers: what happened, why it matters, who is affected, what to watch next.
- Multiple credible source links at the bottom.
- No automation/process language on the public website.
- No vague filler like "AI is changing everything" unless supported by a specific fact.

Website frontmatter must include:

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
videoStatus:
sourceCount:
```

## 4. Images

Automation entry point:

```text
daily_automation.py -> src/pixio_images.py
```

Generated outputs:

```text
videos/{number}-{slug}/images/cover.jpg
videos/{number}-{slug}/images/image_1.jpg
...
videos/{number}-{slug}/images/image_6.jpg
```

Current default:

```env
PIXIO_IMAGE_MODEL=nano banana 2
```

Prompt rules:

- If a story mentions real people, real companies, products, or recognizable locations, name them in the prompt.
- Ask for accurate real-world likeness and brand context when editorially relevant.
- Avoid fake text, fake logos, watermarks, generic server rooms, stock-photo framing, and poster layouts.
- Cover image is landscape `16:9`.
- Video images are vertical `9:16`.

Website sync:

```text
public/images/covers/{slug}.jpg
```

## 5. Voiceover

Automation entry point:

```text
daily_automation.py -> src/voiceover.py
```

Inputs:

```text
videos/{number}-{slug}/script/script.txt
```

Output:

```text
videos/{number}-{slug}/voiceover/voiceover.mp3
```

Website sync:

```text
public/audio/{slug}.mp3
```

Voiceover requirements:

- 45-60 seconds for Shorts/TikTok unless intentionally changed.
- Script should read naturally aloud.
- Avoid dense source names in the narration; keep citations in the article.
- Confirm no mispronounced names in critical stories.

## 6. Video

Automation entry point:

```text
daily_automation.py -> src/video_generator.py
```

Inputs:

```text
images/*.jpg
voiceover/voiceover.mp3
script/script.txt
```

Output:

```text
videos/{number}-{slug}/video/final_video.mp4
```

Video requirements:

- Vertical `1080x1920`.
- Images should match the topic and story order.
- Animations should support the narration, not distract from it.
- Audio must be synced and clear.
- No visible fake text/logos/watermarks from generated images.

## 7. Metadata

Automation entry point:

```text
daily_automation.py -> src/metadata_optimizer.py
```

It also checks benchmark videos through:

```text
src/trend_research.py -> most_viewed_youtube_videos()
```

Output:

```text
videos/{number}-{slug}/metadata/metadata.json
```

Metadata must include:

- YouTube title under platform limits.
- YouTube description with article link and source context.
- TikTok caption with concise hook and relevant hashtags.
- Tags that match the actual story.
- Cross-link to the website article when available.

## 8. Website Sync

Automation entry point:

```text
src/blog_sync.py -> sync_article_to_blog()
```

Outputs in the website repo:

```text
content/articles/{slug}.md
public/images/covers/{slug}.jpg
public/audio/{slug}.mp3
```

After sync:

```powershell
cd C:\Users\alish\Documents\GitHub\aibiznews-website
npm run build
git status --short
git add content/articles public/images/covers public/audio
git commit -m "Add AI Biz News story assets"
git push origin main
```

## 9. Publishing

Dry run publishing records status without opening live upload flows:

```powershell
python daily_automation.py --count 1 --dry-run --website-repo C:\Users\alish\Documents\GitHub\aibiznews-website
```

Live scheduling:

```powershell
python daily_automation.py --count 10 --live --website-repo C:\Users\alish\Documents\GitHub\aibiznews-website
```

Publishing entry point:

```text
src/browser_publisher.py
```

Platforms:

- YouTube Studio channel: `https://studio.youtube.com/channel/UCw_IqppHVBdxVuwf-1CtIkA`
- TikTok Studio upload: `https://www.tiktok.com/tiktokstudio/upload?from=creator_center&tab=video`

Publishing records:

```text
videos/{number}-{slug}/metadata/run_record.json
logs/last_daily_run.json
```

## 10. End Product

A finished story has:

- article live or ready in the website repo
- cover image visible on the site
- audio player working on the article
- final vertical video rendered
- metadata generated
- YouTube and TikTok scheduled or publish status logged
- source links visible at the bottom of the article
