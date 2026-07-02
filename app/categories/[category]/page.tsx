import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { getArticlesByCategory, getCategories } from "@/lib/articles";

export function generateStaticParams() {
  return getCategories().map((category) => ({ category: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const articles = getArticlesByCategory(category);
  const label = articles[0]?.category ?? category.replace(/-/g, " ");

  return (
    <main>
      <section className="hero">
        <div className="shell">
          <div className="eyebrow">Category</div>
          <h1>{label}</h1>
          <p className="hero-copy">Focused coverage for this AI business lane.</p>
        </div>
      </section>
      <section className="section">
        <div className="shell story-grid">
          {articles.map((article) => (
            <ArticleCard article={article} key={article.slug} />
          ))}
        </div>
        {articles.length === 0 ? (
          <div className="shell">
            <p className="muted">No articles in this category yet.</p>
            <Link className="button secondary" href="/">
              Back home
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
