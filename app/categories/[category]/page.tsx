import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Rss } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, getArticlesByCategory, getCategories } from "@/lib/articles";

export function generateStaticParams() {
  return getCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const articles = getArticlesByCategory(category);
  const label = articles[0]?.category ?? category.replace(/-/g, " ");
  return {
    title: label,
    description: `AI Biz News coverage for ${label}.`,
    openGraph: {
      title: `${label} | AIBIZ.NEWS`,
      description: `AI Biz News coverage for ${label}.`,
      images: [articles[0]?.cover ?? "/images/covers/default.svg"]
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} | AIBIZ.NEWS`,
      images: [articles[0]?.cover ?? "/images/covers/default.svg"]
    }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const articles = getArticlesByCategory(category);
  const [lead, ...rest] = articles;
  const label = articles[0]?.category ?? category.replace(/-/g, " ");
  const sourceTotal = articles.reduce((sum, article) => sum + (article.sourceCount ?? 0), 0);

  return (
    <main>
      <section className="frontpage-bg border-b-2 border-foreground/20 text-foreground dark:border-white/10 dark:text-white">
        <div className="site-shell py-4 md:py-6">
          <Link className={buttonVariants({ variant: "ghost", className: "mb-3 rounded-none px-0 text-muted-foreground hover:bg-transparent hover:text-foreground dark:text-white/70 dark:hover:text-white" })} href="/">
            <ArrowLeft aria-hidden /> Front page
          </Link>
          <div className="border-y-2 border-foreground/25 py-4 dark:border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-none bg-[var(--brand-teal)] text-white">Section</Badge>
              <Badge variant="outline" className="rounded-none border-foreground/20 text-foreground dark:border-white/25 dark:text-white">
                {articles.length} articles
              </Badge>
              <Badge variant="outline" className="rounded-none border-foreground/20 text-foreground dark:border-white/25 dark:text-white">
                {sourceTotal} linked sources
              </Badge>
            </div>
            <h1 className="mt-3 font-serif text-5xl font-bold leading-[0.98] md:text-6xl">{label}</h1>
          </div>
        </div>
      </section>

      {lead ? (
        <section className="site-shell py-5 md:py-6">
          <article className="lead-package grid gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.85fr)]">
            <Link className="thumb-frame aspect-[16/9]" href={`/articles/${lead.slug}`} aria-label={lead.title}>
              <img className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]" src={lead.cover} alt="" />
            </Link>
            <div className="flex flex-col p-4 lg:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="section-chip">{lead.category}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                  {formatDate(lead.date)}
                </span>
              </div>
              <h2 className="mt-3 font-serif text-4xl font-bold leading-[1.02] md:text-5xl">
                <Link href={`/articles/${lead.slug}`}>{lead.title}</Link>
              </h2>
              <p className="mt-3 line-clamp-3 text-base leading-7 text-muted-foreground">{lead.description}</p>
              <Link className="mt-auto pt-5 text-xs font-black uppercase tracking-[0.14em] text-[var(--brand-vermilion)]" href={`/articles/${lead.slug}`}>
                Read section lead <ArrowUpRight size={15} className="inline" aria-hidden />
              </Link>
            </div>
          </article>

          {rest.length > 0 ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((article) => (
                <ArticleCard article={article} key={article.slug} />
              ))}
            </div>
          ) : null}
        </section>
      ) : (
        <section className="site-shell py-9">
          <Card className="rounded-md border-foreground/15 py-0 shadow-none">
            <CardContent className="flex items-center gap-4 p-6">
              <Rss className="text-muted-foreground" aria-hidden />
              <div>
                <p className="font-serif text-2xl font-bold">No articles in this section yet.</p>
                <p className="mt-1 text-muted-foreground">This section is ready for new coverage.</p>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </main>
  );
}
