import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { startsWithArabic, containsArabic } from "~/lib/utils";
import { BASE_URL } from "~/config/constants";
import type { Components } from "react-markdown";
import type { ReactNode, JSX } from "react";

interface ArticleProps {
  title: string;
  content: string;
  image?: string;
  description?: string;
  date?: string;
  author?: string;
}

const components: Components = {
  // Paragraph component
  p: ({ children, ...props }): JSX.Element => {
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
  h1: ({ children, ...props }): JSX.Element => {
    const text = children?.toString() || "";
    const isRTL = startsWithArabic(text);
    return (
      <h1
        {...props}
        dir={isRTL ? "rtl" : "ltr"}
        className={`text-4xl font-bold mb-6 text-foreground border-b pb-2 border-border`}
      >
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }): JSX.Element => {
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
  h3: ({ children, ...props }): JSX.Element => {
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
  ul: ({ children, ...props }): JSX.Element => {
    const childrenArray = Array.isArray(children) ? children : [children];
    const firstChild = childrenArray[0];
    const firstChildText = typeof firstChild === 'string' ? firstChild : '';
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
  const isRTLTitle = startsWithArabic(props.title);

  return (
    <>
      <title>{props.title}</title>
      <article className="container mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8">
          {props.title && (
            <h1
              className="text-3xl font-bold mb-4 text-center text-foreground"
              dir={isRTLTitle ? "rtl" : "ltr"}
            >
              {props.title}
            </h1>
          )}
          <div className="space-y-3">
            {(props.author || props.date) && (
              <div className="flex items-center justify-center gap-3 text-foreground/60">
                {props.author && (
                  <span className="text-foreground/60">{props.author}</span>
                )}
                {props.author && props.date && <span>•</span>}
                {props.date && (
                  <time className="text-foreground/60">{props.date}</time>
                )}
              </div>
            )}
            {props.description && (
              <p
                className="text-base text-foreground/80 text-center"
                dir={startsWithArabic(props.description) ? "rtl" : "ltr"}
              >
                {props.description}
              </p>
            )}
          </div>
        </header>

        {props.image && (
          <div className="mb-8">
            <img
              src={props.image}
              alt={props.title || "Article featured image"}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {props.content}
          </ReactMarkdown>
        </div>
      </article>
    </>
  );
}
