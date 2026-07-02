import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleMeta } from "@/lib/articles";
import { formatDate } from "@/lib/articles";

export function StoryRail({ title, articles }: { title: string; articles: ArticleMeta[] }) {
  return (
    <aside className="border-2 border-foreground/20 bg-[var(--brand-newsprint)] dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-3 bg-[var(--brand-ink)] px-3 py-2 text-white dark:bg-white/10">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--brand-gold)]">{title}</p>
        <ArrowUpRight size={15} className="text-white/55" aria-hidden />
      </div>
      <div className="px-3">
        {articles.map((article, index) => (
          <Link
            href={`/articles/${article.slug}`}
            className="group grid grid-cols-[1.7rem_minmax(0,1fr)] gap-2 border-b border-foreground/15 py-3 last:border-b-0 dark:border-white/10"
            key={article.slug}
          >
            <span className="font-serif text-xl font-bold text-[var(--brand-vermilion)] dark:text-[var(--brand-gold)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>
              <span className="line-clamp-2 block font-serif text-base font-bold leading-snug group-hover:underline">
                {article.title}
              </span>
              <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground dark:text-white/48">
                {formatDate(article.date)} / {article.readingMinutes} min
              </span>
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
