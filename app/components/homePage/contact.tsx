import { useEffect, useState } from "react";
import { BASE_URL } from "~/config/constants";
import { Button } from "~/components/ui/button";

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
      <section className="container py-16">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="h-8 w-64 animate-pulse rounded-md bg-muted mx-auto" />
          <div className="h-4 w-96 animate-pulse rounded-md bg-muted mx-auto" />
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted mx-auto" />
        </div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl text-center space-y-6">
        <h2 className="text-3xl font-bold tracking-tighter">{data.title}</h2>
        <p className="text-lg text-muted-foreground">{data.text}</p>
        <Button asChild size="lg">
          <a href={data.buttonLink}>Contact Me</a>
        </Button>
      </div>
    </section>
  );
}
