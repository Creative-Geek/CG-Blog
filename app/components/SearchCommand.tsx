import { useState, useEffect, useCallback, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Switch } from "./ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { BASE_URL } from "../config/constants";
import { Link } from "react-router-dom";

type Article = {
  name: string;
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
  content?: string;
};

export default function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInContent, setSearchInContent] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all articles on component mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        // Fetch the index of all articles
        const indexResponse = await fetch(`${BASE_URL}/Articles/index.json`);
        if (!indexResponse.ok) {
          throw new Error(`Failed to fetch articles index: ${indexResponse.status}`);
        }

        const articleList = await indexResponse.json();

        // Fetch the metadata for each article
        const articlesWithMetadata = [];

        for (const article of articleList) {
          try {
            const metadataResponse = await fetch(`${BASE_URL}/Articles/${article.name}.json`);
            if (!metadataResponse.ok) {
              console.warn(`Failed to fetch metadata for ${article.name}: ${metadataResponse.status}`);
              continue;
            }

            const metadata = await metadataResponse.json();
            articlesWithMetadata.push({
              name: article.name,
              ...metadata,
            });
          } catch (articleError) {
            console.error(`Error processing article ${article.name}:`, articleError);
          }
        }

        setArticles(articlesWithMetadata);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Function to fetch article content if needed
  const fetchArticleContent = async (articleName: string) => {
    try {
      const response = await fetch(`${BASE_URL}/Articles/${articleName}.md`);
      if (!response.ok) {
        throw new Error(`Failed to fetch content for ${articleName}: ${response.status}`);
      }
      const content = await response.text();
      return content;
    } catch (error) {
      console.error(`Error fetching content for ${articleName}:`, error);
      return "";
    }
  };

  // Custom debounce function using useCallback and setTimeout
  const debouncedSearch = useCallback(async (term: string, inContent: boolean) => {
    setIsLoading(true);

    // Handle empty search term - don't clear results immediately
    if (!term.trim()) {
      setFilteredArticles([]);
      setIsLoading(false);
      return;
    }

    const lowerCaseTerm = term.toLowerCase();

    // Search in titles and descriptions
    let results = articles.filter(article =>
      article.title.toLowerCase().includes(lowerCaseTerm) ||
      article.description.toLowerCase().includes(lowerCaseTerm)
    );

    // If search in content is enabled, fetch and search in article content
    if (inContent && term.trim().length > 2) { // Only search in content for terms longer than 2 chars
      try {
        const articlesToSearch = articles.filter(article =>
          !results.some(a => a.name === article.name)
        );

        for (const article of articlesToSearch) {
          const content = await fetchArticleContent(article.name);
          if (content.toLowerCase().includes(lowerCaseTerm)) {
            results.push({ ...article, content });
          }
        }
      } catch (error) {
        console.error("Error searching in content:", error);
      }
    }

    setFilteredArticles(results);
    setIsLoading(false);
  }, [articles]);

  // Handle search with debouncing
  useEffect(() => {
    // Set loading state immediately to give feedback
    if (searchTerm.trim()) {
      setIsLoading(true);
    }

    // Clear the previous timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't clear results immediately when the search term is empty
    if (!searchTerm.trim()) {
      setFilteredArticles([]);
      setIsLoading(false);
      return;
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      debouncedSearch(searchTerm, searchInContent);
    }, 300);

    // Cleanup function to clear the timeout when the component unmounts or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, searchInContent, debouncedSearch]);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="w-9 h-9"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md">

          <CommandInput
            placeholder="Search articles..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />

          <div className="flex items-center px-3 pt-2">
            <span className="text-xs text-muted-foreground mr-2">Search in article content</span>
            <Switch
              checked={searchInContent}
              onCheckedChange={setSearchInContent}
            />
          </div>
          <CommandList>
            {isLoading && (
              <div className="py-6 text-center text-sm">
                <div className="flex justify-center items-center">
                  <div className="animate-spin h-5 w-5 mr-2 border-2 border-primary rounded-full border-t-transparent"></div>
                  Searching...
                </div>
              </div>
            )}
            <CommandEmpty>
              {!isLoading && (searchTerm.trim() ? "No results found." : "Start typing to search...")}
            </CommandEmpty>
            <CommandGroup heading="Articles">
              {filteredArticles.map((article) => (
                <CommandItem
                  key={article.name}
                  value={article.name}
                  onSelect={() => {
                    setOpen(false);
                    // This will navigate to the article page
                  }}
                  className="p-2"
                >
                  <Link
                    to={`/blog/${article.name}`}
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    <Card className="w-full hover:bg-accent/50 transition-colors">
                      <CardHeader className="flex flex-row items-start gap-4 p-4">
                        <img
                          src={`${BASE_URL}/Articles/${article.image}`}
                          alt={article.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="space-y-1">
                          <CardTitle className="text-base">{article.title}</CardTitle>
                          <CardDescription className="line-clamp-2 text-xs">
                            {article.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
