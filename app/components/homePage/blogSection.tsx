import { useEffect, useState } from "react";
import { BASE_URL } from "~/config/constants";
import ArticleCard from "../articleCard";

interface Article {
  name: string;
}

interface BlogSectionProps {
  loading?: boolean;
  articles?: Array<{ name: string }>;
}

export default function BlogSection({ loading, articles }: BlogSectionProps) {
  if (loading) {
    return (
      <section className="container py-16">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <div className="h-8 w-64 animate-pulse rounded-md bg-muted mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm h-[300px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!articles?.length) return null;

  return (
    <section className="container py-16">
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tighter">Latest Blog Posts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <ArticleCard
              key={index}
              path={`Articles/${article.name}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
