import { useEffect, useState } from "react";
import { Link, useNavigation } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { BASE_URL } from "~/config/constants";

interface ArticleCardProps {
  title?: string;
  description?: string;
  image?: string;
  date?: string;
  author?: string;
  path?: string;
}

const ArticleCard = ({
  title = "",
  description = "",
  image = "",
  date = "",
  author = "",
  path,
}: ArticleCardProps) => {
  const [metadata, setMetadata] = useState({
    title,
    description,
    image,
    date,
    author,
  });
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const isNavigating = navigation.state === "loading" && 
    navigation.location.pathname === `/${path?.split("/")[1]}`;

  useEffect(() => {
    async function fetchMetadata() {
      if (!path) return;
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/${path}.json`);
        if (!res.ok) throw new Error("Failed to fetch metadata");
        const data = await res.json();

        if (data.image && !data.image.startsWith("http")) {
          data.image = `${BASE_URL}/${path.split("/").slice(0, -1).join("/")}/${
            data.image
          }`;
        }

        if (!data.image) {
          const extensions = [".jpg", ".jpeg", ".png", ".webp"];
          for (const ext of extensions) {
            const url = `${BASE_URL}/${path}${ext}`;
            try {
              const response = await fetch(url);
              if (response.ok) {
                data.image = url;
                break;
              }
            } catch (_) {}
          }
        }

        setMetadata({
          title: data.title || title,
          description: data.description || description,
          image: data.image || image,
          date: data.date || date,
          author: data.author || author,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching metadata"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchMetadata();
  }, [path, title, description, image, date, author]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (loading) {
    return (
      <div className="block no-underline transition-transform hover:scale-[1.02]">
        <div className="h-48 w-full bg-gray-200 animate-pulse" />
        <div className="p-4 space-y-2">
          <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  const truncatedDescription =
    metadata.description.length > 150
      ? `${metadata.description.substring(0, 150)}...`
      : metadata.description;

  return (
    <Link
      to={path ? path.split("/")[1] || "#" : "#"}
      className="block no-underline transition-transform hover:scale-[1.02]"
      aria-disabled={isNavigating}
    >
      <Card className={`overflow-hidden ${isNavigating ? 'opacity-60' : ''}`}>
        {metadata.image && (
          <div className="relative">
            <img
              src={metadata.image}
              alt={metadata.title}
              className="h-48 w-full object-cover"
            />
            {isNavigating && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <Loader2 className="h-8 w-8 animate-spin text-foreground" />
              </div>
            )}
          </div>
        )}
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl" dir="auto">
            {metadata.title}
          </CardTitle>
          <CardDescription
            dir="auto"
            className="flex items-center text-sm text-muted-foreground"
          >
            {metadata.author} • {metadata.date}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-start gap-4">
          <p
            className="text-sm text-muted-foreground flex-1"
            dir="auto"
            style={{
              textAlign: "inherit",
            }}
          >
            {truncatedDescription}
          </p>
          {isNavigating ? (
            <Loader2 className="h-5 w-5 flex-shrink-0 animate-spin text-muted-foreground" />
          ) : (
            <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArticleCard;
