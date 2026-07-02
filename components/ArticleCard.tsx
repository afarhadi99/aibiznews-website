import Link from "next/link";
import { ArrowUpRight, Clock, PlayCircle } from "lucide-react";
import type { ArticleMeta } from "@/lib/articles";
import { formatDate } from "@/lib/articles";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

type ArticleCardProps = {
  article: ArticleMeta;
  compact?: boolean;
};

export function ArticleCard({ article, compact = false }: ArticleCardProps) {
  return (
    <Card className="rounded-md border-foreground/15 bg-card py-0 shadow-none transition-colors hover:border-foreground/35">
      {!compact ? (
        <Link href={`/articles/${article.slug}`} aria-label={article.title}>
          <img className="aspect-[16/9] w-full object-cover" src={article.cover} alt="" />
        </Link>
      ) : null}
      <CardHeader className="px-4 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="rounded-sm border-teal-700/25 text-teal-800">
            {article.category}
          </Badge>
          {article.videoStatus === "scheduled" || article.youtubeUrl ? (
            <Badge variant="secondary" className="rounded-sm">
              Video linked
            </Badge>
          ) : null}
        </div>
        <CardTitle className={compact ? "font-serif text-xl font-bold" : "font-serif text-2xl font-bold"}>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{article.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <span>{formatDate(article.date)}</span>
          <span className="flex items-center gap-1">
            <Clock size={13} aria-hidden />
            {article.readingMinutes} min
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-transparent px-4 py-3">
        <Link
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "h-7 gap-1 px-0 text-xs font-black uppercase tracking-[0.14em]"
          })}
          href={`/articles/${article.slug}`}
        >
          Read brief <ArrowUpRight size={14} aria-hidden />
        </Link>
        {article.youtubeUrl ? (
          <a
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "ml-auto h-7 gap-1 px-0 text-xs font-black uppercase tracking-[0.14em]"
            })}
            href={article.youtubeUrl}
          >
            Watch <PlayCircle size={14} aria-hidden />
          </a>
        ) : null}
      </CardFooter>
    </Card>
  );
}
