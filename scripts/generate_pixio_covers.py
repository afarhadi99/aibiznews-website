#!/usr/bin/env python
from __future__ import annotations

import argparse
import json
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
ARTICLES_DIR = ROOT / "content" / "articles"
DEFAULT_BASE_URL = "https://beta.pixio.myapps.ai"
DEFAULT_MODEL = "nano banana 2"
DEFAULT_ASPECT_RATIO = "16:9"
DEFAULT_SIZE = "1536x1024"
DEFAULT_QUALITY = "high"
DEFAULT_OUTPUT_FORMAT = "jpg"


class PixioApiError(RuntimeError):
    def __init__(self, message: str, status_code: int | None = None, payload: Any = None):
        super().__init__(message)
        self.status_code = status_code
        self.payload = payload


@dataclass
class Article:
    slug: str
    title: str
    category: str
    description: str
    cover: str
    body: str
    sources: list[str]


class PixioClient:
    def __init__(self) -> None:
        _load_env_files()
        self.api_key = os.getenv("PIXIO_API_KEY")
        if not self.api_key:
            raise PixioApiError("PIXIO_API_KEY is not set")
        self.base_url = (os.getenv("PIXIO_BASE_URL") or DEFAULT_BASE_URL).rstrip("/")

    def request(self, method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        data = None if payload is None else json.dumps(payload).encode("utf-8")
        request = urllib.request.Request(
            f"{self.base_url}{path}",
            data=data,
            method=method,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            raw = exc.read().decode("utf-8", errors="replace")
            try:
                error_payload = json.loads(raw)
            except json.JSONDecodeError:
                error_payload = {"error": raw[:500]}
            message = error_payload.get("error") or error_payload.get("message") or f"Pixio HTTP {exc.code}"
            raise PixioApiError(message, exc.code, error_payload) from exc

    def list_models(self) -> list[dict[str, Any]]:
        return self.request("GET", "/api/v1/models").get("models", [])

    def get_model(self, model_id: str) -> dict[str, Any]:
        query = urllib.parse.urlencode({"modelId": model_id})
        model = self.request("GET", f"/api/v1/models?{query}").get("model")
        if not model:
            raise PixioApiError(f"Pixio model is not visible to this account: {model_id}")
        return model

    def get_params(self, model_id: str) -> list[dict[str, Any]]:
        query = urllib.parse.urlencode({"modelId": model_id, "providerId": "pixio"})
        return self.request("GET", f"/api/v1/params?{query}").get("params", [])

    def create_generation(self, model_id: str, params: dict[str, Any]) -> str:
        payload = {
            "providerId": "pixio",
            "modelId": model_id,
            "params": params,
        }
        try:
            response = self.request("POST", "/api/v1/generate", payload)
        except PixioApiError as exc:
            if exc.status_code == 429 and isinstance(exc.payload, dict) and exc.payload.get("generationId"):
                self.poll_generation(exc.payload["generationId"])
                response = self.request("POST", "/api/v1/generate", payload)
            else:
                raise
        content_id = response.get("contentId")
        if not content_id:
            raise PixioApiError("Pixio generation did not return contentId", payload=response)
        return content_id

    def poll_generation(self, content_id: str, interval: float = 3.0, timeout_seconds: int = 900) -> dict[str, Any]:
        started = time.time()
        while True:
            payload = self.request("GET", f"/api/v1/generations/{content_id}")
            status = payload.get("status")
            if status == "succeeded":
                return payload
            if status == "failed":
                raise PixioApiError(payload.get("error") or "Pixio generation failed", payload=payload)
            if time.time() - started > timeout_seconds:
                raise PixioApiError(f"Timed out waiting for Pixio generation {content_id}", payload=payload)
            time.sleep(interval)


def _load_env_files() -> None:
    for name in (".env", ".env.local"):
        path = ROOT / name
        if not path.exists():
            continue
        for raw_line in path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


def _normalized(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", value.lower()).strip()


def _terms(value: str) -> list[str]:
    return [term for term in _normalized(value).split() if term]


def choose_model(client: PixioClient, preferred: str, model_id: str | None) -> dict[str, Any]:
    if model_id:
        if not model_id.startswith("pixio/"):
            raise PixioApiError("PIXIO_IMAGE_MODEL_ID must be a public pixio/... model id")
        return client.get_model(model_id)

    models = client.list_models()
    terms = _terms(preferred)
    preferred_phrase = _normalized(preferred)
    matches: list[tuple[int, str, dict[str, Any]]] = []
    for model in models:
        model_id_text = _normalized(str(model.get("id", "")))
        model_name_text = _normalized(str(model.get("name", "")))
        haystack = _normalized(" ".join(str(model.get(key, "")) for key in ("id", "name", "description", "type")))
        haystack_terms = set(_terms(haystack))
        if "image" not in haystack_terms or "video" in haystack_terms:
            continue
        if terms and not all(term in haystack_terms for term in terms):
            continue
        if preferred_phrase in {model_id_text, model_name_text}:
            rank = 0
        elif preferred_phrase and preferred_phrase in f"{model_id_text} {model_name_text}":
            rank = 1
        elif preferred_phrase and preferred_phrase in haystack:
            rank = 2
        else:
            rank = 10
        matches.append((rank, str(model.get("id", "")), model))
    if not matches:
        raise PixioApiError(f"No visible Pixio image model matched '{preferred}'")
    return sorted(matches, key=lambda item: (item[0], item[1]))[0][2]


def _strip_quotes(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'"', "'"}:
        return value[1:-1]
    return value


def parse_article(path: Path) -> Article:
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


def article_excerpt(body: str, limit: int = 750) -> str:
    body = body.split("## Sources", 1)[0]
    lines = []
    for line in body.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or stripped.startswith("!") or stripped.startswith("- ["):
            continue
        lines.append(stripped)
    return " ".join(lines)[:limit]


def cover_output_path(article: Article) -> Path:
    if article.cover.startswith("/"):
        return ROOT / "public" / article.cover.lstrip("/")
    return ROOT / article.cover


def build_prompt(article: Article) -> str:
    source_context = "; ".join(article.sources)
    return (
        "Click-worthy photorealistic landscape cover image for an AI business news article, "
        "with the punch and framing of a premium YouTube news thumbnail but no text overlay. "
        f"Title: {article.title}. Category: {article.category}. "
        f"Summary: {article.description} {article_excerpt(article.body)} "
        f"Source context: {source_context}. "
        "Use a strong central subject, expressive but credible lighting, high contrast, clean negative space, "
        "and immediately recognizable AI/business stakes. If public figures, real companies, products, or landmarks are named, depict them accurately and respectfully. "
        "Real company logos or product marks are acceptable only when relevant and naturally visible. "
        "No text overlay, no invented words, no fake UI, no fake logos, no watermarks, no cluttered collage borders, no dull stock-photo framing, no generic server-room imagery."
    )


def option_values(options: list[Any]) -> list[Any]:
    return [option.get("value") if isinstance(option, dict) else option for option in options]


def apply_param(params: dict[str, Any], spec: dict[str, Any], desired: Any) -> None:
    name = spec.get("name")
    if not name or desired is None:
        return
    options = option_values(spec.get("options") or [])
    if options:
        params[name] = desired if desired in options else (spec.get("defaultValue") or options[0])
    else:
        params[name] = desired


def build_params(params_spec: list[dict[str, Any]], prompt: str, args: argparse.Namespace) -> dict[str, Any]:
    params: dict[str, Any] = {}
    by_name = {spec.get("name"): spec for spec in params_spec if spec.get("name")}
    prompt_spec = next(
        (
            spec
            for spec in params_spec
            if spec.get("type") == "string"
            and "prompt" in f"{spec.get('name', '')} {spec.get('label', '')}".lower()
        ),
        None,
    )
    if prompt_spec and prompt_spec.get("name"):
        params[prompt_spec["name"]] = prompt

    desired_by_name = {
        "aspect_ratio": args.aspect_ratio,
        "output_format": args.output_format,
        "size": args.size,
        "image_size": args.size,
        "resolution": args.size,
        "quality": args.quality,
        "output_quality": args.quality,
    }
    for name, desired in desired_by_name.items():
        spec = by_name.get(name)
        if spec:
            apply_param(params, spec, desired)

    for spec in params_spec:
        name = spec.get("name")
        if not name or name in params:
            continue
        default = spec.get("defaultValue")
        if default is not None:
            params[name] = default
            continue
        if not spec.get("required"):
            continue
        input_type = spec.get("type")
        if input_type == "string":
            params[name] = prompt
        elif input_type == "boolean":
            params[name] = False
        elif input_type in {"number", "integer"}:
            params[name] = 1
        elif input_type == "select" and spec.get("options"):
            params[name] = option_values(spec["options"])[0]
        else:
            raise PixioApiError(f"Required Pixio param '{name}' cannot be inferred safely")
    return params


def download_file(url: str, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=180) as response:
        output_path.write_bytes(response.read())


def log_generation(article: Article, model: dict[str, Any], result: dict[str, Any], output_path: Path) -> None:
    log_dir = ROOT / "research" / "pixio-generation"
    log_dir.mkdir(parents=True, exist_ok=True)
    record = {
        "slug": article.slug,
        "output": str(output_path.relative_to(ROOT)),
        "generationId": result.get("id"),
        "modelId": model.get("id"),
        "outputUrl": result.get("outputUrl"),
        "creditsCost": result.get("creditsCost"),
    }
    with (log_dir / "cover-generations.jsonl").open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record, ensure_ascii=False) + "\n")


def generate_cover(
    client: PixioClient,
    model: dict[str, Any],
    params_spec: list[dict[str, Any]],
    article: Article,
    args: argparse.Namespace,
) -> Path:
    output_path = cover_output_path(article)
    prompt = build_prompt(article)
    if args.dry_run:
        print(f"\n--- {article.slug} ---\n{prompt}\n")
        return output_path

    params = build_params(params_spec, prompt, args)
    content_id = client.create_generation(model["id"], params)
    result = client.poll_generation(content_id)
    output_url = result.get("outputUrl") or (result.get("outputs") or {}).get("imageUrl")
    if not output_url:
        raise PixioApiError("Pixio result did not include an image output URL", payload=result)
    download_file(output_url, output_path)
    log_generation(article, model, result, output_path)
    print(f"[cover] {article.slug} -> {output_path}")
    return output_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate article cover images with Pixio.")
    parser.add_argument("--preferred-model", default=os.getenv("PIXIO_IMAGE_MODEL") or os.getenv("PIXIO_PREFERRED_MODEL") or DEFAULT_MODEL)
    parser.add_argument("--model-id", default=os.getenv("PIXIO_IMAGE_MODEL_ID"))
    parser.add_argument("--aspect-ratio", default=os.getenv("PIXIO_COVER_ASPECT_RATIO", DEFAULT_ASPECT_RATIO))
    parser.add_argument("--size", default=os.getenv("PIXIO_COVER_IMAGE_SIZE", DEFAULT_SIZE))
    parser.add_argument("--quality", default=os.getenv("PIXIO_IMAGE_QUALITY", DEFAULT_QUALITY))
    parser.add_argument("--output-format", default=os.getenv("PIXIO_COVER_OUTPUT_FORMAT", DEFAULT_OUTPUT_FORMAT))
    parser.add_argument("--slug", action="append", help="Generate only this article slug. Repeatable.")
    parser.add_argument("--limit", type=int, help="Maximum number of covers to generate.")
    parser.add_argument("--force", action="store_true", help="Overwrite existing cover files.")
    parser.add_argument("--include-welcome", action="store_true", help="Also generate the evergreen welcome article cover.")
    parser.add_argument("--dry-run", action="store_true", help="Print prompts without calling Pixio.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    requested = set(args.slug or [])
    articles = [parse_article(path) for path in sorted(ARTICLES_DIR.glob("*.md"))]
    selected: list[Article] = []
    for article in articles:
        if requested and article.slug not in requested:
            continue
        if article.slug == "welcome" and not args.include_welcome:
            continue
        if not args.force and cover_output_path(article).exists():
            continue
        selected.append(article)
        if args.limit and len(selected) >= args.limit:
            break

    if not selected:
        print("[cover] No articles selected. Use --force to overwrite existing covers.")
        return 0

    if args.dry_run:
        for article in selected:
            generate_cover(None, {"id": args.model_id or args.preferred_model}, [], article, args)
        return 0

    client = PixioClient()
    model = choose_model(client, args.preferred_model, args.model_id)
    params_spec = client.get_params(model["id"])
    print(f"[cover] Using Pixio model: {model.get('id')} ({model.get('name', 'unnamed')})")
    for article in selected:
        generate_cover(client, model, params_spec, article, args)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
