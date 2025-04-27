import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Download, Github, Linkedin } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";
import SearchCommand from "./SearchCommand";
import { BASE_URL } from "../config/constants";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "../../components/ui/resizable-navbar";
import { cn } from "~/lib/utils";

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

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Blog", link: "/blog" },
    { name: "About", link: "/about" },
  ];

  const socialItems = [
    { name: "GitHub", link: "https://github.com/Creative-Geek", icon: Github },
    {
      name: "LinkedIn",
      link: "https://www.linkedin.com/in/ahmed-taha-thecg",
      icon: Linkedin,
    },
  ];

  return (
    <ResizableNavbar className="sticky top-0 z-50">
      {/* Desktop Navigation */}
      <NavBody>
        {/* Logo */}
        <div className="relative z-20 flex items-center">
          <Link to="/" className="text-xl font-bold text-foreground mr-6">
            CG Blog
          </Link>
        </div>

        {/* Navigation links with hover animation */}
        <NavItems items={navItems} />

        {/* Actions - right side */}
        <div className="relative z-20 flex items-center gap-2">
          {resumeExists && (
            <NavbarButton
              href={`${BASE_URL}/Pages/resume.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              <span>Resume</span>
            </NavbarButton>
          )}
          <ThemeToggle />
          <SearchCommand />
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-foreground">
            CG Blog
          </Link>

          {/* Toggle button */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SearchCommand />
            <MobileNavToggle isOpen={open} onClick={() => setOpen(!open)} />
          </div>
        </MobileNavHeader>

        {/* Mobile Menu */}
        <MobileNavMenu isOpen={open} onClose={() => setOpen(false)}>
          <div className="flex flex-col space-y-2 w-full">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className="px-4 py-2 text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="h-px w-full bg-border my-2" />
            {socialItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              );
            })}
            {resumeExists && (
              <a
                href={`${BASE_URL}/Pages/resume.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download Resume</span>
              </a>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
}
