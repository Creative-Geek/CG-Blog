import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuContent,
  NavigationMenuTrigger,
  ClickOnlyNavigationMenuTrigger,
} from "../components/ui/navigation-menu";
import { Button } from "../components/ui/button";
import { Download, Github, Linkedin, Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { useState, useEffect } from "react";
import SearchCommand from "./SearchCommand";
import { BASE_URL } from "../config/constants";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [resumeExists, setResumeExists] = useState(false);

  useEffect(() => {
    // Check if resume file exists
    const checkResumeExists = async () => {
      try {
        const response = await fetch(`${BASE_URL}/Pages/resume.pdf`, {
          method: "HEAD",
        });
        setResumeExists(response.ok);
      } catch (error) {
        console.error("Error checking resume:", error);
        setResumeExists(false);
      }
    };

    checkResumeExists();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/20 backdrop-blur-lg px-6 py-4">
      <div className="flex items-center justify-between">
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

        {/* Logo - centered on mobile, left section on desktop */}
        <div className="w-full md:w-[33%] flex justify-center md:justify-start">
          <Link to="/" className="text-xl font-bold">
            CG Blog
          </Link>
        </div>

        {/* Desktop Navigation - center section */}
        <NavigationMenu
          className="hidden md:flex md:w-[33%] md:justify-center"
          delayDuration={99999999}
        >
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
              <ClickOnlyNavigationMenuTrigger className="text-sm font-medium">
                About
              </ClickOnlyNavigationMenuTrigger>
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

        {/* Theme Toggle and Search - right section */}
        <div className="w-full md:w-[33%] flex justify-end items-center gap-2">
          {resumeExists && (
            <Button>
              <a
                href={`${BASE_URL}/Pages/resume.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex"
              >
                <span className="md:hidden">Résumé</span>
                <span className="hidden md:flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download My Resume
                </span>
              </a>
            </Button>
          )}
          <ThemeToggle />
          <SearchCommand />
        </div>
      </div>
    </nav>
  );
}
