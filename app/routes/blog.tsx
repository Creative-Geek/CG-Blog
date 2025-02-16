import { useLoaderData, useLocation, useNavigation } from "react-router-dom";
import ArticleCard from "../components/articleCard";
import { BASE_URL, NAME } from "~/config/constants";

interface Article {
  name: string;
}

export async function loader() {
  try {
    const response = await fetch(`${BASE_URL}/Articles/index.json`);
    if (!response.ok) throw new Error("Failed to fetch articles");
    const articles: Article[] = await response.json();
    return { articles };
  } catch (error) {
    throw new Error("Failed to load articles");
  }
}

function BlogContent() {
  const { articles } = useLoaderData() as { articles: Article[] };
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h2 className="text-xl font-bold mb-5">Latest Posts</h2>
      <div className="space-y-6">
        {articles.map((article, index) => (
          <ArticleCard
            key={`${article.name}-${index}`}
            path={`Articles/${article.name}`}
          />
        ))}

        {isLoading && (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Blog() {
  const location = useLocation();

  return (
    <>
      <title>{`${NAME}'s Blog`}</title>
      <BlogContent key={location.key} />
    </>
  );
}
