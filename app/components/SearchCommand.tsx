import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import SearchDialog from "./SearchDialog";

export default function SearchCommand() {
  const [open, setOpen] = useState(false);

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="w-9 h-9"
        onClick={() => setOpen(true)}
        aria-label="Search articles"
        title="Search articles (Ctrl+K)"
      >
        <Search className="h-4 w-4" />
      </Button>

      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
