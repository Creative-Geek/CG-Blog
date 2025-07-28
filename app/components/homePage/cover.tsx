import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { FolderOpen, BookOpen } from "lucide-react";

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
  if (loading) {
    return (
      <section className="relative w-full h-[90vh] bg-gray-100 animate-pulse overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
        <div className="relative flex items-center justify-center h-full text-center text-white p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="h-16 md:h-20 lg:h-24 w-full max-w-2xl bg-gray-200/20 rounded-lg mx-auto" />
            <div className="h-8 md:h-10 w-full max-w-xl bg-gray-200/20 rounded-lg mx-auto" />
            <div className="flex justify-center space-x-4 flex-wrap gap-3 mt-8">
              <div className="h-12 w-32 bg-gray-200/20 rounded-md" />
              <div className="h-12 w-24 bg-gray-200/20 rounded-md" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!mainTitle || !mainSubtitle || !coverImage) return null;

  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-700 ease-out"
        style={{ backgroundImage: `url(${coverImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
      <div className="relative flex items-center justify-center h-full text-center text-white p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              {mainTitle}
            </span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-100 font-light leading-relaxed max-w-3xl mx-auto">
            {mainSubtitle}
          </p>
          <div className="flex justify-center space-x-4 flex-wrap gap-3">
            {hasProjects && (
              <Button
                variant="accent"
                size="lg"
                className="cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => {
                  document.getElementById("projects-section")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                <FolderOpen className="mr-2 h-5 w-5" />
                Projects
              </Button>
            )}
            <Button
              variant="accent"
              size="lg"
              asChild
              className="transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Link to="/blog">
                <BookOpen className="mr-2 h-5 w-5" />
                Blog
              </Link>
            </Button>
            {links &&
              links.map((link, index) => (
                <Button
                  key={index}
                  variant="accent"
                  size="lg"
                  asChild
                  className="transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.title}
                  </a>
                </Button>
              ))}
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
