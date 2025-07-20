import { Article } from "../components/Article";
import { motion } from "framer-motion";
import { BASE_URL, NAME } from "~/config/constants";
import { generatePersonStructuredData } from "~/utils/structuredData";

export function meta({ location }: { location: any }) {
  const url =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://creative-geek-blog.vercel.app";
  const description = `Learn more about ${NAME} - Software Engineer, Web Developer, and Digital Creator. Discover my background, skills, and passion for technology.`;
  const imageUrl = `${BASE_URL}/Pages/profile.jpg`;

  return [
    // Basic meta tags
    { title: `About - ${NAME}` },
    { name: "description", content: description },
    { name: "author", content: NAME },
    {
      name: "keywords",
      content: `${NAME}, about, software engineer, web developer, portfolio, biography`,
    },

    // Open Graph meta tags
    { property: "og:title", content: `About - ${NAME}` },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:image:alt", content: `${NAME}'s profile picture` },
    { property: "og:image:width", content: "400" },
    { property: "og:image:height", content: "400" },
    { property: "og:url", content: `${url}${location.pathname}` },
    { property: "og:type", content: "profile" },
    { property: "og:site_name", content: `${NAME}'s Blog` },

    // Twitter Card meta tags
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: `About - ${NAME}` },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: `${NAME}'s profile picture` },
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

export default function About() {
  // Generate structured data
  const personStructuredData = generatePersonStructuredData({
    name: NAME,
    description: `Learn more about ${NAME} - Software Engineer, Web Developer, and Digital Creator. Discover my background, skills, and passion for technology.`,
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
          __html: JSON.stringify(personStructuredData),
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
      >
        <title>About Me</title>
        <Article path="Pages/about" />
      </motion.div>
    </>
  );
}
