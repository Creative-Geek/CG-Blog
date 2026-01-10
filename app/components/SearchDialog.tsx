import { useState, useEffect, useRef, Fragment } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { searchArticles } from "~/services/searchService";
import type { Article } from "~/services/searchService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Search, Loader2, FileText } from "lucide-react";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchDialog({
  open,
  onOpenChange,
}: SearchDialogProps) {
  // Function to highlight matched text in strings
  const highlightMatches = (
    text: string | undefined,
    query: string
  ): React.ReactNode => {
    if (!text || !query.trim()) return <>{text}</>;

    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return (
      <>
        {parts.map((part, index) => {
          const isMatch = part.toLowerCase() === query.toLowerCase();
          return isMatch ? (
            <span
              key={index}
              className="bg-primary/20 font-medium text-primary"
            >
              {part}
            </span>
          ) : (
            <Fragment key={index}>{part}</Fragment>
          );
        })}
      </>
    );
  };

  const [query, setQuery] = useState("");
  const [searchContent, setSearchContent] = useState(false);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const resultRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Perform search when query changes or search content option changes
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { articles, error } = await searchArticles(query, searchContent);
        setResults(articles);
        setError(error);
      } catch (err) {
        setError("Failed to search articles");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce search for 300ms

    return () => clearTimeout(searchTimer);
  }, [query, searchContent]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setError(null);
      setSelectedIndex(-1);
    } else {
      // Reset selection when dialog opens
      setSelectedIndex(-1);
    }
  }, [open]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
    resultRefs.current = resultRefs.current.slice(0, results.length);
  }, [results]);

  // Extract matching content snippet with highlighted match
  const getContentSnippet = (
    content: string,
    searchQuery: string
  ): string | null => {
    if (!content || !searchContent) return null;

    const lowerContent = content.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();
    const matchIndex = lowerContent.indexOf(lowerQuery);

    if (matchIndex === -1) return null;

    const startIndex = Math.max(0, matchIndex - 50);
    const endIndex = Math.min(
      content.length,
      matchIndex + searchQuery.length + 50
    );
    let snippet = content.substring(startIndex, endIndex);

    // Add ellipses if we're not showing from the beginning or to the end
    if (startIndex > 0) snippet = "..." + snippet;
    if (endIndex < content.length) snippet = snippet + "...";

    return snippet;
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (results.length === 0) return;

    // Arrow down - select next result
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = (selectedIndex + 1) % results.length;
      setSelectedIndex(newIndex);
      resultRefs.current[newIndex]?.scrollIntoView({ block: "nearest" });
    }
    // Arrow up - select previous result
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex =
        selectedIndex <= 0 ? results.length - 1 : selectedIndex - 1;
      setSelectedIndex(newIndex);
      resultRefs.current[newIndex]?.scrollIntoView({ block: "nearest" });
    }
    // Enter - navigate to selected result
    else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const selectedArticle = results[selectedIndex];
      if (selectedArticle) {
        onOpenChange(false);
        navigate(`/blog/${selectedArticle.name}`);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Search Articles</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Search input */}
          <div className="flex items-center gap-2 relative">
            <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>

          {/* Search content toggle */}
          <div className="flex items-center justify-between">
            <label htmlFor="search-content" className="text-sm cursor-pointer">
              Search article contents
            </label>
            <Switch
              id="search-content"
              checked={searchContent}
              onCheckedChange={setSearchContent}
            />
          </div>

          {/* Results */}
          <div className="mt-4">
            {loading && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {error && !loading && (
              <div className="text-center text-red-500 my-4">
                {error}. Please try again.
              </div>
            )}

            {!loading &&
              !error &&
              results.length === 0 &&
              query.trim() !== "" && (
                <div className="text-center text-muted-foreground py-8">
                  No results found
                </div>
              )}

            {!loading && results.length > 0 && (
              <div className="space-y-4">
                {results.map((article, index) => {
                  const contentSnippet = article.content
                    ? getContentSnippet(article.content, query)
                    : "";

                  return (
                    <Link
                      key={article.name}
                      ref={(el) => {
                        resultRefs.current[index] = el;
                      }}
                      to={`/blog/${article.name}`}
                      onClick={() => onOpenChange(false)}
                      className={`block p-3 rounded-md border transition-colors ${
                        selectedIndex === index
                          ? "bg-accent/70 border-primary/50"
                          : "border-border hover:bg-accent/50"
                      }`}
                    >
                      <div className="font-medium text-foreground">
                        {highlightMatches(article.title || article.name, query)}
                      </div>

                      {article.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {highlightMatches(article.description, query)}
                        </div>
                      )}

                      {contentSnippet && (
                        <div className="mt-2 text-xs border-l-2 border-primary/30 pl-2 py-1 bg-primary/5 rounded">
                          <div className="flex items-start gap-1">
                            <FileText className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary/70" />
                            <span className="text-muted-foreground">
                              {highlightMatches(contentSnippet, query)}
                            </span>
                          </div>
                        </div>
                      )}

                      {article.date && (
                        <div className="text-xs text-muted-foreground/70 mt-2">
                          {article.date}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
