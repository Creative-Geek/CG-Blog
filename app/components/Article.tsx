import ReactMarkdown from "react-markdown";
import { startsWithArabic } from "~/lib/utils";

interface ArticleProps {
  title?: string;
  content: string;
  image?: string;
  description?: string;
  date?: string;
  author?: string;
}

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

export function Article({
  title,
  content,
  image,
  description,
  date,
  author,
}: ArticleProps) {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header Section */}
      <header className="mb-8">
        {title && (
          <h1 className="text-3xl font-bold mb-4 text-center">{title}</h1>
        )}

        {/* Meta Information */}
        <div className="space-y-3">
          {(author || date) && (
            <div className="flex items-center justify-center gap-3 text-gray-600">
              {author && <span className="font-medium">{author}</span>}
              {author && date && <span>•</span>}
              {date && <time className="text-sm">{date}</time>}
            </div>
          )}

          {description && (
            <p className="text-base text-gray-600 text-center">{description}</p>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {image && (
        <div className="mb-8">
          <img
            src={image}
            alt={title || "Article featured image"}
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
