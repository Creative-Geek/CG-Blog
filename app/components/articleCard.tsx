import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { motion } from "framer-motion";
import { BASE_URL } from "~/config/constants";

interface ArticleCardProps {
  title?: string;
  description?: string;
  image?: string;
  date?: string;
  author?: string;
  path?: string;
  loading?: boolean;
}

const ArticleCard = ({
  title = "",
  description = "",
  image = "",
  date = "",
  author = "",
  path,
  loading = false,
}: ArticleCardProps) => {
  const [metadata, setMetadata] = useState({
    title,
    description,
    image,
    date,
    author,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMetadata() {
      if (!path) return;
      try {
        const res = await fetch(`${BASE_URL}/${path}.json`);
        if (!res.ok) throw new Error("Failed to fetch metadata");
        const data = await res.json();

        // Handle image path
        if (data.image && !data.image.startsWith("http")) {
          data.image = `${BASE_URL}/${path.split("/").slice(0, -1).join("/")}/${
            data.image
          }`;
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
      }
    }
    fetchMetadata();
  }, [path, title, description, image, date, author]);

  if (error) {
    return null;
  }

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="h-48 w-full bg-muted animate-pulse" />
        <div className="p-4 space-y-2">
          <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
        </div>
      </Card>
    );
  }

  const truncatedDescription =
    metadata.description.length > 150
      ? `${metadata.description.substring(0, 150)}...`
      : metadata.description;

  // Generate article path for the route
  const articlePath = path?.split("/").slice(1).join("/");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
        <Link
          to={`/article/${encodeURIComponent(articlePath || "")}`}
          className="block no-underline"
          prefetch="intent"
          preventScrollReset
        >
          {metadata.image && (
            <div className="relative h-48">
              <img
                src={metadata.image}
                alt={metadata.title}
                className="h-full w-full object-cover"
              />
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
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  );
};

export default ArticleCard;
