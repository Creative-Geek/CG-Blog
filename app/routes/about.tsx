import { Article } from "../components/Article";
import { useEffect, useState } from "react";

interface AboutMetadata {
  title: string;
  image: string;
  description: string;
  date: string;
  author: string;
}

export default function About() {
  const [content, setContent] = useState<string>("");
  const [metadata, setMetadata] = useState<AboutMetadata | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchContent() {
      try {
        // Fetch markdown content
        const markdownResponse = await fetch(
          "https://cg-blog-articles.pages.dev/Pages/about.md"
        );
        if (!markdownResponse.ok)
          throw new Error("Failed to fetch markdown content");
        const markdownContent = await markdownResponse.text();

        // Fetch metadata
        const metadataResponse = await fetch(
          "https://cg-blog-articles.pages.dev/Pages/about.json"
        );
        if (!metadataResponse.ok) throw new Error("Failed to fetch metadata");
        const metadataContent = await metadataResponse.json();

        setContent(markdownContent);
        setMetadata(metadataContent);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch content"
        );
      }
    }

    fetchContent();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!metadata || !content) {
    return <div>Loading...</div>;
  }

  return (
    <Article
      title={metadata.title}
      content={content}
      image={metadata.image}
      description={metadata.description}
      author={metadata.author}
      date={metadata.date}
    />
  );
}
