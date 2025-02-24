import ArticleCard from "../articleCard";

interface Article {
  name: string;
}

interface FeaturedArticle {
  path: string;
}

interface BlogSectionProps {
  loading?: boolean;
  articles?: Array<Article>;
  featuredArticles?: Array<FeaturedArticle>;
}

export default function BlogSection({ loading, articles = [], featuredArticles = [] }: BlogSectionProps) {
  if (loading) {
    return (
      <section className="container py-16">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <div className="h-8 w-64 animate-pulse rounded-md bg-muted mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm h-[300px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!articles.length && !featuredArticles.length) return null;

  const displayArticles = featuredArticles.length ? featuredArticles : articles;
  const title = featuredArticles.length ? "Featured Articles" : "Latest Blog Posts";

  return (
    <section className="container py-16">
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tighter">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.map((article, index) => (
            <ArticleCard
              key={index}
              path={featuredArticles.length ? (article as FeaturedArticle).path : `Articles/${(article as Article).name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
