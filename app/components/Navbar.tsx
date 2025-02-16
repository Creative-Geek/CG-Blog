import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";
import { Button } from "../components/ui/button";
import { Github, Linkedin, Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-between border-b border-border px-6 py-4">
      {/* Mobile Menu Button - only visible on mobile */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="w-9 h-9">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6">
            <SheetHeader className="mb-6">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/blog"
                className="text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors"
                onClick={() => setOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors"
                onClick={() => setOpen(false)}
              >
                About Me
              </Link>
              <a
                href="https://github.com/Creative-Geek"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>GitHub Profile</span>
              </a>
              <a
                href="https://www.linkedin.com/in/ahmed-taha-thecg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn Profile</span>
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Logo - centered on mobile, left-aligned on desktop */}
      <div className="w-full md:w-auto flex justify-center md:justify-start">
        <Link to="/" className="text-xl font-bold">
          CG Blog
        </Link>
      </div>

      {/* Desktop Navigation - hidden on mobile */}
      <NavigationMenu className="hidden md:flex justify-center">
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

      {/* Theme Toggle and Search - always visible */}
      <div className="w-full md:w-auto flex justify-end items-center gap-2">
        <ThemeToggle />
        <Button variant={"outline"} size="icon" className="w-9 h-9">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
