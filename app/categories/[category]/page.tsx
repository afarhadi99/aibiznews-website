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

  return (
    <main>
      <section className="border-b border-foreground/15 bg-[var(--brand-newsprint)]">
        <div className="site-shell py-8">
          <Link className={buttonVariants({ variant: "ghost", className: "mb-5 rounded-md px-0" })} href="/">
            <ArrowLeft aria-hidden /> Front page
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-sm bg-teal-800 text-white">Section</Badge>
            <Badge variant="outline" className="rounded-sm">
              {articles.length} articles
            </Badge>
          </div>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-tight md:text-6xl">{label}</h1>
        </div>
      </section>

      {lead ? (
        <section className="site-shell py-8">
          <article className="grid gap-5 border-b border-foreground/20 pb-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
            <Link className="thumb-frame aspect-[16/9]" href={`/articles/${lead.slug}`} aria-label={lead.title}>
              <img className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]" src={lead.cover} alt="" />
            </Link>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="section-chip">{lead.category}</span>
                <span className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                  {formatDate(lead.date)}
                </span>
              </div>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
                <Link href={`/articles/${lead.slug}`}>{lead.title}</Link>
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{lead.description}</p>
              <Link className="mt-auto pt-6 text-sm font-black uppercase tracking-[0.14em] text-[var(--brand-vermilion)]" href={`/articles/${lead.slug}`}>
                Read section lead <ArrowUpRight size={15} className="inline" aria-hidden />
              </Link>
            </div>
          </article>

          {rest.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
