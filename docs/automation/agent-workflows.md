# AIBIZ.NEWS Agent Workflows

This document defines the automation split for running many stories at once without losing source quality, metadata discipline, or publish verification.

## Daily Loop

1. `Research Fanout`
2. `Story Ranker`
3. `Article Writer`
4. `Source Editor`
5. `Image Prompt Agent`
6. `Cover And Visual Generator`
7. `Voiceover Writer`
8. `TTS Producer`
9. `Video Renderer`
10. `Metadata Agent`
11. `Website Sync Agent`
12. `YouTube Upload Agent`
13. `TikTok Upload Agent`
14. `Publish Verification Agent`
15. `Tracker Agent`

Research, writing, media generation, and metadata can run in parallel per story. Browser upload agents should run one platform session at a time because YouTube Studio and TikTok Studio use stateful browser sessions and native file pickers.

## Agent Contracts

### Research Agent

Goal: find one specific current technology business story.

Inputs:

- Topic lane.
- Date.
- Existing tracker slugs to avoid duplicates.

Outputs:

- Story brief.
- Source list with publisher, title, URL, date, and supported claims.
- Named entities.
- Category.
- Why the story matters.

Quality bar:

- Multiple credible sources.
- Distinct publishers.
- Primary filings or company releases when available.
- Specific named companies, people, products, dates, and numbers.

### Story Ranker

Goal: pick the strongest stories from research fanout.

Inputs:

- Research briefs.
- Existing published stories.

Outputs:

- Ranked story queue.
- Rejection reasons for weak or duplicate stories.

Scoring:

- Specificity.
- Timeliness.
- Audience pull.
- Source depth.
- Video potential.
- Business consequence.

### Article Writer

Goal: write a website article that reads like a real business news piece.

Inputs:

- Approved research brief.
- Source list.

Outputs:

- Markdown article.
- Frontmatter.
- Source section.

Rules:

- No automation language.
- Lead with what changed.
- Explain why it matters.
- Include named actors and concrete details.
- Keep sources at the bottom.

### Source Editor

Goal: verify that every material claim is supported.

Inputs:

- Draft article.
- Source list.

Outputs:

- Approved article or required fixes.
- Source count.
- Any unsupported claim notes.

Rules:

- Remove unsupported speculation.
- Replace repeated-publisher sourcing with better diversity.
- Prefer primary documents for company claims.

### Image Prompt Agent

Goal: turn the article into practical image prompts.

Inputs:

- Article.
- Named entities.
- Brand/product context.

Outputs:

- One 16:9 cover prompt.
- Five 9:16 video image prompts.

Rules:

- Mention real public people, companies, products, logos, and locations when relevant.
- Ask for editorial realism.
- Avoid text-heavy graphics.
- Avoid generic AI imagery unless the story is actually about AI infrastructure or products.

### Cover And Visual Generator

Goal: create and store story images.

Inputs:

- Image prompts.
- Pixio settings.

Outputs:

- `images/cover.jpg`
- `images/image_1.jpg` through `images/image_5.jpg`
- Website cover copy.

Default model:

```text
nano banana 2
```

### Voiceover Writer

Goal: write a short news report, not a spoken article.

Inputs:

- Article.
- Metadata angle.

Outputs:

- 45-60 second narration script.

Format:

- Anchor-style lead.
- Attribution.
- Business implication.
- What to watch next.

### TTS Producer

Goal: generate narrated audio.

Inputs:

- Voiceover script.
- Voice rotation state.

Outputs:

- `voiceover/voiceover.wav`
- Website audio copy.
- Voice/model metadata.

Default:

```text
pixio/gemini-3.1-flash-tts-preview
```

Rules:

- Rotate voice every story.
- Store local audio, not signed provider URLs.

### Video Renderer

Goal: render the final vertical Short.

Inputs:

- Video images.
- Voiceover audio.
- Story title and script.

Outputs:

- `video/final_video.mp4`

Validation:

- 1080x1920.
- Audio present.
- No black frames.
- Duration fits Shorts.

### Metadata Agent

Goal: create platform-native metadata without leaking source URLs.

Inputs:

- Article URL.
- Story angle.
- Entities.

Outputs:

- YouTube title.
- YouTube description.
- YouTube tags.
- TikTok caption.
- TikTok hashtags.

Rules:

- Only link to AIBIZ.NEWS.
- No source URLs.
- YouTube title has no hashtags.
- Hashtags are platform appropriate and story specific.

### Website Sync Agent

Goal: keep website content, cover, audio, and video links current.

Inputs:

- Story package.
- Published platform URLs when available.

Outputs:

- Website article markdown.
- Cover in `public/images/covers`.
- Audio in `public/audio`.
- Frontmatter `youtubeUrl`, `tiktokUrl`, and `videoStatus`.

Validation:

- `npm run build`.
- Article page loads.
- Cover and audio paths resolve.

### YouTube Upload Agent

Goal: publish or schedule one Short to the correct channel.

Inputs:

- `final_video.mp4`.
- YouTube metadata.
- Schedule time or publish-now instruction.

Outputs:

- YouTube Short URL.
- Publish status.
- Upload notes.

Rules:

- Use the native file picker if browser programmatic upload fails.
- Confirm the AI disclosure step when present.
- Verify final URL before marking published.

### TikTok Upload Agent

Goal: publish or schedule one TikTok video to `@aibiz.news`.

Inputs:

- `final_video.mp4`.
- TikTok caption and hashtags.
- Schedule time or publish-now instruction.

Outputs:

- TikTok URL.
- Publish status.
- Visibility status.

Rules:

- Use the native file picker.
- Confirm visibility is `Everyone`.
- Recheck after posting because TikTok can briefly show `Only me`.

### Publish Verification Agent

Goal: prove the story is public and linked everywhere.

Inputs:

- YouTube URL.
- TikTok URL.
- Website article URL.

Outputs:

- Verified status.
- Failure notes.

Checks:

- YouTube URL opens.
- TikTok URL opens.
- Article shows video links.
- Audio player appears.
- Tracker row has URLs.

### Tracker Agent

Goal: keep the CSV and XLSX story ledger accurate.

Inputs:

- Story package metadata.
- Publish verification.

Outputs:

- Updated CSV row.
- Rebuilt workbook.

Rules:

- One row per story.
- Include description, entities, source fields, asset paths, voice/model, metadata, URLs, status, and notes.

## Parallelism Model

Daily target: 10 stories.

Recommended fanout:

- Run 20-30 research probes.
- Rank to 10 publishable stories.
- Run article/source/image/voice/video loops per story.
- Queue browser uploads sequentially by platform session.
- Run website sync and tracker updates after each verified publish.

## Recovery Model

If one story fails:

1. Mark only that story as `blocked` or `retry_needed`.
2. Keep the remaining stories moving.
3. Preserve generated files.
4. Record the blocker in tracker notes.
5. Retry from the failed stage, not from research.
