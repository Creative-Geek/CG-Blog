import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    ssr: {
      noExternal: ["posthog-js", "@posthog/react"],
    },
    server: {
      proxy: {
        "/ingest": {
          target: env.VITE_PUBLIC_POSTHOG_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ingest/, ""),
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Only apply manual chunks for client build, not SSR
            if (id.includes("node_modules")) {
              // Split heavy vendor libraries into separate chunks
              if (id.includes("framer-motion")) {
                return "framer-motion";
              }
              if (id.includes("react-markdown") || id.includes("remark-gfm")) {
                return "react-markdown";
              }
              if (id.includes("@radix-ui")) {
                return "radix-ui";
              }
              if (id.includes("html2canvas")) {
                return "html2canvas";
              }
              if (id.includes("jspdf")) {
                return "jspdf";
              }
              if (id.includes("mermaid")) {
                return "mermaid";
              }
            }
          },
        },
      },
      // Increase chunk size warning limit for production
      chunkSizeWarningLimit: 1000,
    },
  };
});
