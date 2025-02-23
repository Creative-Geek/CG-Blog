import { useEffect, useState } from "react";
import { BASE_URL } from "~/config/constants";
import ArticleCard from "../articleCard";

interface Project {
  path: string;
}

interface ProjectsSectionProps {
  loading?: boolean;
  projects?: Array<{ path: string }>;
}

export default function ProjectsSection({ loading, projects }: ProjectsSectionProps) {
  if (loading) {
    return (
      <section className="container space-y-8 py-16">
        <div className="space-y-2 text-center">
          <div className="h-8 w-64 animate-pulse rounded-md bg-muted mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="h-48 animate-pulse bg-muted" />
              <div className="p-6 space-y-4">
                <div className="h-6 w-3/4 animate-pulse rounded-md bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!projects?.length) return null;

  return (
    <section className="container space-y-8 py-16">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tighter">
          Featured Projects
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ArticleCard key={index} path={project.path} />
        ))}
      </div>
    </section>
  );
}
