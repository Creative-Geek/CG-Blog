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
      <section className="relative w-full h-[90vh] bg-gray-100 animate-pulse">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex items-center justify-center h-full text-center text-white p-4">
          <div className="space-y-4">
            <div className="h-12 w-96 bg-gray-200 rounded" />
            <div className="h-6 w-80 bg-gray-200 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (!mainTitle || !mainSubtitle || !coverImage) return null;

  return (
    <section className="relative w-full h-[90vh]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${coverImage})` }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative flex items-center justify-center h-full text-center text-white p-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{mainTitle}</h1>
          <p className="text-xl md:text-2xl mb-4">{mainSubtitle}</p>
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
                    {link.title}
                  </a>
                </Button>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
