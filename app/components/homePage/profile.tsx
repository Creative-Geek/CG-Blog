// profile containing profile image (circle), title (about me), and bio/description

import { useEffect, useState } from "react";
import { BASE_URL } from "~/config/constants";

interface AboutData {
  image: string;
  text: string;
}

export default function Profile() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${BASE_URL}/Pages/home.json`);
        if (!response.ok) throw new Error("Failed to fetch home data");
        const jsonData = await response.json();
        setData({
          image: `${BASE_URL}/Pages/${jsonData.about.image}`,
          text: jsonData.about.text,
        });
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="container py-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-64 h-64 rounded-full animate-pulse bg-muted" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="container py-16">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-64 h-64 rounded-full overflow-hidden flex-shrink-0 bg-muted">
          <img
            src={data.image}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tighter mb-6">About Me</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {data.text}
          </p>
        </div>
      </div>
    </section>
  );
}
