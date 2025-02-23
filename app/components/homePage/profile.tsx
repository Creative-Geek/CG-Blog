// profile containing profile image (circle), title (about me), and bio/description

import { useEffect, useState } from "react";
import { BASE_URL } from "~/config/constants";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";

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
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <Card className="animate-pulse">
            <div className="h-64 rounded-full bg-gray-200" />
            <CardContent className="p-6 space-y-4">
              <CardTitle className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <Card className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-64 h-64 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={data.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="flex-1">
            <CardTitle className="text-3xl font-bold mb-6">About Me</CardTitle>
            <p className="text-gray-600 text-lg">{data.text}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
