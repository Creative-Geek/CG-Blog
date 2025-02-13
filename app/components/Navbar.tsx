import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";
import { Button } from "../components/ui/button";
import { Github, Linkedin, Search } from "lucide-react";

export function Navbar() {
  return (
    <div className="w-full flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold">
          CG Blog
        </Link>
      </div>

      <NavigationMenu>
        <NavigationMenuList className="flex gap-6">
          <NavigationMenuItem>
            <Link to="/" className="text-sm font-medium">
              Home
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/blog" className="text-sm font-medium">
              Blog
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-sm font-medium">
              About
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[200px] p-2">
                <Link
                  to="/about"
                  className="block p-2 hover:bg-accent rounded-md"
                >
                  About Me
                </Link>
                <a
                  href="https://github.com/Creative-Geek"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub Profile</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/ahmed-taha-thecg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Button variant="ghost" size="icon" className="w-9 h-9">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
