import { useLoaderData } from "react-router-dom";
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
  featuredArticles?: Array<{ path: string }>;
}

export async function loader() {
  const [homeResponse, articlesResponse] = await Promise.all([
    fetch(`${BASE_URL}/Pages/home.json`),
    fetch(`${BASE_URL}/Articles/index.json`),
  ]);

  if (!homeResponse.ok) throw new Error("Failed to fetch home data");
  if (!articlesResponse.ok) throw new Error("Failed to fetch articles");

  const homeData: HomeData = await homeResponse.json();
  // Process cover image as in viewArticle loader
  if (homeData.coverImage && !homeData.coverImage.startsWith("http")) {
    homeData.coverImage = `${BASE_URL}/Pages/${homeData.coverImage}`;
  }
  const allArticles = await articlesResponse.json();
  const articles = allArticles.slice(0, 3);

  return { homeData, articles };
}

export function meta({ data }: { data: { homeData: HomeData } }) {
  return [
    { title: NAME },
    { name: "description", content: `Welcome to ${NAME}'s Blog!` },
    { property: "og:image", content: data.homeData.coverImage },
  ];
}

export default function Home() {
  const data = useLoaderData() as {
    homeData: HomeData;
    articles: Array<{ name: string }>;
  } | null;

  if (!data) {
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <Cover loading />
        <div className="container mx-auto px-4">
          <Profile loading />
          <hr />
          <ProjectsSection loading />
          <hr />
          <ExperienceSection loading />
          <hr />
          <BlogSection loading />
          <hr />
          <Contact loading />
        </div>
      </div>
    );
  }

  const { homeData, articles } = data;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Cover
        mainTitle={homeData.mainTitle}
        mainSubtitle={homeData.mainSubtitle}
        coverImage={homeData.coverImage}
        hasProjects={homeData.projects && homeData.projects.length > 0}
      />

      <div className="container mx-auto px-4">
        <Profile
          image={`${BASE_URL}/Pages/${homeData.about.image}`}
          text={homeData.about.text}
        />
        <hr />
        <ProjectsSection projects={homeData.projects} />
        <hr />
        <ExperienceSection
          experience={homeData.experience}
          skills={homeData.skills}
        />
        <hr />
        <BlogSection
          articles={articles}
          featuredArticles={homeData.featuredArticles}
        />
        <hr />
        <Contact {...homeData.contact} />
      </div>
    </div>
  );
}
