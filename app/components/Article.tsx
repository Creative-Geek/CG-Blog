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
  title?: string;
  content?: string;
  image?: string;
  description?: string;
  date?: string;
  author?: string;
  path?: string;
}

const BASE_URL = "https://cg-blog-articles.pages.dev";

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
        const markdownResponse = await fetch(`${BASE_URL}/${props.path}.md`);
        if (!markdownResponse.ok)
          throw new Error("Failed to fetch markdown content");
        const markdownContent = await markdownResponse.text();

        const metadataResponse = await fetch(`${BASE_URL}/${props.path}.json`);
        if (!metadataResponse.ok) throw new Error("Failed to fetch metadata");
        const metadataContent = await metadataResponse.json();

        // Image fallback check
        if (!metadataContent.image) {
          const extensions = [".jpg", ".jpeg", ".png", ".webp"];
          let imageUrl: string | null = null;
          for (const ext of extensions) {
            const url = `${BASE_URL}/${props.path}${ext}`;
            try {
              const response = await fetch(url);
              if (response.ok) {
                imageUrl = url;
                break;
              }
            } catch (err) {
              // Ignore fetch errors
            }
          }
          if (imageUrl) metadataContent.image = imageUrl;
        }

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

    if (props.path) fetchContent();
  }, [props.path]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"
          data-testid="loading-spinner"
        />
      </div>
    );
  }

  if (!metadata || !content) {
    return <div>No content available</div>;
  }

  return (
    <article className="container mx-auto max-w-3xl px-4 py-8">
      <header className="mb-8">
        {metadata.title && (
          <h1 className="text-3xl font-bold mb-4 text-center">
            {metadata.title}
          </h1>
        )}
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

      {metadata.image && (
        <div className="mb-8">
          <img
            src={metadata.image}
            alt={metadata.title || "Article featured image"}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}

      <div className="prose max-w-none">
        <ReactMarkdown components={components}>{content}</ReactMarkdown>
      </div>
    </article>
  );
}
