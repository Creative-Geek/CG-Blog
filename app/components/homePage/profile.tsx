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
      <section className="bg-card py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-64 h-64 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1 space-y-4">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="bg-card py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-64 h-64 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={data.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">About Me</h2>
            <p className=" text-lg">{data.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
