import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleMeta } from "@/lib/articles";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <article className="story-card">
      <Link href={`/articles/${article.slug}`} aria-label={article.title}>
        <img src={article.cover} alt="" />
      </Link>
      <div className="story-body">
        <div className="eyebrow">{article.category}</div>
        <h3>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="muted">{article.description}</p>
        <div className="chip-row">
          {article.tags.slice(0, 3).map((tag) => (
            <span className="chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <Link className="button secondary" href={`/articles/${article.slug}`}>
          Read <ArrowUpRight size={16} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
