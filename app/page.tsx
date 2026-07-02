import Link from "next/link";
import { ArrowUpRight, Headphones, Newspaper, PlayCircle } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { StoryRail } from "@/components/StoryRail";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, getAllArticleMeta, getCategories, slugify, type ArticleMeta } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

function isArticle(article: ArticleMeta | undefined): article is ArticleMeta {
  return Boolean(article);
}

export default function HomePage() {
  const articles = getAllArticleMeta();
  const [lead, second, third, fourth, ...rest] = articles;
  const categories = getCategories();
  const latestRail = [fourth, ...rest].filter(isArticle).slice(0, 7);
  const secondary = [second, third].filter(isArticle);
  const defaultCategory = categories[0]?.slug ?? "all";

  return (
    <main>
      <section className="border-b border-foreground/15 bg-[var(--brand-newsprint)]">
        <div className="site-shell py-5">
          <div className="grid gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground md:grid-cols-[1fr_auto_1fr]">
            <p>AI markets / infrastructure / platforms / policy</p>
            <p className="hidden text-center text-[var(--brand-vermilion)] md:block">Front page</p>
            <p className="hidden text-right md:block">Source-linked AI business coverage</p>
          </div>
        </div>
      </section>

      {lead ? (
        <section className="site-shell py-6" id="latest">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.56fr)_340px]">
            <article className="border-y border-foreground/20 bg-background py-5 lg:border-r lg:pr-6">
              <Link className="thumb-frame block aspect-[16/9]" href={`/articles/${lead.slug}`} aria-label={lead.title}>
                <img className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]" src={lead.cover} alt="" />
              </Link>
              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="section-chip">{lead.category}</span>
                  <span className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                    {formatDate(lead.date)}
                  </span>
                </div>
                <h1 className="mt-4 max-w-4xl font-serif text-3xl font-bold leading-[1.04] sm:text-4xl lg:text-5xl">
                  <Link href={`/articles/${lead.slug}`}>{lead.title}</Link>
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">{lead.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {lead.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" className="rounded-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link className={buttonVariants({ size: "lg", className: "rounded-md" })} href={`/articles/${lead.slug}`}>
                    Read lead story <ArrowUpRight aria-hidden />
                  </Link>
                  {lead.audioUrl ? (
                    <a className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-md" })} href={lead.audioUrl}>
                      Listen <Headphones aria-hidden />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>

            <div className="grid gap-4 border-b border-foreground/20 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
              <div className="flex items-center justify-between border-b border-foreground/20 pb-3">
                <p className="kicker">Watchlist</p>
                <span className="text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground">Companies and policy</span>
              </div>
              {secondary.map((article) => (
                <MiniStory article={article} key={article.slug} />
              ))}
              {fourth ? (
                <article className="group border border-foreground/15 bg-[var(--brand-ink)] p-4 text-white">
                  <Link className="thumb-frame mb-4 block aspect-[16/9]" href={`/articles/${fourth.slug}`} aria-label={fourth.title}>
                    <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" src={fourth.cover} alt="" />
                  </Link>
                  <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--brand-gold)]">{fourth.category}</span>
                  <h2 className="mt-2 font-serif text-2xl font-bold leading-tight group-hover:underline">
                    <Link href={`/articles/${fourth.slug}`}>{fourth.title}</Link>
                  </h2>
                </article>
              ) : null}
            </div>

            <aside className="space-y-4">
              <StoryRail title="Latest" articles={latestRail} />
              <div className="border border-foreground/15 bg-[var(--brand-ink)] p-5 text-white">
                <div className="flex items-center gap-2 text-[var(--brand-gold)]">
                  <Newspaper size={18} />
                  <p className="text-xs font-black uppercase tracking-[0.16em]">Briefing</p>
                </div>
                <Separator className="my-4 bg-white/20" />
                <p className="font-serif text-2xl font-bold leading-tight">
                  Track the companies turning model capability into revenue, distribution, and scarce compute.
                </p>
              </div>
            </aside>
          </div>
        </section>
      ) : (
        <section className="site-shell py-10">
          <p className="text-muted-foreground">No articles have been published yet.</p>
        </section>
      )}

      <section className="border-y border-foreground/15 bg-[var(--brand-ink)] text-white">
        <div className="site-shell grid gap-0 py-0 md:grid-cols-4">
          <Signal label="Companies" value="OpenAI, Nvidia, Microsoft, Google, Anthropic" />
          <Signal label="Markets" value="Cloud spend, chip supply, funding, earnings" />
          <Signal label="Products" value="Agents, models, enterprise platforms" />
          <Signal label="Policy" value="Regulation, copyright, public-sector adoption" />
        </div>
      </section>

      <section className="site-shell py-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-foreground/20 pb-4">
          <div>
            <p className="kicker">Sections</p>
            <h2 className="mt-2 font-serif text-4xl font-bold">Browse by category</h2>
          </div>
          <Link className={buttonVariants({ variant: "outline", className: "rounded-md" })} href="/#all-stories">
            All articles <ArrowUpRight aria-hidden />
          </Link>
        </div>
        {categories.length > 0 ? (
          <Tabs defaultValue={defaultCategory} className="gap-5">
            <TabsList variant="line" className="flex flex-wrap justify-start">
              {categories.map((category) => (
                <TabsTrigger key={category.slug} value={category.slug} className="px-3">
                  {category.name} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((category) => {
              const categoryArticles = articles.filter((article) => slugify(article.category) === category.slug).slice(0, 3);
              return (
                <TabsContent key={category.slug} value={category.slug}>
                  <div className="grid gap-4 md:grid-cols-3">
                    {categoryArticles.map((article) => (
                      <ArticleCard article={article} key={article.slug} />
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        ) : null}
      </section>

      <section className="site-shell pb-12" id="all-stories">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="mb-2 border-b border-foreground/20 pb-4">
              <p className="kicker">Index</p>
              <h2 className="mt-2 font-serif text-4xl font-bold">All articles</h2>
            </div>
            <div>
              {articles.map((article) => (
                <ArticleCard article={article} compact key={article.slug} />
              ))}
            </div>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="border border-foreground/15 bg-[var(--brand-newsprint)] p-5">
              <p className="kicker">Newsletter</p>
              <h3 className="mt-3 font-serif text-2xl font-bold">Get the weekly index.</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                A concise list of the most important AI business stories by category.
              </p>
              <NewsletterSignup />
            </div>
            <div className="border border-foreground/15 bg-[var(--brand-newsprint)] p-5">
              <p className="kicker">Channels</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a className={buttonVariants({ variant: "outline", className: "rounded-md" })} href={siteConfig.youtubeUrl}>
                  YouTube <PlayCircle aria-hidden />
                </a>
                {siteConfig.tiktokUrl ? (
                  <a className={buttonVariants({ variant: "outline", className: "rounded-md" })} href={siteConfig.tiktokUrl}>
                    TikTok <ArrowUpRight aria-hidden />
                  </a>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function MiniStory({ article }: { article: ArticleMeta }) {
  return (
    <article className="group border-b border-foreground/15 pb-4 last:border-b-0">
      <Link className="thumb-frame mb-3 block aspect-[16/9]" href={`/articles/${article.slug}`} aria-label={article.title}>
        <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" src={article.cover} alt="" />
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        <span className="section-chip">{article.category}</span>
        {article.audioUrl ? <Headphones size={13} className="text-[var(--brand-teal)]" aria-hidden /> : null}
      </div>
      <h2 className="mt-2 line-clamp-3 font-serif text-2xl font-bold leading-tight group-hover:underline">
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h2>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{article.description}</p>
    </article>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/15 py-5 md:border-b-0 md:border-r md:px-5 md:last:border-r-0">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--brand-gold)]">{label}</p>
      <p className="mt-2 font-serif text-xl font-bold leading-tight">{value}</p>
    </div>
  );
}
