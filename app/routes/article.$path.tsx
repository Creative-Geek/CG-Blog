import { useLoaderData } from "react-router-dom";
import { Article } from "~/components/Article";
import { BASE_URL, NAME } from "~/config/constants";
import { Loader2 } from "lucide-react";

interface ArticleData {
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
  content: string;
}

export async function loader({ params }: { params: { path: string } }) {
  if (!params.path) {
    throw new Error("Article path is required");
  }

  // Decode the URL-encoded path
  const decodedPath = decodeURIComponent(params.path);
  const articlePath = `Articles/${decodedPath}`;

  try {
    const [markdownResponse, metadataResponse] = await Promise.all([
      fetch(`${BASE_URL}/${articlePath}.md`),
      fetch(`${BASE_URL}/${articlePath}.json`),
    ]);

    if (!markdownResponse.ok || !metadataResponse.ok) {
      throw new Error("Failed to fetch article");
    }

    const [content, metadata] = await Promise.all([
      markdownResponse.text(),
      metadataResponse.json(),
    ]);

    // Handle image path
    if (metadata.image && !metadata.image.startsWith("http")) {
      metadata.image = `${BASE_URL}/${articlePath
        .split("/")
        .slice(0, -1)
        .join("/")}/${metadata.image}`;
    }

    if (!metadata.image) {
      const extensions = [".jpg", ".jpeg", ".png", ".webp"];
      for (const ext of extensions) {
        const url = `${BASE_URL}/${articlePath}${ext}`;
        try {
          const response = await fetch(url);
          if (response.ok) {
            metadata.image = url;
            break;
          }
        } catch (_) {}
      }
    }

    return { ...metadata, content };
  } catch (error) {
    throw new Error("Failed to load article");
  }
}

export function meta({ data }: { data: ArticleData | undefined }) {
  return [
    { title: data?.title ? `${data.title} - ${NAME}` : NAME },
    { name: "description", content: data?.description },
  ];
}

function LoadingArticle() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-col items-center space-y-8">
        <div className="w-full space-y-4">
          <div className="h-8 w-3/4 mx-auto bg-muted animate-pulse rounded" />
          <div className="h-4 w-1/2 mx-auto bg-muted animate-pulse rounded" />
        </div>
        <div className="w-full h-64 bg-muted animate-pulse rounded-lg" />
        <div className="w-full space-y-4">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
          <div className="h-4 w-4/6 bg-muted animate-pulse rounded" />
        </div>
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    </article>
  );
}

export default function ArticlePage() {
  const articleData = useLoaderData() as ArticleData;
  return <Article {...articleData} />;
} 