import ReactMarkdown from "react-markdown";
import { startsWithArabic } from "~/lib/utils";
import { useEffect, useState } from "react";

interface ArticleMetadata {
  title: string;
  image: string;
  description: string;
  date: string;
  author: string;
}

interface ArticleProps {
  // Direct props
  title?: string;
  content?: string;
  image?: string;
  description?: string;
  date?: string;
  author?: string;
  // Path-based props
  path?: string;
}

const BASE_URL = "https://cg-blog-articles.pages.dev";

// Custom components for ReactMarkdown
const components = {
  p: ({ children, ...props }: React.HTMLProps<HTMLParagraphElement>) => {
    const text = children?.toString() || "";
    const isRTL = startsWithArabic(text);

    return (
      <p
        {...props}
        dir={isRTL ? "rtl" : "ltr"}
        className={`mb-4 ${isRTL ? "text-right" : "text-left"}`}
      >
        {children}
      </p>
    );
  },
};

export function Article(props: ArticleProps) {
  const [content, setContent] = useState<string>(props.content || "");
  const [metadata, setMetadata] = useState<ArticleMetadata | null>(
    props.title
      ? {
          title: props.title,
          image: props.image || "",
          description: props.description || "",
          date: props.date || "",
          author: props.author || "",
        }
      : null
  );
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(!!props.path);

  useEffect(() => {
    async function fetchContent() {
      if (!props.path) return;

      try {
        setLoading(true);
        // Fetch markdown content
        const markdownResponse = await fetch(`${BASE_URL}/${props.path}.md`);
        if (!markdownResponse.ok)
          throw new Error("Failed to fetch markdown content");
        const markdownContent = await markdownResponse.text();

        // Fetch metadata
        const metadataResponse = await fetch(`${BASE_URL}/${props.path}.json`);
        if (!metadataResponse.ok) throw new Error("Failed to fetch metadata");
        const metadataContent = await metadataResponse.json();

        setContent(markdownContent);
        setMetadata(metadataContent);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch content"
        );
      } finally {
        setLoading(false);
      }
    }

    if (props.path) {
      fetchContent();
    }
  }, [props.path]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!metadata || !content) {
    return <div>No content available</div>;
  }

  return (
    <article className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header Section */}
      <header className="mb-8">
        {metadata.title && (
          <h1 className="text-3xl font-bold mb-4 text-center">
            {metadata.title}
          </h1>
        )}

        {/* Meta Information */}
        <div className="space-y-3">
          {(metadata.author || metadata.date) && (
            <div className="flex items-center justify-center gap-3 text-gray-600">
              {metadata.author && (
                <span className="font-medium">{metadata.author}</span>
              )}
              {metadata.author && metadata.date && <span>•</span>}
              {metadata.date && (
                <time className="text-sm">{metadata.date}</time>
              )}
            </div>
          )}

          {metadata.description && (
            <p className="text-base text-gray-600 text-center">
              {metadata.description}
            </p>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {metadata.image && (
        <div className="mb-8">
          <img
            src={metadata.image}
            alt={metadata.title || "Article featured image"}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Article Content */}
      <div className="prose max-w-none">
        <ReactMarkdown components={components}>{content}</ReactMarkdown>
      </div>
    </article>
  );
}
