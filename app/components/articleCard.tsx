import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface ArticleCardProps {
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
  path: string;
}

const ArticleCard = ({
  title,
  description,
  image,
  date,
  author,
  path,
}: ArticleCardProps) => {
  const truncatedDescription =
    description.length > 150
      ? `${description.substring(0, 150)}...`
      : description;

  return (
    <Link
      to={path}
      className="block no-underline transition-transform hover:scale-[1.02]"
    >
      <Card className="overflow-hidden">
        <img src={image} alt={title} className="h-48 w-full object-cover" />
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="flex items-center text-sm text-muted-foreground">
            {author} • {date}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <p className="text-sm text-muted-foreground">
            {truncatedDescription}
          </p>
          <ArrowRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArticleCard;
