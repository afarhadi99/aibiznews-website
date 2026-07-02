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
      <article className="group grid grid-cols-[86px_minmax(0,1fr)] gap-3 border-b border-foreground/15 py-3 dark:border-white/10 sm:grid-cols-[120px_minmax(0,1fr)]">
        <Link className="thumb-frame aspect-[16/9] self-start" href={`/articles/${article.slug}`} aria-label={article.title}>
          <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" src={article.cover} alt="" />
        </Link>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="section-chip">{article.category}</span>
            {article.audioUrl ? <Headphones size={13} className="text-[var(--brand-teal)]" aria-hidden /> : null}
          </div>
          <h3 className="mt-1.5 line-clamp-2 font-serif text-lg font-bold leading-tight group-hover:underline sm:text-xl">
            <Link href={`/articles/${article.slug}`}>{article.title}</Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">{article.description}</p>
          <p className="mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground dark:text-white/50">
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
    <article className="group flex h-full flex-col overflow-hidden rounded-md border border-foreground/10 bg-[var(--brand-surface)] shadow-[0_10px_32px_rgba(23,23,25,0.045)] transition-colors hover:border-foreground/25 dark:border-white/10 dark:bg-white/[0.055] dark:shadow-none dark:hover:border-white/25">
      <Link className="thumb-frame block aspect-[16/9]" href={`/articles/${article.slug}`} aria-label={article.title}>
        <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" src={article.cover} alt="" />
      </Link>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="section-chip">{article.category}</span>
          {article.audioUrl ? (
            <Badge variant="secondary" className="rounded-sm">
              Audio
            </Badge>
          ) : null}
        </div>
        <h3 className="mt-2 line-clamp-3 font-serif text-lg font-bold leading-tight group-hover:underline sm:text-xl">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-foreground/10 pt-2.5 text-xs font-semibold text-muted-foreground dark:border-white/10 dark:text-white/50">
          <span>{formatDate(article.date)}</span>
          <span className="inline-flex items-center gap-1">
            {article.readingMinutes} min <ArrowUpRight size={13} aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}
