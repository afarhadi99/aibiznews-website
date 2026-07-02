#!/usr/bin/env python
from __future__ import annotations

import argparse
import base64
import os
import re
from dataclasses import dataclass
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ARTICLES_DIR = ROOT / "content" / "articles"
COVERS_DIR = ROOT / "public" / "images" / "covers"
DEFAULT_MODEL = "gpt-image-2"
DEFAULT_SIZE = "1536x1024"
DEFAULT_QUALITY = "high"


@dataclass
class Article:
    slug: str
    title: str
    category: str
    description: str
    cover: str
    body: str
    sources: list[str]


def _strip_quotes(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        return value[1:-1]
    return value


def _parse_article(path: Path) -> Article:
    text = path.read_text(encoding="utf-8")
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.S)
    frontmatter: dict[str, str] = {}
    body = text
    if match:
        body = text[match.end() :]
        for line in match.group(1).splitlines():
            if ":" not in line or line[:1].isspace():
                continue
            key, value = line.split(":", 1)
            frontmatter[key.strip()] = _strip_quotes(value)

    sources = re.findall(r"(?m)^- \[([^\]]+)\]\(https?://[^)]+\)", body)
    return Article(
        slug=frontmatter.get("slug") or path.stem,
        title=frontmatter.get("title") or path.stem.replace("-", " ").title(),
        category=frontmatter.get("category") or "AI Markets",
        description=frontmatter.get("description") or "",
        cover=frontmatter.get("cover") or f"/images/covers/{path.stem}.jpg",
        body=body,
        sources=sources[:5],
    )


def _article_excerpt(body: str, limit: int = 750) -> str:
    body = body.split("## Sources", 1)[0]
    lines = []
    for line in body.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or stripped.startswith("!"):
            continue
        if stripped.startswith("- ["):
            continue
        lines.append(stripped)
    return " ".join(lines)[:limit]


def _cover_output_path(article: Article) -> Path:
    if article.cover.startswith("/"):
        return ROOT / "public" / article.cover.lstrip("/")
    return ROOT / article.cover


def build_prompt(article: Article) -> str:
    excerpt = _article_excerpt(article.body)
    source_context = "; ".join(article.sources)
    return (
        "Use case: photorealistic-natural\n"
        "Asset type: landscape cover image for an AI business news article\n"
        f"Primary request: Create a serious editorial cover for '{article.title}'.\n"
        f"Scene/background: Real-world business technology, AI infrastructure, markets, policy, or research context implied by the article.\n"
        f"Subject: {article.title}\n"
        f"Category: {article.category}\n"
        f"Article summary: {article.description} {excerpt}\n"
        f"Source context: {source_context}\n"
        "Style/medium: Photorealistic news-magazine photography, restrained and premium, not an illustration.\n"
        "Composition/framing: 16:9 horizontal cover, strong first-glance subject, room for web cropping, no text overlay.\n"
        "Lighting/mood: Natural editorial lighting, credible and current.\n"
        "Constraints: If public figures, real companies, products, or landmarks are named, depict them accurately and respectfully. Real company logos or product marks are acceptable only when relevant and naturally visible.\n"
        "Avoid: invented words, fake UI, fake logos, gibberish text, watermarks, collage borders, poster graphics, stock-photo cliches, oversaturated neon."
    )


def _client():
    try:
        from openai import OpenAI
    except ImportError as exc:
        raise RuntimeError("Install the OpenAI SDK first: python -m pip install openai") from exc
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY is not set; set it locally before live cover generation.")
    return OpenAI()


def generate_cover(article: Article, args: argparse.Namespace) -> Path:
    output_path = _cover_output_path(article)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    prompt = build_prompt(article)

    if args.dry_run:
        print(f"\n--- {article.slug} ---\n{prompt}\n")
        return output_path

    response = _client().images.generate(
        model=args.model,
        prompt=prompt,
        size=args.size,
        quality=args.quality,
        output_format="jpeg",
        background="opaque",
        n=1,
    )
    image_data = response.data[0].b64_json
    if not image_data:
        raise RuntimeError(f"No image data returned for {article.slug}")
    output_path.write_bytes(base64.b64decode(image_data))
    print(f"[cover] {article.slug} -> {output_path}")
    return output_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate article cover images with OpenAI GPT Image.")
    parser.add_argument("--model", default=os.getenv("OPENAI_IMAGE_MODEL", DEFAULT_MODEL))
    parser.add_argument("--size", default=os.getenv("OPENAI_COVER_IMAGE_SIZE", DEFAULT_SIZE))
    parser.add_argument("--quality", default=os.getenv("OPENAI_IMAGE_QUALITY", DEFAULT_QUALITY))
    parser.add_argument("--slug", action="append", help="Generate only this article slug. Repeatable.")
    parser.add_argument("--limit", type=int, help="Maximum number of covers to generate.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing cover files.")
    parser.add_argument("--include-welcome", action="store_true", help="Also generate the evergreen welcome article cover.")
    parser.add_argument("--dry-run", action="store_true", help="Print prompts without calling the API.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    requested = set(args.slug or [])
    articles = [_parse_article(path) for path in sorted(ARTICLES_DIR.glob("*.md"))]
    selected: list[Article] = []
    for article in articles:
        if requested and article.slug not in requested:
            continue
        if article.slug == "welcome" and not args.include_welcome:
            continue
        if not args.force and _cover_output_path(article).exists():
            continue
        selected.append(article)
        if args.limit and len(selected) >= args.limit:
            break

    if not selected:
        print("[cover] No articles selected. Use --force to overwrite existing covers.")
        return 0

    for article in selected:
        generate_cover(article, args)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
