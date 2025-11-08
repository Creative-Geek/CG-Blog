import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { FolderOpen, BookOpen, ExternalLink, ChevronsDown } from "lucide-react";
import DarkVeil from "../DarkVeil";
import { USE_COVER_IMAGE } from "../../config/constants";
import { useTheme } from "../ThemeProvider";
// @ts-ignore - JSX file with TS declaration
import SplitText from "../SplitText.tsx";

interface CoverProps {
  loading?: boolean;
  mainTitle?: string;
  mainSubtitle?: string;
  coverImage?: string;
  hasProjects?: boolean;
  links?: Array<{
    title: string;
    url: string;
  }>;
}

export default function Cover({
  loading,
  mainTitle,
  mainSubtitle,
  coverImage,
  hasProjects = true, // Default to true
  links,
}: CoverProps) {
  const { theme } = useTheme();
  const isLightMode = theme === "light";
  const shouldHideAnimation = !USE_COVER_IMAGE && isLightMode;
  const textColorClass = shouldHideAnimation ? "text-black" : "text-white";

  if (loading) {
    return (
      <section className="relative w-full h-[90hv] md:h-[90hv] bg-gray-100 animate-pulse">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex items-center justify-center h-full text-center text-white p-4 pt-24">
          <div className="space-y-4">
            <div className="h-12 w-96 bg-gray-200 rounded" />
            <div className="h-6 w-80 bg-gray-200 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (!mainTitle || !mainSubtitle) return null;

  return (
    <section className="relative w-full h-[50vh] md:h-[90hv] -mt-[72px]">
      {USE_COVER_IMAGE && coverImage ? (
        // Image background with 40% darkening
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${coverImage})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      ) : (
        // DarkVeil animated background (no darkening overlay)
        // Hidden in light mode when USE_COVER_IMAGE is false
        <div
          className={`absolute inset-0 ${shouldHideAnimation ? "hidden" : ""}`}
        >
          <DarkVeil />
        </div>
      )}
      <div
        className={`relative flex items-center justify-center h-full text-center p-4 pt-24 ${textColorClass}`}
      >
        <div className="w-full">
          <div className="block mb-4 mt-10">
            <SplitText
              text={mainTitle}
              tag="h1"
              className="text-5xl md:text-6xl lg:text-7xl leading-tight font-bold"
              delay={50}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50, rotateX: -90 }}
              to={{ opacity: 1, y: 0, rotateX: 0 }}
              threshold={0.2}
              rootMargin="0px"
              textAlign="center"
            />
          </div>
          <div className="block mb-4">
            <SplitText
              text={mainSubtitle}
              tag="p"
              className="text-xl md:text-2xl"
              delay={30}
              duration={0.6}
              ease="power2.out"
              splitType="words"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="0px"
              textAlign="center"
            />
          </div>
          <div className="flex justify-center space-x-4 flex-wrap gap-2">
            {hasProjects && (
              <Button
                className="cursor-pointer"
                onClick={() => {
                  document.getElementById("projects-section")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                Projects
              </Button>
            )}
            <Button asChild>
              <Link to="/blog">
                <BookOpen className="mr-2 h-4 w-4" />
                Blog
              </Link>
            </Button>
            {links &&
              links.map((link, index) => (
                <Button key={index} asChild>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    {link.title}
                  </a>
                </Button>
              ))}
          </div>
          {hasProjects && (
            <div className=" flex justify-center mt-[3vh]">
              <button
                type="button"
                className={`group inline-flex flex-col items-center ${
                  shouldHideAnimation
                    ? "text-black/60 hover:text-black"
                    : "text-white/80 hover:text-white"
                }`}
                onClick={() => {
                  document.getElementById("about-section")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                aria-label="Scroll to projects"
              >
                <span className="text-sm mb-1">Scroll</span>
                <ChevronsDown className="h-6 w-6 animate-bounce" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
