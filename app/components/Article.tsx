import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { startsWithArabic, containsArabic, extractText } from "~/lib/utils";
import { BASE_URL, NAME } from "~/config/constants";
import type { Components } from "react-markdown";
import type { ReactNode, JSX } from "react";
import { useState, useEffect } from "react";
import slugify from "@sindresorhus/slugify";

interface ArticleProps {
  title?: string;
  content?: string;
  image?: string;
  description?: string;
  date?: string;
  author?: string;
  path?: string;
}

// function slugify(text: string) {
//   let slug = text
//     .trim()
//     .toLowerCase()
//     .replace(/[^\p{L}\p{N}]+/gu, "-") // keep letters & numbers
//     .replace(/^-+|-+$/g, "") // remove leading/trailing dashes
//     .replace(/-+/g, "-"); // collapse consecutive dashes

//   return slug || "heading";
// }

const components: Components = {
  // Paragraph component
  p: ({ children, ...props }): JSX.Element => {
    const text = extractText(children);
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
  // Heading components
  h1: ({ children, ...props }): JSX.Element => {
    const text = children?.toString() || "";
    const slug = slugify(text);
    const isRTL = startsWithArabic(text);
    return (
      <h1
        {...props}
        id={slug}
        dir={isRTL ? "rtl" : "ltr"}
        onClick={() =>
          navigator.clipboard.writeText(
            `${window.location.href.split("#")[0]}#${slug}`
          )
        }
        className="text-4xl font-bold mb-6 text-foreground border-b pb-2 border-border cursor-pointer hover:underline "
      >
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }): JSX.Element => {
    const text = children?.toString() || "";
    const slug = slugify(text);
    const isRTL = startsWithArabic(text);
    return (
      <h2
        {...props}
        id={slug}
        dir={isRTL ? "rtl" : "ltr"}
        onClick={() =>
          navigator.clipboard.writeText(
            `${window.location.href.split("#")[0]}#${slug}`
          )
        }
        className="text-3xl font-bold mb-3 cursor-pointer hover:underline hover:text-blue-500"
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }): JSX.Element => {
    const text = children?.toString() || "";
    const slug = slugify(text);
    const isRTL = startsWithArabic(text);
    return (
      <h3
        {...props}
        id={slug}
        dir={isRTL ? "rtl" : "ltr"}
        onClick={() =>
          navigator.clipboard.writeText(
            `${window.location.href.split("#")[0]}#${slug}`
          )
        }
        className="text-2xl font-bold mb-2 cursor-pointer hover:underline hover:text-blue-500"
      >
        {children}
      </h3>
    );
  },
  // List components
  ul: ({ children, ...props }): JSX.Element => {
    const childrenArray = Array.isArray(children) ? children : [children];
    const firstChild = childrenArray[0];
    const firstChildText = typeof firstChild === "string" ? firstChild : "";
    const isRTLFirst = startsWithArabic(firstChildText);
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
  ol: ({ children, ...props }): JSX.Element => {
    const isRTL = containsArabic(children);
    return (
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
  li: ({ children, ...props }): JSX.Element => {
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

  // Add image component
  img: ({ src, alt, ...props }): JSX.Element => {
    if (src?.startsWith("~/")) {
      src = `${BASE_URL}${src.substring(1)}`;
    }
    return (
      <img
        src={src}
        alt={alt}
        {...props}
        className="w-full h-auto rounded-lg my-4"
      />
    );
  },
  a: ({ children, href, ...props }): JSX.Element => (
    <a
      href={href}
      {...props}
      className="text-blue-600 hover:underline dark:text-blue-400"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
};

export function Article(props: ArticleProps): JSX.Element {
  const [article, setArticle] = useState(props);
  const [loading, setLoading] = useState(!!props.path);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchArticle() {
      if (!props.path) return;
      try {
        setLoading(true);
        const [markdownResponse, metadataResponse] = await Promise.all([
          fetch(`${BASE_URL}/${props.path}.md`),
          fetch(`${BASE_URL}/${props.path}.json`),
        ]);

        if (!markdownResponse.ok || !metadataResponse.ok) {
          throw new Error("Failed to fetch article");
        }

        const [content, metadata] = await Promise.all([
          markdownResponse.text(),
          metadataResponse.json(),
        ]);

        // Handle image path relative to article location
        if (metadata.image && !metadata.image.startsWith("http")) {
          metadata.image = `${BASE_URL}/${props.path
            .split("/")
            .slice(0, -1)
            .join("/")}/${metadata.image}`;
        }

        setArticle({ ...metadata, content });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching article");
      } finally {
        setLoading(false);
      }
    }

    if (props.path) {
      fetchArticle();
    }
  }, [props.path]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 animate-pulse">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
          <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
          <div className="h-64 bg-muted rounded" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-4 bg-muted rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  const isRTLTitle = startsWithArabic(article.title || "");

  return (
    <>
      <title>{article.title ? `${article.title} - ${NAME}` : NAME}</title>
      <article className="container mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8">
          {article.title && (
            <h1
              className="text-3xl font-bold mb-4 text-center text-foreground"
              dir={isRTLTitle ? "rtl" : "ltr"}
            >
              {article.title}
            </h1>
          )}
          <div className="space-y-3">
            {(article.author || article.date) && (
              <div className="flex items-center justify-center gap-3 text-foreground/60">
                {article.author && (
                  <span className="text-foreground/60">{article.author}</span>
                )}
                {article.author && article.date && <span>•</span>}
                {article.date && (
                  <time className="text-foreground/60">{article.date}</time>
                )}
              </div>
            )}
            {article.description && (
              <p
                className="text-base text-foreground/80 text-center"
                dir={startsWithArabic(article.description) ? "rtl" : "ltr"}
              >
                {article.description}
              </p>
            )}
          </div>
        </header>

        {article.image && (
          <div className="mb-8">
            <img
              src={article.image}
              alt={article.title || "Article featured image"}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {article.content}
          </ReactMarkdown>
        </div>
      </article>
    </>
  );
}
