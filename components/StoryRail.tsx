import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleMeta } from "@/lib/articles";
import { formatDate } from "@/lib/articles";

export function StoryRail({ title, articles, dark = false }: { title: string; articles: ArticleMeta[]; dark?: boolean }) {
  return (
    <aside className={dark ? "border border-white/12 bg-white/[0.04] p-3 text-white" : "editorial-panel p-3"}>
      <div className={dark ? "flex items-center justify-between gap-3 border-b border-white/12 pb-2" : "flex items-center justify-between gap-3 border-b border-foreground/20 pb-2"}>
        <p className={dark ? "text-[10px] font-black uppercase tracking-[0.16em] text-[var(--brand-gold)]" : "kicker"}>{title}</p>
        <ArrowUpRight size={15} className={dark ? "text-white/45" : "text-muted-foreground"} aria-hidden />
      </div>
      <div>
        {articles.map((article, index) => (
          <Link
            href={`/articles/${article.slug}`}
            className={dark ? "group grid grid-cols-[1.7rem_minmax(0,1fr)] gap-2 border-b border-white/10 py-3 last:border-b-0" : "group grid grid-cols-[1.7rem_minmax(0,1fr)] gap-2 border-b border-foreground/15 py-3 last:border-b-0"}
            key={article.slug}
          >
            <span className="font-serif text-xl font-bold text-[var(--brand-vermilion)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>
              <span className="line-clamp-2 block font-serif text-base font-bold leading-snug group-hover:underline">
                {article.title}
              </span>
              <span className={dark ? "mt-1 block text-[10px] font-black uppercase tracking-[0.14em] text-white/48" : "mt-1 block text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground"}>
                {formatDate(article.date)} / {article.readingMinutes} min
              </span>
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
