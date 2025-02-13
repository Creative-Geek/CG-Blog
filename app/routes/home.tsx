import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Creative Geek" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
      <header className="flex flex-col items-center gap-9">
        <div className="w-[500px] max-w-[100vw] p-4">
          <p>Hello Test</p>
        </div>
      </header>
      <div className="max-w-[300px] w-full space-y-6 px-4"></div>
    </div>
  );
}
