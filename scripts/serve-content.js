#!/usr/bin/env node
/**
 * Simple static file server with CORS support for local development.
 * Serves the content directory (Articles, Pages, etc.) for the CG Blog frontend.
 *
 * Usage: node scripts/serve-content.js [directory] [port]
 *
 * Arguments:
 *   directory - Path to the content directory (default: ../CG-Blog-Articles)
 *   port      - Port to serve on (default: 4000)
 *
 * Example:
 *   node scripts/serve-content.js ../CG-Blog-Articles 4000
 */

import { createServer } from "http";
import { readFile, stat } from "fs/promises";
import { join, extname, resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const DEFAULT_DIRECTORY = resolve(__dirname, "../../CG-Blog-Articles");
const DEFAULT_PORT = 4000;

const CONTENT_DIR = process.argv[2]
  ? resolve(process.argv[2])
  : DEFAULT_DIRECTORY;
const PORT = parseInt(process.argv[3], 10) || DEFAULT_PORT;

// MIME types for common file extensions
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".md": "text/markdown",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
};

function getMimeType(filePath) {
  const ext = extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

async function handleRequest(req, res) {
  // Set CORS headers for all requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Only allow GET and HEAD requests
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method Not Allowed");
    return;
  }

  // Parse URL and decode path
  const url = new URL(req.url, `http://localhost:${PORT}`);
  let filePath = decodeURIComponent(url.pathname);

  // Security: Prevent directory traversal
  filePath = filePath.replace(/\.\./g, "");

  // Default to index.html for root
  if (filePath === "/") {
    filePath = "/index.html";
  }

  const fullPath = join(CONTENT_DIR, filePath);

  try {
    // Check if file exists and is within CONTENT_DIR
    if (!fullPath.startsWith(CONTENT_DIR)) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      res.end("Forbidden");
      return;
    }

    const fileStat = await stat(fullPath);

    // If it's a directory, try to serve index.html
    if (fileStat.isDirectory()) {
      const indexPath = join(fullPath, "index.html");
      try {
        await stat(indexPath);
        const content = await readFile(indexPath);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
        return;
      } catch {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        return;
      }
    }

    // Read and serve the file
    const content = await readFile(fullPath);
    const mimeType = getMimeType(fullPath);

    res.writeHead(200, {
      "Content-Type": mimeType,
      "Content-Length": content.length,
    });
    res.end(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    } else {
      console.error("Server error:", error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  }
}

// Verify content directory exists
try {
  await stat(CONTENT_DIR);
} catch (error) {
  console.error(
    `\x1b[31mError: Content directory not found: ${CONTENT_DIR}\x1b[0m`
  );
  console.error(
    "\nPlease ensure the content directory exists or specify a different path:"
  );
  console.error(`  node scripts/serve-content.js <directory-path> [port]\n`);
  process.exit(1);
}

// Start server
const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log(
    `\x1b[32m✓ Content server running at http://localhost:${PORT}\x1b[0m`
  );
  console.log(`  Serving: ${CONTENT_DIR}\n`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down content server...");
  server.close(() => {
    process.exit(0);
  });
});
