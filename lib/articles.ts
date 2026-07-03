import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "content", "articles");
const publicArticleStartDate = "2026-01-01";

export type ArticleMeta = {
  title: string;
  slug: string;
  date: string;
  category: string;
  description: string;
  cover: string;
  tags: string[];
  youtubeUrl?: string;
  tiktokUrl?: string;
  audioUrl?: string;
  sourceCount?: number;
  readingMinutes: number;
};

export type Article = ArticleMeta & {
  contentHtml: string;
  rawContent: string;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function estimateReadingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function normalizeMeta(data: Record<string, unknown>, fallbackSlug: string, content = ""): ArticleMeta {
  const title = String(data.title ?? fallbackSlug);
  const category = String(data.category ?? "AI Markets");
  return {
    title,
    slug: String(data.slug ?? fallbackSlug),
    date: String(data.date ?? new Date().toISOString().slice(0, 10)),
    category,
    description: String(data.description ?? ""),
    cover: String(data.cover ?? "/images/covers/default.svg"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [slugify(category)],
    youtubeUrl: data.youtubeUrl ? String(data.youtubeUrl) : "",
    tiktokUrl: data.tiktokUrl ? String(data.tiktokUrl) : "",
    audioUrl: data.audioUrl ? String(data.audioUrl) : "",
    sourceCount: Number(data.sourceCount ?? 0),
    readingMinutes: estimateReadingMinutes(content)
  };
}

function isPublicArticle(article: ArticleMeta) {
  return article.date >= publicArticleStartDate;
}

function readAllArticleMeta(): ArticleMeta[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }
  return fs
    .readdirSync(articlesDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const fullPath = path.join(articlesDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      return normalizeMeta(data, file.replace(/\.md$/, ""), content);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllArticleMeta(): ArticleMeta[] {
  return readAllArticleMeta().filter(isPublicArticle);
}

export function getCategories() {
  const articles = getAllArticleMeta();
  const counts = new Map<string, number>();
  for (const article of articles) {
    counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getArticlesByCategory(categorySlug: string) {
  return getAllArticleMeta().filter((article) => slugify(article.category) === categorySlug);
}

export async function getArticle(slug: string): Promise<Article | null> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const meta = normalizeMeta(data, slug, content);
  if (!isPublicArticle(meta)) {
    return null;
  }
  const processedContent = await remark().use(html).process(content);
  return {
    ...meta,
    contentHtml: processedContent.toString(),
    rawContent: content
  };
}

export function getRelatedArticles(article: ArticleMeta, limit = 3) {
  return getAllArticleMeta()
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .slice(0, limit);
}

export function getAdjacentArticles(article: ArticleMeta) {
  const articles = getAllArticleMeta();
  const index = articles.findIndex((item) => item.slug === article.slug);
  return {
    previous: index >= 0 ? articles[index + 1] : undefined,
    next: index > 0 ? articles[index - 1] : undefined
  };
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${value}T12:00:00`));
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://aibiznews.com").replace(/\/$/, "");
}

export function articleUrl(slug: string) {
  return `${siteUrl()}/articles/${slug}`;
}

export function absoluteImageUrl(cover: string) {
  if (!cover) {
    return `${siteUrl()}/images/covers/default.svg`;
  }
  if (/^https?:\/\//.test(cover)) {
    return cover;
  }
  return `${siteUrl()}${cover.startsWith("/") ? cover : `/${cover}`}`;
}
