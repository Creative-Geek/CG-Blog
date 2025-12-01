import { useLoaderData } from "react-router-dom";
import ArticleCard from "../components/articleCard";
import { BASE_URL, NAME } from "~/config/constants";
import { motion } from "framer-motion";
import { generateBlogStructuredData } from "~/utils/structuredData";
import { Briefcase, Code2 } from "lucide-react";

interface Project {
  name: string;
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
  path: string;
}

// Server-side cache for projects metadata (lasts for the lifetime of the server process)
const projectsCache: { data: Project[] | null; timestamp: number } = {
  data: null,
  timestamp: 0,
};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache() {
  const now = Date.now();

  // Return cached if exists and not expired
  if (
    projectsCache.data &&
    projectsCache.timestamp &&
    now - projectsCache.timestamp < CACHE_TTL
  ) {
    return projectsCache.data;
  }

  // Fetch fresh data
  const response = await fetch(`${BASE_URL}/Pages/projects-generated.json`);
  if (!response.ok) throw new Error("Failed to fetch projects");
  const data = await response.json();

  // Update cache
  projectsCache.data = data.projects;
  projectsCache.timestamp = now;

  return data.projects;
}

export async function loader() {
  try {
    // Fetch projects-generated.json which contains all metadata (single request!)
    const projects: Project[] = await fetchWithCache();

    // Process projects to ensure image paths are correct
    // Filter out any invalid/incomplete projects silently
    const projectsWithMetadata = projects
      .filter((project) => project && project.name && project.title)
      .map((project) => {
        // Determine image path
        let imagePath = project.image;
        if (imagePath && !imagePath.startsWith("http")) {
          imagePath = `${BASE_URL}/Articles/${imagePath}`;
        } else if (!imagePath) {
          // Default to .jpg if no image specified
          imagePath = `${BASE_URL}/Articles/${project.name}.jpg`;
        }

        return {
          name: project.name,
          title: project.title || "Untitled Project",
          description: project.description || "",
          image: imagePath,
          date: project.date || "",
          author: project.author || "Unknown",
          path: project.path,
        };
      });

    return {
      projects: projectsWithMetadata,
    };
  } catch (error) {
    // Silently return empty projects list if file doesn't exist or has issues
    console.error("Error loading projects:", error);
    return {
      projects: [],
    };
  }
}

export function meta({ location }: { location: any }) {
  const url =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://creative-geek-blog.vercel.app";
  const description = `Explore projects by ${NAME}. Discover innovative applications, tools, and experiments in software development, AI, and web technologies.`;
  const imageUrl = `${BASE_URL}/Pages/cover.jpg`;

  return [
    // Basic meta tags
    { title: `Projects - ${NAME}` },
    { name: "description", content: description },
    { name: "author", content: NAME },
    {
      name: "keywords",
      content: `${NAME}, projects, portfolio, software development, applications, web development, AI`,
    },

    // Open Graph meta tags
    { property: "og:title", content: `Projects - ${NAME}` },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:image:alt", content: `${NAME}'s projects` },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:url", content: `${url}${location.pathname}` },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: `${NAME}'s Blog` },

    // Twitter Card meta tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `Projects - ${NAME}` },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: `${NAME}'s projects` },
    {
      name: "twitter:creator",
      content: `@${NAME.replace(/\s+/g, "").toLowerCase()}`,
    },
    {
      name: "twitter:site",
      content: `@${NAME.replace(/\s+/g, "").toLowerCase()}`,
    },
  ];
}

function ProjectsContent() {
  const { projects } = useLoaderData() as {
    projects: Project[];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Code2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-3">My Projects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of applications, tools, and experiments I've built. Each
            project represents a unique challenge and learning opportunity.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ArticleCard
              key={`${project.name}-${index}`}
              title={project.title}
              description={project.description}
              image={project.image}
              date={project.date}
              author={project.author}
              path={project.path}
            />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              No projects available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  // Generate structured data
  const projectsStructuredData = generateBlogStructuredData({
    name: `${NAME}'s Projects`,
    description: `Explore projects by ${NAME}. Discover innovative applications, tools, and experiments in software development, AI, and web technologies.`,
    url:
      typeof window !== "undefined"
        ? window.location.origin
        : "https://creative-geek-blog.vercel.app",
  });

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectsStructuredData),
        }}
      />

      <title>{`${NAME}'s Projects`}</title>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProjectsContent />
      </motion.div>
    </>
  );
}
