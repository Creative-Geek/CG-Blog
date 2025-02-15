import type { Route } from "./+types/home";
import { Link } from "react-router-dom";
import { NAME } from "../config/constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: NAME },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
      <header className="flex flex-col items-center gap-9">
        <div className="w-[500px] max-w-[100vw] p-4 text-center">
          <p>Hey There! This page is under construction🚧</p>
          <p>I'm currently working on it and will be back soon.</p>
          <p>
            In the meantime, you can check out my <Link to="/blog">blog</Link>.
          </p>
        </div>
      </header>
      <div className="max-w-[300px] w-full space-y-6 px-4"></div>
    </div>
  );
}
