import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useLocation } from "react-router-dom";
import ArticleCard from "../components/articleCard";
import { BASE_URL, NAME } from "~/config/constants";

interface Article {
  name: string;
}

function BlogContent() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const articlesPerPage = 5;

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${BASE_URL}/Articles/index.json`);
      if (!response.ok) throw new Error("Failed to fetch articles");

      const articles: Article[] = await response.json();
      setAllArticles(articles);

      // Load initial page
      const initialArticles = articles.slice(0, articlesPerPage);
      setDisplayedArticles(initialArticles);
      setHasMore(articles.length > articlesPerPage);
      setPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching articles");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!hasMore || loading) return;

    const start = page * articlesPerPage;
    const end = start + articlesPerPage;
    const newArticles = allArticles.slice(start, end);

    if (newArticles.length < articlesPerPage || end >= allArticles.length) {
      setHasMore(false);
    }

    setDisplayedArticles((prev) => [...prev, ...newArticles]);
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (inView && !loading) {
      loadMore();
    }
  }, [inView]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h2 className="text-xl font-bold mb-5">Latest Posts</h2>
      <div className="space-y-6">
        {displayedArticles.map((article, index) => (
          <ArticleCard
            key={`${article.name}-${index}`}
            path={`Articles/${article.name}`}
          />
        ))}

        {loading && (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center">
            {error}. Please try refreshing the page.
          </div>
        )}

        {!loading && !error && hasMore && <div ref={ref} className="h-10" />}

        {!hasMore && !error && (
          <div className="text-center text-gray-500">
            No more articles to load
          </div>
        )}
      </div>
    </div>
  );
}

export default function Blog() {
  const location = useLocation();

  return (
    <>
      <title>{`${NAME}'s Blog`}</title>
      <BlogContent key={location.key} />
    </>
  );
}
