import { useLoaderData } from "react-router-dom";
import React from "react";
import { NAME, BASE_URL } from "../config/constants";
import Cover from "~/components/homePage/cover";
import Profile from "~/components/homePage/profile";
import ProjectsSection from "~/components/homePage/projectsSection";
import BlogSection from "~/components/homePage/blogSection";
import Contact from "~/components/homePage/contact";
import ExperienceSection from "~/components/homePage/experienceSection";
import { motion, useInView } from "framer-motion";

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

function FadeInSection({ children }: { children: React.ReactNode }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.6,
      }}
    >
      {children}
    </motion.div>
  );
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
  const { homeData, articles } = useLoaderData() as {
    homeData: HomeData;
    articles: Array<{ name: string }>;
  };

  return (
    <>
      <Cover
        mainTitle={homeData.mainTitle}
        mainSubtitle={homeData.mainSubtitle}
        coverImage={homeData.coverImage}
        hasProjects={homeData.projects && homeData.projects.length > 0}
      />

      <div className="container mx-auto px-4">
        <FadeInSection>
          <Profile
            image={`${BASE_URL}/Pages/${homeData.about.image}`}
            text={homeData.about.text}
          />
        </FadeInSection>
        <hr />
        <FadeInSection>
          <ProjectsSection projects={homeData.projects} />
        </FadeInSection>
        <hr />
        <FadeInSection>
          <ExperienceSection
            experience={homeData.experience}
            skills={homeData.skills}
          />
        </FadeInSection>
        <hr />
        <FadeInSection>
          <BlogSection
            articles={articles}
            featuredArticles={homeData.featuredArticles}
          />
        </FadeInSection>
        <hr />
        <FadeInSection>
          <Contact {...homeData.contact} />
        </FadeInSection>
      </div>
    </>
  );
}
