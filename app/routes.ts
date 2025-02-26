import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("blog", "routes/blog.tsx"),
  route("about", "routes/about.tsx"),
  route("article/:path", "routes/article.$path.tsx"),
] satisfies RouteConfig;
