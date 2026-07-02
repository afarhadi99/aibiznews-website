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
      {lead ? (
        <section className="border-b border-white/10 bg-[var(--brand-ink)] text-white" id="latest">
          <div className="site-shell py-4 md:py-5">
            <div className="mb-3 grid gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/58 md:grid-cols-[1fr_auto_1fr]">
              <p>AI markets / infrastructure / platforms / policy</p>
              <p className="hidden text-center text-[var(--brand-gold)] md:block">Front page</p>
              <p className="hidden text-right md:block">Source-linked AI business coverage</p>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.08fr)_minmax(260px,0.58fr)_315px]">
              <article className="overflow-hidden border border-white/12 bg-[var(--brand-newsprint)] text-[var(--brand-ink)]">
                <Link className="thumb-frame block aspect-[16/9]" href={`/articles/${lead.slug}`} aria-label={lead.title}>
                  <img className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]" src={lead.cover} alt="" />
                </Link>
                <div className="flex flex-col p-3 sm:p-4 lg:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="section-chip">{lead.category}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                      {formatDate(lead.date)}
                    </span>
                  </div>
                  <h1 className="mt-3 font-serif text-[2rem] font-bold leading-[1.02] sm:text-4xl lg:text-[2.75rem]">
                    <Link href={`/articles/${lead.slug}`}>{lead.title}</Link>
                  </h1>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">{lead.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {lead.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-sm border-foreground/20 bg-white/50 text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    <Link className={buttonVariants({ className: "rounded-md bg-[var(--brand-ink)] text-white hover:bg-[var(--brand-ink)]/86" })} href={`/articles/${lead.slug}`}>
                      Read <ArrowUpRight aria-hidden />
                    </Link>
                    {lead.audioUrl ? (
                      <a className={buttonVariants({ variant: "outline", className: "rounded-md border-foreground/20 bg-transparent" })} href={lead.audioUrl}>
                        Listen <Headphones aria-hidden />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>

              <div className="grid gap-3 border border-white/12 bg-white/[0.035] p-3">
                <div className="flex items-center justify-between border-b border-white/12 pb-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--brand-gold)]">Watchlist</p>
                  <span className="text-[10px] font-black uppercase tracking-[0.14em] text-white/50">Companies</span>
                </div>
                {secondary.map((article) => (
                  <MiniStory article={article} key={article.slug} />
                ))}
                {fourth ? (
                  <MiniStory article={fourth} key={fourth.slug} accent />
                ) : null}
              </div>

              <aside className="grid gap-3">
                <StoryRail title="Latest" articles={latestRail} dark />
                <div className="border border-white/12 bg-white/[0.04] p-4 text-white">
                  <div className="flex items-center gap-2 text-[var(--brand-gold)]">
                    <Newspaper size={16} />
                    <p className="text-[10px] font-black uppercase tracking-[0.16em]">Briefing</p>
                  </div>
                  <Separator className="my-3 bg-white/15" />
                  <p className="font-serif text-xl font-bold leading-tight">
                    Track the companies turning model capability into revenue, distribution, and scarce compute.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      ) : (
        <section className="site-shell py-10">
          <p className="text-muted-foreground">No articles have been published yet.</p>
        </section>
      )}

      <section className="border-y border-foreground/15 bg-[var(--brand-cobalt)] text-white">
        <div className="site-shell grid gap-0 py-0 sm:grid-cols-2 lg:grid-cols-4">
          <Signal label="Companies" value="OpenAI, Nvidia, Microsoft, Google, Anthropic" />
          <Signal label="Markets" value="Cloud spend, chip supply, funding, earnings" />
          <Signal label="Products" value="Agents, models, enterprise platforms" />
          <Signal label="Policy" value="Regulation, copyright, public-sector adoption" />
        </div>
      </section>

      <section className="site-shell py-6 md:py-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-foreground/20 pb-3">
          <div>
            <p className="kicker">Sections</p>
            <h2 className="mt-1 font-serif text-3xl font-bold md:text-4xl">Browse by category</h2>
          </div>
          <Link className={buttonVariants({ variant: "outline", className: "rounded-md" })} href="/#all-stories">
            All articles <ArrowUpRight aria-hidden />
          </Link>
        </div>
        {categories.length > 0 ? (
          <Tabs defaultValue={defaultCategory} className="gap-4">
            <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
            <TabsList variant="line" className="flex min-w-max justify-start">
              {categories.map((category) => (
                <TabsTrigger key={category.slug} value={category.slug} className="px-2.5 text-xs">
                  {category.name} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>
            </div>
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

      <section className="site-shell pb-9 md:pb-12" id="all-stories">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_315px]">
          <div>
            <div className="mb-1 border-b border-foreground/20 pb-3">
              <p className="kicker">Index</p>
              <h2 className="mt-1 font-serif text-3xl font-bold md:text-4xl">All articles</h2>
            </div>
            <div>
              {articles.map((article) => (
                <ArticleCard article={article} compact key={article.slug} />
              ))}
            </div>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="editorial-panel p-4">
              <p className="kicker">Newsletter</p>
              <h3 className="mt-2 font-serif text-2xl font-bold">Get the weekly index.</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                A concise list of the most important AI business stories by category.
              </p>
              <NewsletterSignup />
            </div>
            <div className="editorial-panel p-4">
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

function MiniStory({ article, accent = false }: { article: ArticleMeta; accent?: boolean }) {
  return (
    <article className={accent ? "group border-t border-white/12 pt-3" : "group"}>
      <Link className="thumb-frame mb-2 block aspect-[16/9]" href={`/articles/${article.slug}`} aria-label={article.title}>
        <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" src={article.cover} alt="" />
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        <span className="section-chip">{article.category}</span>
        {article.audioUrl ? <Headphones size={12} className="text-[var(--brand-gold)]" aria-hidden /> : null}
      </div>
      <h2 className="mt-2 line-clamp-2 font-serif text-xl font-bold leading-tight text-white group-hover:underline">
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h2>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/58">{article.description}</p>
    </article>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/15 py-3 sm:border-r sm:px-4 sm:last:border-r-0 lg:border-b-0">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--brand-gold)]">{label}</p>
      <p className="mt-1 text-sm font-bold leading-snug">{value}</p>
    </div>
  );
}
