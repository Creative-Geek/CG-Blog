import type { Route } from "./+types/home";
import { NAME } from "../config/constants";
import Cover from "~/components/homePage/cover";
import Profile from "~/components/homePage/profile";
import ProjectsSection from "~/components/homePage/projectsSection";
import BlogSection from "~/components/homePage/blogSection";
import Contact from "~/components/homePage/contact";

export function meta({}: Route.MetaArgs) {
  return [
    { title: NAME },
    { name: "description", content: "Welcome to Creative Geek's Blog!" },
  ];
}

export default function Home() {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <Cover />
      <hr></hr>
      <Profile />
      <hr></hr>
      <ProjectsSection />
      <hr></hr>
      <BlogSection />
      <hr></hr>
      <Contact />
    </div>
  );
}
