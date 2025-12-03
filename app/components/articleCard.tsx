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
    // If all metadata is provided, skip fetching
    if (title && description && image && date && author) {
      setMetadata({ title, description, image, date, author });
      setLoading(false);
      return;
    }

    async function fetchMetadata() {
      if (!path) return;
      try {
        setLoading(true);
        setImageLoaded(false); // Reset image loaded state when fetching new data
        const res = await fetch(`${BASE_URL}/${path}.json`);
        if (!res.ok) {
          // Silently skip if article doesn't exist (allows future projects)
          setError("skip");
          return;
        }
        const data = await res.json();

        if (data.image && !data.image.startsWith("http")) {
          data.image = `${BASE_URL}/${path.split("/").slice(0, -1).join("/")}/${
            data.image
          }`;
        }

        if (!data.image) {
          // Default to .jpg instead of probing multiple extensions
          data.image = `${BASE_URL}/${path}.jpg`;
        }

        setMetadata({
          title: data.title || title,
          description: data.description || description,
          image: data.image || image,
          date: data.date || date,
          author: data.author || author,
        });
      } catch (err) {
        // Silently skip failed fetches
        console.error(err);
        setError("skip");
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
      <div className="block no-underline transition-transform hover:scale-[1.02]">
        <div className="h-56 w-full bg-gray-200 animate-pulse" />
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
    <Card
      className={`overflow-hidden relative ${
        isNavigating
          ? "opacity-70 pointer-events-none scale-[1.04] "
          : "transition-transform hover:scale-[1.02]"
      }`}
    >
      <Link
        to={`/blog/${articlePath}`}
        className="block no-underline"
        aria-disabled={isNavigating}
      >
        {metadata.image && (
          <div className="relative">
            <img
              src={metadata.image}
              alt={metadata.title}
              className={cn(
                "h-56 w-full object-cover transition-opacity duration-300",
                isNavigating ? "blur-[1px]" : "",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        )}
        {isNavigating && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[5px] z-10">
            <Loader2 className="h-8 w-8 animate-spin text-foreground" />
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
          <div className="flex-shrink-0">
            {isNavigating ? (
              // <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ArticleCard;
