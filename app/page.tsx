import Link from "next/link";
import { ArrowUpRight, Radio, Video } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { getAllArticleMeta, getCategories } from "@/lib/articles";

export default function HomePage() {
  const articles = getAllArticleMeta();
  const [lead, ...rest] = articles;
  const categories = getCategories();

  return (
    <main>
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <div className="eyebrow">AI business intelligence</div>
            <h1>Daily AI news with market context.</h1>
            <p className="hero-copy">
              Research-backed articles and short-form video coverage for founders, operators, investors, and builders tracking where AI changes business outcomes.
            </p>
          </div>
          <aside className="hero-aside" aria-label="Publishing stats">
            <div className="stat-row">
              <span className="stat-value">{articles.length}</span>
              <span className="stat-label">Published articles</span>
            </div>
            <div className="stat-row">
              <span className="stat-value">{categories.length}</span>
              <span className="stat-label">Coverage categories</span>
            </div>
            <div className="stat-row">
              <span className="stat-value">10/day</span>
              <span className="stat-label">Scheduled video cadence</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="section" id="latest">
        <div className="shell">
          <div className="section-head">
            <h2>Latest coverage</h2>
            <p className="muted">Articles cross-link with YouTube Shorts and TikTok posts when available.</p>
          </div>
          {lead ? (
            <div className="feature-grid">
              <article className="lead-card">
                <Link href={`/articles/${lead.slug}`}>
                  <img src={lead.cover} alt="" />
                </Link>
                <div className="lead-body">
                  <div className="eyebrow">{lead.category}</div>
                  <h2 className="lead-title">{lead.title}</h2>
                  <p>{lead.description}</p>
                  <div className="button-row">
                    <Link className="button" href={`/articles/${lead.slug}`}>
                      Read analysis <ArrowUpRight size={16} aria-hidden />
                    </Link>
                    {lead.youtubeUrl ? (
                      <a className="button secondary" href={lead.youtubeUrl}>
                        Watch <Video size={16} aria-hidden />
                      </a>
                    ) : (
                      <span className="button secondary">
                        Video pending <Radio size={16} aria-hidden />
                      </span>
                    )}
                  </div>
                </div>
              </article>
              <div className="story-grid" style={{ gridTemplateColumns: "1fr" }}>
                {rest.slice(0, 2).map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          ) : (
            <p className="muted">No articles yet. Run the daily automation to publish the first batch.</p>
          )}
        </div>
      </section>

      <section className="category-band">
        <div className="shell">
          <div className="section-head">
            <h2>Categories</h2>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <Link className="category-link" href={`/categories/${category.slug}`} key={category.slug}>
                <strong>{category.name}</strong>
                <span>{category.count} articles</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell story-grid">
          {rest.slice(2).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}
