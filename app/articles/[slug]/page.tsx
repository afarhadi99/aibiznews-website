import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Clock, ExternalLink, Headphones, Play, Share2 } from "lucide-react";
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
      siteName: "AI Biz News Network",
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
      name: "AI Biz News Network"
    },
    publisher: {
      "@type": "Organization",
      name: "AI Biz News Network"
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
      <section className="border-b">
        <div className="site-shell grid gap-7 py-8 lg:grid-cols-[minmax(0,780px)_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-sm border-teal-700/30 text-teal-800">
                {article.category}
              </Badge>
              {article.audioUrl ? (
                <Badge variant="secondary" className="rounded-sm">Audio</Badge>
              ) : null}
            </div>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-[1.02] md:text-6xl">
              {article.title}
            </h1>
            <p className="mt-5 max-w-3xl text-xl leading-8 text-muted-foreground">
              {article.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
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
          <Card className="rounded-md border-foreground/15 bg-primary py-0 text-primary-foreground shadow-none">
            <CardContent className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-primary-foreground/70">Article media</p>
              <p className="mt-3 font-serif text-2xl font-bold leading-tight">
                Read the story, listen to the narration, and open related channel links when available.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
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
                  <a className={buttonVariants({ variant: "outline", className: "rounded-md border-white/40 text-white hover:bg-white/10" })} href={article.tiktokUrl}>
                    TikTok <Share2 aria-hidden />
                  </a>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="site-shell py-7">
        <img className="aspect-[16/9] w-full rounded-md border object-cover" src={article.cover} alt="" />
      </section>

      <section className="site-shell grid gap-8 pb-12 lg:grid-cols-[minmax(0,760px)_340px]">
        <div>
          {article.audioUrl ? (
            <Card className="mb-7 rounded-md border-foreground/15 py-0 shadow-none">
              <CardContent className="p-5">
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
          <nav className="mt-10 grid gap-3 border-t pt-6 md:grid-cols-2" aria-label="Article navigation">
            {adjacent.previous ? (
              <Link className="rounded-md border bg-card p-4 hover:border-foreground/35" href={`/articles/${adjacent.previous.slug}`}>
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                  <ArrowLeft size={14} aria-hidden /> Previous
                </span>
                <span className="mt-2 block font-serif text-xl font-bold">{adjacent.previous.title}</span>
              </Link>
            ) : <span />}
            {adjacent.next ? (
              <Link className="rounded-md border bg-card p-4 text-right hover:border-foreground/35" href={`/articles/${adjacent.next.slug}`}>
                <span className="flex items-center justify-end gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                  Next <ArrowRight size={14} aria-hidden />
                </span>
                <span className="mt-2 block font-serif text-xl font-bold">{adjacent.next.title}</span>
              </Link>
            ) : null}
          </nav>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <Card className="rounded-md border-foreground/15 py-0 shadow-none">
            <CardContent className="p-5">
              <p className="kicker">Story metadata</p>
              <Separator className="my-4" />
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-black uppercase tracking-[0.14em] text-muted-foreground">Category</dt>
                  <dd className="mt-1 font-semibold">
                    <Link className="text-blue-800 underline underline-offset-4" href={`/categories/${article.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}>
                      {article.category}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="font-black uppercase tracking-[0.14em] text-muted-foreground">Featured image</dt>
                  <dd className="mt-1 break-words text-muted-foreground">{article.cover}</dd>
                </div>
                <div>
                  <dt className="font-black uppercase tracking-[0.14em] text-muted-foreground">Canonical</dt>
                  <dd className="mt-1">
                    <a className="font-semibold text-blue-800 underline underline-offset-4" href={canonical}>
                      Article URL <ExternalLink size={13} className="inline" aria-hidden />
                    </a>
                  </dd>
                </div>
                {article.audioUrl ? (
                  <div>
                    <dt className="font-black uppercase tracking-[0.14em] text-muted-foreground">Audio</dt>
                    <dd className="mt-1">
                      <a className="font-semibold text-blue-800 underline underline-offset-4" href={article.audioUrl}>
                        Listen <Headphones size={13} className="inline" aria-hidden />
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </CardContent>
          </Card>

          <Card className="rounded-md border-foreground/15 py-0 shadow-none">
            <CardContent className="p-5">
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
        <section className="border-t bg-card/55">
          <div className="site-shell py-10">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="kicker">Related</p>
                <h2 className="mt-2 font-serif text-4xl font-bold">More in {article.category}</h2>
              </div>
              <Link className={buttonVariants({ variant: "outline", className: "rounded-md" })} href="/">
                Home <ArrowUpRight aria-hidden />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
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
