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
    description: `AIBIZ.NEWS technology coverage for ${label}.`,
    openGraph: {
      title: `${label} | AIBIZ.NEWS`,
      description: `AIBIZ.NEWS technology coverage for ${label}.`,
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
      <section className="briefing-hero border-b border-foreground/12 text-foreground dark:border-white/10 dark:text-white">
        <div className="site-shell py-5 md:py-7">
          <Link className={buttonVariants({ variant: "ghost", className: "rounded-md px-0 text-muted-foreground hover:bg-transparent hover:text-foreground dark:text-white/70 dark:hover:text-white" })} href="/">
            <ArrowLeft aria-hidden /> Front page
          </Link>
          <div className="mt-4 grid gap-4 border-y border-foreground/12 py-4 dark:border-white/10 md:grid-cols-[minmax(0,1fr)_280px] md:items-end">
            <div>
              <span className="soft-label">Section</span>
              <h1 className="mt-3 font-serif text-[2.45rem] font-bold leading-[1.02] sm:text-5xl md:text-6xl">{label}</h1>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Badge variant="outline" className="justify-center rounded-md border-foreground/15 bg-white/50 py-1.5 text-foreground dark:border-white/15 dark:bg-white/5 dark:text-white">
                {articles.length} articles
              </Badge>
              <Badge variant="outline" className="justify-center rounded-md border-foreground/15 bg-white/50 py-1.5 text-foreground dark:border-white/15 dark:bg-white/5 dark:text-white">
                {sourceTotal} sources
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {lead ? (
        <section className="site-shell py-5 md:py-7">
          <article className="feature-story group">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
              <Link className="thumb-frame block aspect-[16/9] lg:aspect-auto" href={`/articles/${lead.slug}`} aria-label={lead.title}>
                <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" src={lead.cover} alt="" />
              </Link>
              <div className="flex flex-col p-4 sm:p-5 lg:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="section-chip">{lead.category}</span>
                  <span className="text-xs font-bold text-muted-foreground dark:text-white/55">
                    {formatDate(lead.date)}
                  </span>
                </div>
                <h2 className="mt-3 font-serif text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                  <Link href={`/articles/${lead.slug}`}>{lead.title}</Link>
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground dark:text-white/58 sm:text-base sm:leading-7">{lead.description}</p>
                <Link className="mt-auto pt-5 text-sm font-bold text-[var(--brand-teal)] hover:underline dark:text-[var(--brand-gold)]" href={`/articles/${lead.slug}`}>
                  Read section lead <ArrowUpRight size={15} className="inline" aria-hidden />
                </Link>
              </div>
            </div>
          </article>

          {rest.length > 0 ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
