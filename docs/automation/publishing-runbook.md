# AIBIZ.NEWS Publishing Runbook

This is the verified publishing path for turning a finished story package into live YouTube Shorts, TikTok, and website links.

## Inputs

Story folder:

```text
C:\Users\alish\Desktop\youtube-automation\videos\[number]-[slug]
```

Required files:

```text
article\article.md
images\cover.jpg
script\script.txt
voiceover\voiceover.wav
video\final_video.mp4
metadata\metadata.json
research\sources.json
```

Website article:

```text
C:\Users\alish\Documents\GitHub\aibiznews-website\content\articles\[slug].md
```

## Preflight

1. Confirm the website article is live or ready to deploy.
2. Confirm the rendered video is the right file:

```powershell
@'
from moviepy.editor import VideoFileClip
path = r"C:\Users\alish\Desktop\youtube-automation\videos\[number]-[slug]\video\final_video.mp4"
clip = VideoFileClip(path)
print(clip.duration, clip.size, clip.audio is not None)
clip.close()
'@ | python -
```

3. Confirm metadata does not contain source URLs. Platform metadata should link only to the AIBIZ article.
4. Confirm Chrome is logged in to the correct accounts:
   - YouTube Studio channel: `AI biz news network`
   - TikTok account: `@aibiz.news`

## YouTube Shorts Upload

Target:

```text
https://studio.youtube.com/channel/UCw_IqppHVBdxVuwf-1CtIkA
```

Verified path:

1. Open YouTube Studio for the channel.
2. Start the upload flow and bring the tab to the front.
3. Click `Select files`.
4. In the Windows file picker, use the file name field and enter the full MP4 path:

```text
C:\Users\alish\Desktop\youtube-automation\videos\[number]-[slug]\video\final_video.mp4
```

5. Press `Enter`.
6. Fill title, description, tags, category, and audience settings from `metadata.json`.
7. Mark the video as not made for kids.
8. If the AI disclosure step appears, choose that the content contains AI generated or altered elements.
9. Continue through video elements and checks.
10. Publish or schedule.
11. Copy the final Short URL.

Metadata rules:

- Title: short, specific, no hashtags.
- Description: brief context, one AIBIZ article link, brand line, 3-4 hashtags.
- Tags: named companies, products, people, and topic terms.
- Do not include source URLs.

## TikTok Upload

Target:

```text
https://www.tiktok.com/tiktokstudio/upload?from=creator_center&tab=video
```

Verified path:

1. Open TikTok Studio upload.
2. Bring the tab to the front.
3. Click `Select video`.
4. In the Windows file picker, use the file name field and enter the full MP4 path:

```text
C:\Users\alish\Desktop\youtube-automation\videos\[number]-[slug]\video\final_video.mp4
```

5. Press `Enter`.
6. Close any onboarding overlay.
7. Fill the caption from `metadata.json`.
8. Press `Escape` after hashtags if TikTok opens suggestions.
9. Confirm visibility is `Everyone`.
10. Keep `Now` selected unless the story is being scheduled.
11. Click `Post`.
12. Wait for the content row to appear and verify it changes from `Only me` to `Everyone`.
13. Copy the final TikTok URL.

TikTok verification note: TikTok can briefly show a new upload as `Only me` immediately after posting. Wait around 30 seconds and refresh or recheck the content list before marking the story as public.

## Post-Publish Website Sync

After both platform URLs are known, update the website article frontmatter:

```yaml
youtubeUrl: "https://youtube.com/shorts/..."
tiktokUrl: "https://www.tiktok.com/@aibiz.news/video/..."
videoStatus: "published"
```

Then validate and push:

```powershell
cd C:\Users\alish\Documents\GitHub\aibiznews-website
npm run build
git status --short
git add content/articles/[slug].md docs/automation
git commit -m "Update published video links and automation docs"
git push origin main
```

## Tracker Sync

Update:

```text
C:\Users\alish\Desktop\youtube-automation\tracking\aibiz_story_tracker.csv
C:\Users\alish\Desktop\youtube-automation\videos\[number]-[slug]\metadata\metadata.json
```

Required fields:

- Publish status.
- YouTube URL.
- TikTok URL.
- Article URL.
- Voice/model.
- Cover/audio/video paths.
- Platform metadata used.
- Any manual upload notes.

Rebuild the workbook:

```powershell
cd C:\Users\alish\Desktop\youtube-automation
node tools\build_story_tracker_workbook.mjs
```

## Failure Loop

If upload fails:

1. Capture the platform, story slug, exact screen state, and error.
2. Do not mark the story as published.
3. Record `blocked` or `retry_needed` in metadata and tracker notes.
4. Continue non-conflicting stories.
5. Retry with the native file picker path before changing the video or metadata.
