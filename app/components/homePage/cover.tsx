// cover with title, subtitle, and image

import { useEffect, useState } from "react";
import { BASE_URL } from "~/config/constants";

interface CoverData {
  mainTitle: string;
  mainSubtitle: string;
  coverImage: string;
}

export default function Cover() {
  const [data, setData] = useState<CoverData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${BASE_URL}/Pages/home.json`);
        if (!response.ok) throw new Error("Failed to fetch home data");
        const jsonData = await response.json();
        setData({
          mainTitle: jsonData.mainTitle,
          mainSubtitle: jsonData.mainSubtitle,
          coverImage: `${BASE_URL}/Pages/${jsonData.coverImage}`,
        });
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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

  if (!data) return null;

  return (
    <section className="relative w-full h-[90vh]">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.coverImage})` }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative flex items-center justify-center h-full text-center text-white p-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.mainTitle}</h1>
          <p className="text-xl md:text-2xl">{data.mainSubtitle}</p>
        </div>
      </div>
    </section>
  );
}
