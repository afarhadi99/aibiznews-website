import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleMeta } from "@/lib/articles";
import { formatDate } from "@/lib/articles";
import { Separator } from "@/components/ui/separator";

export function StoryRail({ title, articles }: { title: string; articles: ArticleMeta[] }) {
  return (
    <aside className="rounded-md border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="kicker">{title}</p>
        <ArrowUpRight size={16} className="text-muted-foreground" aria-hidden />
      </div>
      <div className="mt-4 space-y-4">
        {articles.map((article, index) => (
          <div key={article.slug}>
            {index > 0 ? <Separator className="mb-4" /> : null}
            <Link href={`/articles/${article.slug}`} className="group block">
              <p className="font-serif text-lg font-bold leading-snug group-hover:underline">
                {article.title}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {formatDate(article.date)} · {article.readingMinutes} min
              </p>
            </Link>
          </div>
        ))}
      </div>
    </aside>
  );
}
