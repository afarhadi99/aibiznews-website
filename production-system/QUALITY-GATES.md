# Quality Gates

Use this before approving any story package.

## Research

- At least two credible sources for a normal news item.
- Three or more sources for larger stories, disputed claims, market-moving stories, or anything involving public figures.
- Source diversity means distinct publishers or primary documents, not multiple links from the same publisher.
- Source dates are current and relevant.
- Claims in the article can be traced back to source links.
- No unsupported valuation, revenue, legal, safety, or capability claims.

## Article

- Headline is specific and not clickbait.
- First paragraph says what happened and why it matters.
- Article explains business impact, competitive context, and what to watch next.
- Sources are listed at the bottom with clear link text.
- No public-facing text mentions automation, pipeline, daily posting, or internal workflow.
- The article has a category, tags, cover, audio URL, and source count in frontmatter.

## Cover Image

- Landscape `16:9`.
- Clearly shows the real companies, people, places, or products when the story names them.
- No fake UI text, fake logos, watermarks, unreadable signage, or random generic tech imagery.
- Image works as a news cover, not a stock illustration.

## Video Images

- Vertical `9:16`.
- Six images preferred.
- Visual sequence matches the narration order.
- Important subjects are not cropped awkwardly.
- No fake text/logos/watermarks.

## Voiceover

- Audio file exists and plays.
- Voice is clear and not rushed.
- Duration matches the intended short format.
- Script does not include citation clutter or awkward phrasing.
- Names of companies and people are understandable.

## Final Video

- `final_video.mp4` exists.
- Format is vertical `1080x1920`.
- Audio starts cleanly and ends cleanly.
- Visual pacing matches the narration.
- No black frames, frozen frames, bad crops, or stretched images.

## Metadata

- YouTube title is readable and under limits.
- YouTube description includes exactly one live AIBIZ article link.
- TikTok caption is concise and platform-native.
- Tags and hashtags match the story.
- Metadata does not overpromise or imply unsupported facts.
- Platform metadata does not include source URLs.

## Story Tracker

- `tracking\aibiz_story_tracker.csv` has one row for the story.
- `tracking\aibiz_story_tracker.xlsx` has been rebuilt after CSV changes.
- The row includes description, category, entities, schedule time, source count, individual source publishers/titles/URLs, article URL, asset paths, platform metadata copy, and publish status.

## Website

- Article page opens.
- Cover image loads.
- Audio player loads when `audioUrl` is present.
- Source links are visible at the bottom.
- Category page shows the article.
- Build passes with `npm run build`.

## Publishing

- Schedule time is between 6:00 AM and midnight Eastern unless deliberately changed.
- YouTube status is logged.
- TikTok status is logged.
- Any browser upload error screenshot is reviewed before retrying.
- Chrome/Codex uploads have file URL access enabled before local MP4 upload is attempted.
