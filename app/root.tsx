import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Analytics } from "@vercel/analytics/react";

import type { Route } from "./+types/root";
import "./app.css";
import { Navbar } from "./components/Navbar";
import { ThemeProvider } from "./components/ThemeProvider";
import { ToastProvider } from "./components/ui/Toast";

export const links: Route.LinksFunction = () => [
  // Preconnect to external domains for faster loading
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "preconnect",
    href: "https://cg-blog-articles.pages.dev",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Alexandria:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Default meta tags - will be overridden by route-specific meta */}
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />

        {/* Favicon and app icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Route-specific meta tags */}
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            {children}
            <ScrollRestoration />
            <Scripts />
            <Analytics />
          </ToastProvider>
        </ThemeProvider>
        <script
          data-goatcounter="https://cg-blog.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"
        ></script>
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
