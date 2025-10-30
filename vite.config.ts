import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
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
          if (id.includes('node_modules')) {
            // Split heavy vendor libraries into separate chunks
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            if (id.includes('react-markdown') || id.includes('remark-gfm')) {
              return 'react-markdown';
            }
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            if (id.includes('html2canvas')) {
              return 'html2canvas';
            }
            if (id.includes('jspdf')) {
              return 'jspdf';
            }
          }
        },
      },
    },
    // Increase chunk size warning limit for production
    chunkSizeWarningLimit: 1000,
  },
});
