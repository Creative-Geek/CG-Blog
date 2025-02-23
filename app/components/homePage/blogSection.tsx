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
        setArticles(allArticles.slice(0, 3));
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[300px] bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Latest Blog Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              path={`Articles/${article.name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
