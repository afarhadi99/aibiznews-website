import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "content", "articles");

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
  videoStatus?: string;
  sourceCount?: number;
};

export type Article = ArticleMeta & {
  contentHtml: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeMeta(data: Record<string, unknown>, fallbackSlug: string): ArticleMeta {
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
    videoStatus: data.videoStatus ? String(data.videoStatus) : "pending",
    sourceCount: Number(data.sourceCount ?? 0)
  };
}

export function getAllArticleMeta(): ArticleMeta[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }
  return fs
    .readdirSync(articlesDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const fullPath = path.join(articlesDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return normalizeMeta(data, file.replace(/\.md$/, ""));
    })
    .sort((a, b) => b.date.localeCompare(a.date));
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
  const processedContent = await remark().use(html).process(content);
  return {
    ...normalizeMeta(data, slug),
    contentHtml: processedContent.toString()
  };
}

export function getRelatedArticles(article: ArticleMeta, limit = 3) {
  return getAllArticleMeta()
    .filter((item) => item.slug !== article.slug && item.category === article.category)
    .slice(0, limit);
}
