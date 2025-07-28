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
import { cn } from "~/lib/utils";

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigation = useNavigation();
  const articlePath = path?.split("/")[1];
  const isNavigating =
    navigation.state !== "idle" &&
    navigation.location?.pathname === `/blog/${articlePath}`;

  useEffect(() => {
    async function fetchMetadata() {
      if (!path) return;
      try {
        setLoading(true);
        setImageLoaded(false); // Reset image loaded state when fetching new data
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
        console.error(err);
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
    return null;
  }

  if (loading) {
    return (
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="h-48 w-full bg-muted animate-pulse" />
        <CardHeader className="space-y-2">
          <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-4 w-full bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  const truncatedDescription =
    metadata.description.length > 150
      ? `${metadata.description.substring(0, 150)}...`
      : metadata.description;

  return (
    <Card
      className={`overflow-hidden relative group border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-card to-card/95 ${
        isNavigating ? "opacity-70 pointer-events-none scale-[1.04]" : ""
      }`}
    >
      <Link
        to={`/blog/${articlePath}`}
        className="block no-underline"
        aria-disabled={isNavigating}
        prefetch="intent"
      >
        {metadata.image && (
          <div className="relative overflow-hidden">
            <img
              src={metadata.image}
              alt={metadata.title}
              className={cn(
                "h-48 w-full object-cover transition-all duration-500 group-hover:scale-110",
                isNavigating ? "blur-[1px]" : "",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        {isNavigating && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[5px] z-10">
            <Loader2 className="h-8 w-8 animate-spin text-foreground" />
          </div>
        )}
        <CardHeader className="space-y-2 pb-3">
          <CardTitle
            className="text-xl group-hover:text-accent-primary transition-colors duration-200"
            dir="auto"
          >
            {metadata.title}
          </CardTitle>
          <CardDescription
            dir="auto"
            className="flex items-center text-sm text-muted-foreground"
          >
            <span className="bg-accent-primary/10 text-accent-primary px-2 py-1 rounded-full text-xs font-medium">
              {metadata.author}
            </span>
            <span className="mx-2">•</span>
            <span>{metadata.date}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-start gap-4 pt-0">
          <p
            className="text-sm text-muted-foreground flex-1 leading-relaxed"
            dir="auto"
            style={{
              textAlign: "inherit",
            }}
          >
            {truncatedDescription}
          </p>
          <div className="flex-shrink-0">
            {isNavigating ? (
              <Loader2 className="h-5 w-5 animate-spin text-accent-primary" />
            ) : (
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent-primary group-hover:translate-x-1 transition-all duration-200" />
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ArticleCard;
