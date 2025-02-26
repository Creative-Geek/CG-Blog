import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useLocation, useLoaderData } from "react-router-dom";
import ArticleCard from "../components/articleCard";
import { BASE_URL, NAME } from "~/config/constants";
import { PageTransition } from "~/components/PageTransition";

interface Article {
  name: string;
}

interface BlogState {
  scrollRatio: number;
  displayedArticles: Article[];
  page: number;
}

// Helper functions for state management
const getBlogState = (): BlogState => {
  if (typeof window === 'undefined') return { scrollRatio: 0, displayedArticles: [], page: 1 };
  
  try {
    const state = sessionStorage.getItem('blogState');
    return state ? JSON.parse(state) : { scrollRatio: 0, displayedArticles: [], page: 1 };
  } catch {
    return { scrollRatio: 0, displayedArticles: [], page: 1 };
  }
};

const saveBlogState = (state: BlogState) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('blogState', JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save blog state:', error);
  }
};

// Helper function to get scroll ratio
const getScrollRatio = () => {
  if (typeof window === 'undefined') return 0;
  
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) return 0;
  return window.scrollY / scrollHeight;
};

// Helper function to restore scroll position from ratio
const restoreScrollFromRatio = (ratio: number) => {
  if (typeof window === 'undefined') return;
  
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const targetScroll = ratio * scrollHeight;
  window.scrollTo(0, targetScroll);
};

export async function loader() {
  try {
    const response = await fetch(`${BASE_URL}/Articles/index.json`);
    if (!response.ok) throw new Error("Failed to fetch articles");
    const articles: Article[] = await response.json();
    const initialArticles = articles.slice(0, 5);
    return { initialArticles, totalArticles: articles };
  } catch (error) {
    throw new Error("Failed to load articles");
  }
}

function BlogContent() {
  const { initialArticles, totalArticles } = useLoaderData() as { 
    initialArticles: Article[], 
    totalArticles: Article[] 
  };
  
  const [isClient, setIsClient] = useState(false);
  const savedState = useRef(getBlogState());
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>(
    savedState.current.displayedArticles.length > 0 
      ? savedState.current.displayedArticles 
      : initialArticles
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(savedState.current.page);
  const [hasMore, setHasMore] = useState(totalArticles.length > displayedArticles.length);
  const articlesPerPage = 5;

  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Mark when we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Restore scroll position when component mounts on client and when articles update
  useEffect(() => {
    if (!isClient) return;

    // Use requestAnimationFrame to ensure the DOM has updated
    const timeoutId = setTimeout(() => {
      if (savedState.current.scrollRatio > 0) {
        restoreScrollFromRatio(savedState.current.scrollRatio);
      }
    }, 100); // Small delay to ensure content has rendered

    return () => clearTimeout(timeoutId);
  }, [isClient, displayedArticles]);

  // Save state when component updates
  useEffect(() => {
    if (!isClient) return;

    const currentState: BlogState = {
      scrollRatio: getScrollRatio(),
      displayedArticles,
      page,
    };
    saveBlogState(currentState);
  }, [isClient, displayedArticles, page]);

  // Update scroll position on scroll
  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      const currentState = getBlogState();
      saveBlogState({
        ...currentState,
        scrollRatio: getScrollRatio(),
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient]);

  const loadMore = () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const start = page * articlesPerPage;
    const end = start + articlesPerPage;
    const newArticles = totalArticles.slice(start, end);

    if (newArticles.length < articlesPerPage || end >= totalArticles.length) {
      setHasMore(false);
    }

    setDisplayedArticles((prev) => [...prev, ...newArticles]);
    setPage((prev) => prev + 1);
    setLoading(false);
  };

  useEffect(() => {
    if (inView && !loading) {
      loadMore();
    }
  }, [inView]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8" ref={contentRef}>
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
  return (
    <PageTransition>
      <title>{`${NAME}'s Blog`}</title>
      <BlogContent />
    </PageTransition>
  );
}
