import { Search } from "lucide-react";
import { Button } from "./ui/button";

export default function SearchCommand() {
  // Placeholder function for future implementation
  const handleSearchClick = () => {
    console.log("Search button clicked");
    // Search functionality will be implemented later
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="w-9 h-9"
      onClick={handleSearchClick}
    >
      <Search className="h-4 w-4" />
    </Button>
  );
}
