import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleMeta } from "@/lib/articles";
import { formatDate } from "@/lib/articles";

export function StoryRail({ title, articles }: { title: string; articles: ArticleMeta[] }) {
  return (
    <aside className="border border-foreground/15 bg-[var(--brand-newsprint)] p-4">
      <div className="flex items-center justify-between gap-3 border-b border-foreground/20 pb-3">
        <p className="kicker">{title}</p>
        <ArrowUpRight size={16} className="text-muted-foreground" aria-hidden />
      </div>
      <div>
        {articles.map((article, index) => (
          <Link
            href={`/articles/${article.slug}`}
            className="group grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-foreground/15 py-4 last:border-b-0"
            key={article.slug}
          >
            <span className="font-serif text-2xl font-bold text-[var(--brand-vermilion)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>
              <span className="block font-serif text-lg font-bold leading-snug group-hover:underline">
                {article.title}
              </span>
              <span className="mt-2 block text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                {formatDate(article.date)} / {article.readingMinutes} min
              </span>
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
