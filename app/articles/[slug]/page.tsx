import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Play, Share2 } from "lucide-react";
import { getAllArticleMeta, getArticle, getRelatedArticles } from "@/lib/articles";

export function generateStaticParams() {
  return getAllArticleMeta().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) {
    return {};
  }
  return {
    title: `${article.title} | AI Biz News Network`,
    description: article.description
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) {
    notFound();
  }
  const related = getRelatedArticles(article);

  return (
    <main className="shell article-shell">
      <article>
        <div className="article-hero">
          <div className="eyebrow">{article.category}</div>
          <h1>{article.title}</h1>
          <p className="hero-copy">{article.description}</p>
          <img src={article.cover} alt="" />
        </div>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
      </article>
      <aside className="article-sidebar">
        <div className="side-panel">
          <div className="eyebrow">Video links</div>
          <p className="muted">Cross-links update when the scheduled videos are live.</p>
          <div className="button-row">
            {article.youtubeUrl ? (
              <a className="button" href={article.youtubeUrl}>
                YouTube <Play size={16} aria-hidden />
              </a>
            ) : (
              <span className="button secondary">YouTube pending</span>
            )}
            {article.tiktokUrl ? (
              <a className="button secondary" href={article.tiktokUrl}>
                TikTok <Share2 size={16} aria-hidden />
              </a>
            ) : (
              <span className="button secondary">TikTok pending</span>
            )}
          </div>
        </div>
        {related.length > 0 ? (
          <div className="side-panel" style={{ marginTop: 16 }}>
            <div className="eyebrow">Related</div>
            {related.map((item) => (
              <p key={item.slug}>
                <Link href={`/articles/${item.slug}`}>
                  {item.title} <ExternalLink size={14} aria-hidden />
                </Link>
              </p>
            ))}
          </div>
        ) : null}
      </aside>
    </main>
  );
}
