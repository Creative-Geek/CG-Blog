import { useLoaderData, useParams } from "react-router-dom";
import { Article } from "../components/Article";
import { BASE_URL } from "~/config/constants";

interface ArticleData {
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
  content: string;
}

export async function loader({ params }: { params: { path: string } }) {
  const { path } = params;
  const articlePath = `Articles/${path}`;

  try {
    const [markdownResponse, metadataResponse] = await Promise.all([
      fetch(`${BASE_URL}/${articlePath}.md`),
      fetch(`${BASE_URL}/${articlePath}.json`)
    ]);

    if (!markdownResponse.ok || !metadataResponse.ok) {
      throw new Error("Failed to fetch article");
    }

    const [content, metadata] = await Promise.all([
      markdownResponse.text(),
      metadataResponse.json()
    ]);

    // Handle image path
    if (metadata.image && !metadata.image.startsWith("http")) {
      metadata.image = `${BASE_URL}/${articlePath.split("/").slice(0, -1).join("/")}/${metadata.image}`;
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

export default function ViewArticle() {
  const articleData = useLoaderData() as ArticleData;
  return <Article {...articleData} />;
}
