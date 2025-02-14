import ReactMarkdown from "react-markdown";
import { startsWithArabic, containsArabic } from "~/lib/utils";
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

const BASE_URL = "https://c82cbbf6.cg-blog-articles.pages.dev";

const components = {
  // Paragraph component
  p: ({ children, ...props }: React.HTMLProps<HTMLParagraphElement>) => {
    const isRTL = containsArabic(children);
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
  // Heading components
  // @ts-ignore
  h1: ({ children, ...props }) => {
    const text = children?.toString() || "";
    const isRTL = startsWithArabic(text);
    return (
      <h1
        {...props}
        dir={isRTL ? "rtl" : "ltr"}
        className={`text-4xl font-bold mb-4 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {children}
      </h1>
    );
  },
  // @ts-ignore
  h2: ({ children, ...props }) => {
    const text = children?.toString() || "";
    const isRTL = startsWithArabic(text);
    return (
      <h2
        {...props}
        dir={isRTL ? "rtl" : "ltr"}
        className={`text-3xl font-bold mb-3 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {children}
      </h2>
    );
  },
  // @ts-ignore
  h3: ({ children, ...props }) => {
    const text = children?.toString() || "";
    const isRTL = startsWithArabic(text);
    return (
      <h3
        {...props}
        dir={isRTL ? "rtl" : "ltr"}
        className={`text-2xl font-bold mb-2 ${
          isRTL ? "text-right" : "text-left"
        }`}
      >
        {children}
      </h3>
    );
  },
  // List components
  ul: ({ children, ...props }: React.HTMLProps<HTMLUListElement>) => {
    // Check both first child and all children for Arabic content
    // @ts-ignore
    const firstChild = children?.[0]?.props?.children?.[0]?.toString() || "";
    const isRTLFirst = startsWithArabic(firstChild);
    const isRTLAll = containsArabic(children);
    const isRTL = isRTLFirst || isRTLAll;

    return (
      <ul
        {...props}
        dir={isRTL ? "rtl" : "ltr"}
        className={`list-disc ${
          isRTL ? "mr-6 text-right" : "ml-6 text-left"
        } mb-4`}
      >
        {children}
      </ul>
    );
  },
  ol: ({ children, ...props }: React.HTMLProps<HTMLOListElement>) => {
    const isRTL = containsArabic(children);
    return (
      // @ts-ignore
      <ol
        {...props}
        dir={isRTL ? "rtl" : "ltr"}
        className={`list-decimal ${
          isRTL ? "mr-6 text-right" : "ml-6 text-left"
        } mb-4`}
      >
        {children}
      </ol>
    );
  },

  // Updated list item component:
  li: ({ children, ...props }: React.HTMLProps<HTMLLIElement>) => {
    const isRTL = containsArabic(children);
    return (
      <li
        {...props}
        dir={isRTL ? "rtl" : "ltr"}
        className={isRTL ? "text-right" : "text-left"}
      >
        {children}
      </li>
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

        if (
          metadataContent.image &&
          !metadataContent.image.startsWith("http")
        ) {
          metadataContent.image = `${BASE_URL}/${props.path
            .split("/")
            .slice(0, -1)
            .join("/")}/${metadataContent.image}`;
        }

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

  const isRTLTitle = startsWithArabic(metadata.title);

  return (
    <>
      <title>{metadata.title}</title>
      <article className="container mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8">
          {metadata.title && (
            <h1
              className="text-3xl font-bold mb-4 text-center"
              dir={isRTLTitle ? "rtl" : "ltr"}
            >
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
              <p
                className="text-base text-gray-600 text-center"
                dir={startsWithArabic(metadata.description) ? "rtl" : "ltr"}
              >
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
          {/* @ts-ignore */}
          <ReactMarkdown components={components}>{content}</ReactMarkdown>
        </div>
      </article>
    </>
  );
}
