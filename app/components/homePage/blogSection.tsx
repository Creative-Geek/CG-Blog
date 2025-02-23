import { useEffect, useState } from "react";
import { BASE_URL } from "~/config/constants";
import ArticleCard from "../articleCard";

interface Article {
  name: string;
}

export default function BlogSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(`${BASE_URL}/Articles/index.json`);
        if (!response.ok) throw new Error("Failed to fetch articles");
        const allArticles = await response.json();
        // Get the latest 3 articles
        setArticles(allArticles.slice(0, 4));
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="container py-16">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <div className="h-8 w-64 animate-pulse rounded-md bg-muted mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-lg border bg-card text-card-foreground shadow-sm h-[300px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-16">
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tighter">
            Latest Blog Posts
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={index} path={`Articles/${article.name}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
