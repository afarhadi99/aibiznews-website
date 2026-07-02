import Link from "next/link";
import { ArrowUpRight, Clock, Headphones } from "lucide-react";
import type { ArticleMeta } from "@/lib/articles";
import { formatDate } from "@/lib/articles";
import { Badge } from "@/components/ui/badge";

type ArticleCardProps = {
  article: ArticleMeta;
  compact?: boolean;
};

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  if (compact) {
    return (
      <article className="group grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-b border-foreground/15 py-4 sm:grid-cols-[128px_minmax(0,1fr)]">
        <Link className="thumb-frame aspect-[16/9] self-start" href={`/articles/${article.slug}`} aria-label={article.title}>
          <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" src={article.cover} alt="" />
        </Link>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="section-chip">{article.category}</span>
            {article.audioUrl ? <Headphones size={13} className="text-[var(--brand-teal)]" aria-hidden /> : null}
          </div>
          <h3 className="mt-2 line-clamp-2 font-serif text-xl font-bold leading-tight group-hover:underline">
            <Link href={`/articles/${article.slug}`}>{article.title}</Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{article.description}</p>
          <p className="mt-3 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
            {formatDate(article.date)}
            <span className="inline-flex items-center gap-1">
              <Clock size={12} aria-hidden />
              {article.readingMinutes} min
            </span>
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col border border-foreground/15 bg-[var(--brand-newsprint)] transition-colors hover:border-foreground/35">
      <Link className="thumb-frame block aspect-[16/9]" href={`/articles/${article.slug}`} aria-label={article.title}>
        <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" src={article.cover} alt="" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="section-chip">{article.category}</span>
          {article.audioUrl ? (
            <Badge variant="secondary" className="rounded-sm">
              Audio
            </Badge>
          ) : null}
        </div>
        <h3 className="mt-3 line-clamp-3 font-serif text-2xl font-bold leading-tight group-hover:underline">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-foreground/15 pt-3 text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
          <span>{formatDate(article.date)}</span>
          <span className="inline-flex items-center gap-1">
            {article.readingMinutes} min <ArrowUpRight size={13} aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}
