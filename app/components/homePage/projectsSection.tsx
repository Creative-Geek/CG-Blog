import { useEffect, useState } from "react";
import { BASE_URL } from "~/config/constants";
import ProjectCard from "./projectCard";

interface Project {
  path: string;
}

interface Article {
  title: string;
  description: string;
  image: string;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${BASE_URL}/Pages/home.json`);
        if (!response.ok) throw new Error("Failed to fetch home data");
        const jsonData = await response.json();
        setProjects(jsonData.projects);

        // Fetch article data for each project
        const articlePromises = jsonData.projects.map(async (project: Project) => {
          const articleResponse = await fetch(`${BASE_URL}/${project.path}.json`);
          console.log(articleResponse);
          if (!articleResponse.ok) throw new Error(`Failed to fetch article for ${project.path}`);
          return articleResponse.json();
        });

        const articlesData = await Promise.all(articlePromises);
        setArticles(articlesData);
      } catch (error) {
        console.error("Error fetching projects or articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <ProjectCard
              key={index}
              title={article.title}
              description={article.description}
              image={article.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
