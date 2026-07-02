import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Rss } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getArticlesByCategory, getCategories } from "@/lib/articles";

export function generateStaticParams() {
  return getCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const articles = getArticlesByCategory(category);
  const label = articles[0]?.category ?? category.replace(/-/g, " ");
  return {
    title: label,
    description: `AI Biz News Network coverage for ${label}.`,
    openGraph: {
      title: `${label} | AI Biz News Network`,
      description: `AI Biz News Network coverage for ${label}.`,
      images: [articles[0]?.cover ?? "/images/covers/default.svg"]
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} | AI Biz News Network`,
      images: [articles[0]?.cover ?? "/images/covers/default.svg"]
    }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const articles = getArticlesByCategory(category);
  const label = articles[0]?.category ?? category.replace(/-/g, " ");

  return (
    <main>
      <section className="border-b">
        <div className="site-shell py-9">
          <Link className={buttonVariants({ variant: "ghost", className: "mb-5 rounded-md px-0" })} href="/">
            <ArrowLeft aria-hidden /> Back to front page
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-sm bg-teal-800 text-white">Category</Badge>
            <Badge variant="outline" className="rounded-sm">
              {articles.length} articles
            </Badge>
          </div>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-tight md:text-6xl">{label}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            A dedicated section for tracking how this area of AI changes markets, products, strategy, and operations.
          </p>
        </div>
      </section>
      <section className="site-shell py-9">
        {articles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard article={article} key={article.slug} />
            ))}
          </div>
        ) : (
          <Card className="rounded-md border-foreground/15 py-0 shadow-none">
            <CardContent className="flex items-center gap-4 p-6">
              <Rss className="text-muted-foreground" aria-hidden />
              <div>
                <p className="font-serif text-2xl font-bold">No articles in this category yet.</p>
                <p className="mt-1 text-muted-foreground">This section is ready for new coverage.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
