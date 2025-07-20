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
import {
  generateWebsiteStructuredData,
  generatePersonStructuredData,
} from "~/utils/structuredData";

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

export function meta({
  data,
  location,
}: {
  data: { homeData: HomeData };
  location: any;
}) {
  const url =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://creative-geek-blog.vercel.app";
  const description = `Welcome to ${NAME}'s Blog! Explore articles on software engineering, web development, AI integration, and digital innovation.`;
  const imageUrl = data.homeData.coverImage || `${BASE_URL}/Pages/cover.jpg`;

  return [
    // Basic meta tags
    { title: `${NAME} - Software Engineer & Digital Creator` },
    { name: "description", content: description },
    { name: "author", content: NAME },
    {
      name: "keywords",
      content: `${NAME}, software engineering, web development, AI, blog, portfolio, technology`,
    },

    // Open Graph meta tags
    {
      property: "og:title",
      content: `${NAME} - Software Engineer & Digital Creator`,
    },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    {
      property: "og:image:alt",
      content: `${NAME}'s portfolio and blog homepage`,
    },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: `${NAME}'s Blog` },

    // Twitter Card meta tags
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: `${NAME} - Software Engineer & Digital Creator`,
    },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    {
      name: "twitter:image:alt",
      content: `${NAME}'s portfolio and blog homepage`,
    },
    {
      name: "twitter:creator",
      content: `@${NAME.replace(/\s+/g, "").toLowerCase()}`,
    },
    {
      name: "twitter:site",
      content: `@${NAME.replace(/\s+/g, "").toLowerCase()}`,
    },
  ];
}

export default function Home() {
  const { homeData, articles } = useLoaderData() as {
    homeData: HomeData;
    articles: Array<{ name: string }>;
  };

  // Generate structured data
  const websiteStructuredData = generateWebsiteStructuredData({
    name: `${NAME}'s Blog`,
    description: `Welcome to ${NAME}'s Blog! Explore articles on software engineering, web development, AI integration, and digital innovation.`,
    url:
      typeof window !== "undefined"
        ? window.location.origin
        : "https://creative-geek-blog.vercel.app",
  });

  const personStructuredData = generatePersonStructuredData({
    name: NAME,
    description: `Software Engineer, Web Developer, and Digital Creator`,
    image: `${BASE_URL}/Pages/profile.jpg`,
    url:
      typeof window !== "undefined"
        ? window.location.origin
        : "https://creative-geek-blog.vercel.app",
  });

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personStructuredData),
        }}
      />

      <FadeInSection>
        <Cover
          mainTitle={homeData.mainTitle}
          mainSubtitle={homeData.mainSubtitle}
          coverImage={homeData.coverImage}
          hasProjects={homeData.projects && homeData.projects.length > 0}
        />
      </FadeInSection>
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
