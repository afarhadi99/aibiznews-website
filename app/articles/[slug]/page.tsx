import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Clock, Headphones, Play, Share2 } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  absoluteImageUrl,
  articleUrl,
  formatDate,
  getAdjacentArticles,
  getAllArticleMeta,
  getArticle,
  getRelatedArticles
} from "@/lib/articles";

export function generateStaticParams() {
  return getAllArticleMeta().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) {
    return {};
  }

  const canonical = articleUrl(article.slug);
  const image = absoluteImageUrl(article.cover);

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical
    },
    openGraph: {
      type: "article",
      url: canonical,
      title: article.title,
      description: article.description,
      siteName: "AIBIZ.NEWS",
      publishedTime: article.date,
      section: article.category,
      tags: article.tags,
      images: [
        {
          url: image,
          width: 1600,
          height: 900,
          alt: article.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [image]
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(article);
  const adjacent = getAdjacentArticles(article);
  const canonical = articleUrl(article.slug);
  const image = absoluteImageUrl(article.cover);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image,
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: canonical,
    author: {
      "@type": "Organization",
      name: "AIBIZ.NEWS"
    },
    publisher: {
      "@type": "Organization",
      name: "AIBIZ.NEWS"
    },
    articleSection: article.category,
    keywords: article.tags.join(", ")
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-foreground/15 bg-[var(--brand-newsprint)] dark:border-white/10">
        <div className="site-shell grid gap-4 py-5 md:py-6 lg:grid-cols-[minmax(0,760px)_330px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-sm border-teal-700/30 text-teal-800 dark:border-white/20 dark:text-[var(--brand-gold)]">
                {article.category}
              </Badge>
              {article.audioUrl ? (
                <Badge variant="secondary" className="rounded-sm">Audio</Badge>
              ) : null}
            </div>
            <h1 className="mt-3 max-w-4xl font-serif text-3xl font-bold leading-[1.04] sm:text-4xl md:text-5xl">
              {article.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              {article.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={14} aria-hidden />
                {formatDate(article.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} aria-hidden />
                {article.readingMinutes} min read
              </span>
              <span>{article.sourceCount ?? 0} sources</span>
            </div>
          </div>
          <Card className="overflow-hidden rounded-none border-foreground/15 bg-[var(--brand-ink)] py-0 text-white shadow-none dark:border-white/10 dark:bg-white/5">
            <CardContent className="p-0">
              <img className="aspect-[16/9] w-full object-cover" src={article.cover} alt="" />
              <div className="p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/70">Listen & watch</p>
                <p className="mt-2 font-serif text-xl font-bold leading-tight">
                  {article.audioUrl ? "Play the narrated version or open the channel links for this story." : "Open the channel links and source-backed story context."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.audioUrl ? (
                    <a className={buttonVariants({ variant: "secondary", className: "rounded-md" })} href={article.audioUrl}>
                      Audio <Headphones aria-hidden />
                    </a>
                  ) : null}
                  {article.youtubeUrl ? (
                    <a className={buttonVariants({ variant: "secondary", className: "rounded-md" })} href={article.youtubeUrl}>
                      YouTube <Play aria-hidden />
                    </a>
                  ) : null}
                  {article.tiktokUrl ? (
                    <a className={buttonVariants({ variant: "outline", className: "rounded-md border-white/40 text-white hover:bg-white/10 dark:hover:bg-white/10" })} href={article.tiktokUrl}>
                      TikTok <Share2 aria-hidden />
                    </a>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="site-shell grid gap-5 py-6 lg:grid-cols-[minmax(0,760px)_315px]">
        <div>
          {article.audioUrl ? (
            <Card className="mb-5 rounded-none border-foreground/15 py-0 shadow-none dark:border-white/10">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Headphones size={18} className="text-[var(--brand-teal)]" aria-hidden />
                  <p className="kicker">Listen to this article</p>
                </div>
                <audio className="w-full" controls preload="metadata" src={article.audioUrl}>
                  <a href={article.audioUrl}>Download audio</a>
                </audio>
              </CardContent>
            </Card>
          ) : null}
          <article className="article-prose" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
          <nav className="mt-8 grid gap-3 border-t pt-5 md:grid-cols-2" aria-label="Article navigation">
            {adjacent.previous ? (
              <Link className="rounded-md border bg-card p-4 hover:border-foreground/35 dark:border-white/10 dark:hover:border-white/25" href={`/articles/${adjacent.previous.slug}`}>
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                  <ArrowLeft size={14} aria-hidden /> Previous
                </span>
                <span className="mt-2 block font-serif text-xl font-bold">{adjacent.previous.title}</span>
              </Link>
            ) : <span />}
            {adjacent.next ? (
              <Link className="rounded-md border bg-card p-4 text-right hover:border-foreground/35 dark:border-white/10 dark:hover:border-white/25" href={`/articles/${adjacent.next.slug}`}>
                <span className="flex items-center justify-end gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                  Next <ArrowRight size={14} aria-hidden />
                </span>
                <span className="mt-2 block font-serif text-xl font-bold">{adjacent.next.title}</span>
              </Link>
            ) : null}
          </nav>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <Card className="rounded-none border-foreground/15 py-0 shadow-none dark:border-white/10">
            <CardContent className="p-4">
              <p className="kicker">Filed under</p>
              <Separator className="my-4" />
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-black uppercase tracking-[0.14em] text-muted-foreground">Category</dt>
                  <dd className="mt-1 font-semibold">
                    <Link className="text-blue-800 underline underline-offset-4 dark:text-sky-300" href={`/categories/${article.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}>
                      {article.category}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="font-black uppercase tracking-[0.14em] text-muted-foreground">Published</dt>
                  <dd className="mt-1 font-semibold">{formatDate(article.date)}</dd>
                </div>
                <div>
                  <dt className="font-black uppercase tracking-[0.14em] text-muted-foreground">Sources</dt>
                  <dd className="mt-1 font-semibold">{article.sourceCount ?? 0} linked references</dd>
                </div>
                {article.audioUrl ? (
                  <div>
                    <dt className="font-black uppercase tracking-[0.14em] text-muted-foreground">Audio</dt>
                    <dd className="mt-1">
                      <a className="font-semibold text-blue-800 underline underline-offset-4 dark:text-sky-300" href={article.audioUrl}>
                        Listen <Headphones size={13} className="inline" aria-hidden />
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </CardContent>
          </Card>

          <Card className="rounded-none border-foreground/15 py-0 shadow-none dark:border-white/10">
            <CardContent className="p-4">
              <p className="kicker">Tags</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>

      {related.length > 0 ? (
        <section className="border-t bg-card/55 dark:border-white/10">
          <div className="site-shell py-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="kicker">Related</p>
                <h2 className="mt-1 font-serif text-3xl font-bold md:text-4xl">More in {article.category}</h2>
              </div>
              <Link className={buttonVariants({ variant: "outline", className: "rounded-md" })} href="/">
                Home <ArrowUpRight aria-hidden />
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {related.map((item) => (
                <ArticleCard article={item} key={item.slug} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
