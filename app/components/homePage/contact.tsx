import { useEffect, useState } from "react";
import { BASE_URL } from "~/config/constants";

interface ContactData {
  title: string;
  text: string;
  buttonLink: string;
}

export default function Contact() {
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${BASE_URL}/Pages/home.json`);
        if (!response.ok) throw new Error("Failed to fetch home data");
        const jsonData = await response.json();
        setData(jsonData.contact);
      } catch (error) {
        console.error("Error fetching contact data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <div className="space-y-6">
            <div className="h-8 w-64 bg-gray-700 rounded animate-pulse mx-auto" />
            <div className="h-4 w-96 bg-gray-700 rounded animate-pulse mx-auto" />
            <div className="h-10 w-32 bg-gray-700 rounded animate-pulse mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">{data.title}</h2>
        <p className="text-lg text-gray-300 mb-8">{data.text}</p>
        <a
          href={data.buttonLink}
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Me
        </a>
      </div>
    </section>
  );
}
