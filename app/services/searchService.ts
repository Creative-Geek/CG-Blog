import { BASE_URL } from "~/config/constants";

export interface Article {
  name: string;
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  content?: string;
}

interface SearchResults {
  articles: Article[];
  loading: boolean;
  error: string | null;
}

// Cache for article metadata and content
const metadataCache = new Map<string, Omit<Article, "name">>();
const contentCache = new Map<string, string>();

// Fetch the index of all articles
export async function fetchArticlesIndex(): Promise<Article[]> {
  try {
    const response = await fetch(`${BASE_URL}/Articles/index.json`);
    if (!response.ok) throw new Error("Failed to fetch articles");
    return await response.json();
  } catch (error) {
    console.error("Error fetching articles index:", error);
    throw error;
  }
}

// Fetch metadata for a specific article
export async function fetchArticleMetadata(
  articleName: string
): Promise<Omit<Article, "name">> {
  // Return from cache if available
  if (metadataCache.has(articleName)) {
    return metadataCache.get(articleName)!;
  }

  try {
    const response = await fetch(`${BASE_URL}/Articles/${articleName}.json`);
    if (!response.ok) throw new Error(`Failed to fetch metadata for ${articleName}`);
    const data = await response.json();
    metadataCache.set(articleName, data);
    return data;
  } catch (error) {
    console.error(`Error fetching metadata for ${articleName}:`, error);
    throw error;
  }
}

// Fetch content for a specific article
export async function fetchArticleContent(articleName: string): Promise<string> {
  // Return from cache if available
  if (contentCache.has(articleName)) {
    return contentCache.get(articleName)!;
  }

  try {
    const response = await fetch(`${BASE_URL}/Articles/${articleName}.md`);
    if (!response.ok) throw new Error(`Failed to fetch content for ${articleName}`);
    const content = await response.text();
    contentCache.set(articleName, content);
    return content;
  } catch (error) {
    console.error(`Error fetching content for ${articleName}:`, error);
    throw error;
  }
}

// Search articles by title and metadata
export async function searchArticles(
  query: string,
  includeContent: boolean = false
): Promise<SearchResults> {
  if (!query.trim()) {
    return { articles: [], loading: false, error: null };
  }

  try {
    const articles = await fetchArticlesIndex();
    const searchQuery = query.toLowerCase();
    const results: Article[] = [];

    // Process each article
    for (const article of articles) {
      try {
        // Fetch metadata for each article
        const metadata = await fetchArticleMetadata(article.name);
        const fullArticle = { ...article, ...metadata };

        // Check if article matches by title or description
        const titleMatch = fullArticle.title?.toLowerCase().includes(searchQuery);
        const descMatch = fullArticle.description?.toLowerCase().includes(searchQuery);

        // If we need to search in content too
        let contentMatch = false;
        if (includeContent) {
          const content = await fetchArticleContent(article.name);
          contentMatch = content.toLowerCase().includes(searchQuery);
          fullArticle.content = content; // Add content to results if needed
        }

        if (titleMatch || descMatch || contentMatch) {
          results.push(fullArticle);
        }
      } catch (error) {
        console.error(`Error processing article ${article.name}:`, error);
        // Skip failed articles but continue with others
      }
    }

    return { articles: results, loading: false, error: null };
  } catch (error) {
    console.error("Error during search:", error);
    return {
      articles: [],
      loading: false,
      error: error instanceof Error ? error.message : "Unknown error during search"
    };
  }
}
