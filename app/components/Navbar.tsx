import { Link } from "react-router-dom";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
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
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import SearchCommand from "./SearchCommand";
import {
  BASE_URL,
  CHECK_RESUME_EXISTS,
  LOGO_TEXT,
  GITHUB_URL,
  LINKEDIN_URL,
  RESUME_URL,
} from "../config/constants";

// Cache resume check result for the session
let resumeCheckCache: boolean | null = null;
let resumeCheckPromise: Promise<boolean> | null = null;

async function checkResumeExists(): Promise<boolean> {
  if (resumeCheckCache !== null) {
    return resumeCheckCache;
  }

  if (resumeCheckPromise) {
    return resumeCheckPromise;
  }

  resumeCheckPromise = (async () => {
    try {
      // When CHECK_RESUME_EXISTS is true, check BASE_URL/Pages/resume.pdf
      // Otherwise use RESUME_URL directly
      const urlToCheck = CHECK_RESUME_EXISTS
        ? `${BASE_URL}/Pages/resume.pdf`
        : RESUME_URL;
      if (!urlToCheck) {
        resumeCheckCache = false;
        return false;
      }
      const response = await fetch(urlToCheck, {
        method: "HEAD",
      });
      resumeCheckCache = response.ok;
      return resumeCheckCache;
    } catch (error) {
      console.error("Error checking resume:", error);
      resumeCheckCache = false;
      return false;
    } finally {
      resumeCheckPromise = null;
    }
  })();

  return resumeCheckPromise;
}

export function Navbar() {
  const navRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [resumeExists, setResumeExists] = useState(!CHECK_RESUME_EXISTS);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (CHECK_RESUME_EXISTS) {
      checkResumeExists().then(setResumeExists);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamically set global scroll padding to match navbar height
  useLayoutEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return;

    const setOffset = () => {
      const h = navEl.offsetHeight;
      document.documentElement.style.setProperty("--navbar-offset", `${h}px`);
    };

    setOffset();

    // Observe size changes (e.g., responsive breakpoints, dynamic content)
    const ro = new ResizeObserver(() => setOffset());
    ro.observe(navEl);

    // Update on viewport resize as a fallback
    window.addEventListener("resize", setOffset);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setOffset);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-30 w-full px-6 py-4 transition-all duration-500 ease-in-out ${
        isScrolled ? "bg-background/20 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
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
                  to="/projects"
                  className="text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Projects
                </Link>
                <Link
                  to="/about"
                  className="text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors"
                  onClick={() => setOpen(false)}
                >
                  About Me
                </Link>
                {GITHUB_URL && (
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub Profile</span>
                  </a>
                )}
                {LINKEDIN_URL && (
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium p-2 hover:bg-accent rounded-md transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo - centered on mobile, left section on desktop */}
        <div className="w-full md:w-[33%] flex justify-center md:justify-start">
          <Link to="/" className="text-xl font-bold">
            {LOGO_TEXT}
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
              <Link to="/projects" className="text-sm font-medium">
                Projects
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about" className="text-sm font-medium">
                About
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Theme Toggle and Search - right section */}
        <div className="w-full md:w-[33%] flex justify-end items-center gap-2">
          {GITHUB_URL && (
            <Button
              variant="outline"
              size="icon"
              className="hidden md:flex w-9 h-9"
              asChild
            >
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          {LINKEDIN_URL && (
            <Button
              variant="outline"
              size="icon"
              className="hidden md:flex w-9 h-9"
              asChild
            >
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
          {resumeExists && (
            <HoverBorderGradient
              containerClassName="rounded-md"
              as="a"
              href={
                CHECK_RESUME_EXISTS
                  ? `${BASE_URL}/Pages/resume.pdf`
                  : RESUME_URL
              }
              target="_blank"
              rel="noopener noreferrer"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 h-9 px-4 py-2 text-sm"
            >
              <Download className="h-4 w-4" />
              <span className="md:hidden">Résumé</span>
              <span className="hidden md:inline">Download My Resume</span>
            </HoverBorderGradient>
          )}
          <ThemeToggle />
          <SearchCommand />
        </div>
      </div>
    </nav>
  );
}
