import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ArticleCard from "../components/articleCard";
import { BASE_URL } from "~/config/constants";

interface Article {
  name: string;
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
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
      if (!hasMore) return;
      
      const response = await fetch(`${BASE_URL}/Articles/index.json`);
      if (!response.ok) throw new Error("Failed to fetch articles");
      
      const allArticles: Article[] = await response.json();
      const start = page * articlesPerPage;
      const end = start + articlesPerPage;
      const newArticles = allArticles.slice(start, end);
      
      if (newArticles.length < articlesPerPage) {
        setHasMore(false);
      }
      
      setArticles(prev => [...prev, ...newArticles]);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (inView && !loading) {
      fetchArticles();
    }
  }, [inView]);

  return (
    <>
      <title>CG Blog</title>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-xl font-bold mb-5">Latest Posts</h2>
        <div className="space-y-6">
          {articles.map((article, index) => (
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
          
          {error && <div className="text-red-500 text-center">{error}</div>}
          
          {!loading && !error && hasMore && (
            <div ref={ref} className="h-10" />
          )}
          
          {!hasMore && !error && (
            <div className="text-center text-gray-500">No more articles to load</div>
          )}
        </div>
      </div>
    </>
  );
}
