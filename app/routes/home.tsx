import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { NAME, BASE_URL } from "../config/constants";
import Cover from "~/components/homePage/cover";
import Profile from "~/components/homePage/profile";
import ProjectsSection from "~/components/homePage/projectsSection";
import BlogSection from "~/components/homePage/blogSection";
import Contact from "~/components/homePage/contact";
import ExperienceSection from "~/components/homePage/experienceSection";

interface HomeData {
  mainTitle: string;
  mainSubtitle: string;
  coverImage: string;
  about: {
    image: string;
    text: string;
  };
  projects: Array<{ path: string }>;
  skills: string[];
  experience: Array<{
    title: string;
    date: string;
    description: string;
  }>;
  contact: {
    title: string;
    text: string;
    buttonLink: string;
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: NAME },
    { name: "description", content: "Welcome to Creative Geek's Blog!" },
  ];
}

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [articles, setArticles] = useState<Array<{ name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [homeResponse, articlesResponse] = await Promise.all([
          fetch(`${BASE_URL}/Pages/home.json`),
          fetch(`${BASE_URL}/Articles/index.json`),
        ]);

        if (!homeResponse.ok) throw new Error("Failed to fetch home data");
        if (!articlesResponse.ok) throw new Error("Failed to fetch articles");

        const homeData = await homeResponse.json();
        const allArticles = await articlesResponse.json();

        setData(homeData);
        setArticles(allArticles.slice(0, 3)); // Get latest 3 articles
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="animate-pulse">
          <Cover loading={true} />
          <hr />
          <div className="container mx-auto px-4">
            <Profile loading={true} />
            <hr />
            <ProjectsSection loading={true} />
            <hr />
            <ExperienceSection loading={true} />
            <hr />
            <BlogSection loading={true} />
            <hr />
            <Contact loading={true} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Cover
        mainTitle={data.mainTitle}
        mainSubtitle={data.mainSubtitle}
        coverImage={`${BASE_URL}/Pages/${data.coverImage}`}
        hasProjects={data.projects && data.projects.length > 0}
      />
      <hr />
      <div className="container mx-auto px-4">
        <Profile
          image={`${BASE_URL}/Pages/${data.about.image}`}
          text={data.about.text}
        />
        <hr />
        <ProjectsSection projects={data.projects} />
        <hr />
        <ExperienceSection skills={data.skills} experience={data.experience} />
        <hr />
        <BlogSection articles={articles} />
        <hr />
        <Contact {...data.contact} />
      </div>
    </div>
  );
}
