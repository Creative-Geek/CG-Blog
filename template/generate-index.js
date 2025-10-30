// --- START OF FILE generate-index.js ---
const fs = require("fs");
const path = require("path");

// --- Configuration ---
const PLACEHOLDER_URL = "__FRONTEND_URL_PLACEHOLDER__"; // Unique placeholder
const articlesDir = path.join(__dirname, "Articles");
const sitemapTemplatePath = path.join(articlesDir, "sitemap_template.xml"); // Output template here
const indexPath = path.join(articlesDir, "index.json");

// --- Helper Functions ---
function parseDate(dateStr) {
  if (!dateStr) return null;
  // Try ISO format (2025-02-11) first
  const isoDate = new Date(dateStr);
  if (!isNaN(isoDate) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return isoDate;
  }

  // Try common English format (e.g., "8 Feb 2023")
  const parts = dateStr.match(/(\d{1,2})\s+(\w{3,})\s+(\d{4})/);
  if (parts) {
    const day = parts[1];
    const month = parts[2];
    const year = parts[3];
    const parsed = new Date(`${month} ${day}, ${year}`);
    if (!isNaN(parsed)) return parsed;
  }
  console.warn(
    `Could not parse date: "${dateStr}". Please use YYYY-MM-DD format.`
  );
  return null;
}

function formatDateForSitemap(date) {
  if (!date || isNaN(date)) return null;
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

// --- Main Logic ---
try {
  const files = fs.readdirSync(articlesDir);
  const articles = [];
  const sitemapEntries = []; // Only for articles now

  // 1. Process article files
  for (const file of files) {
    // Ignore index, sitemap template, and non-JSON files
    if (
      ["index.json", "sitemap_template.xml"].includes(file) ||
      !file.endsWith(".json")
    )
      continue;

    const filePath = path.join(articlesDir, file);
    const stats = fs.statSync(filePath);
    if (!stats.isFile()) continue;

    const articleName = file.replace(".json", "");
    let articleData = {
      name: articleName,
      title: "Invalid Article",
      date: null,
      rawDate: "",
      author: "Unknown",
      hidden: false,
      lastModified: formatDateForSitemap(stats.mtime),
    };

    try {
      const content = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(content);

      articleData = {
        ...articleData,
        title: data.title || "Untitled",
        date: parseDate(data.date),
        rawDate: data.date || "",
        author: data.author || "Unknown",
        hidden: data.hidden === true,
      };

      if (articleData.hidden) {
        console.log(`Skipping hidden article: ${file}`);
        continue;
      }

      articles.push(articleData);

      // Add valid articles to sitemap entries using the placeholder
      const lastModDate =
        formatDateForSitemap(articleData.date) || articleData.lastModified;
      if (articleName && lastModDate) {
        sitemapEntries.push(`
  <url>
    <loc>${PLACEHOLDER_URL}/blog/${encodeURIComponent(articleName)}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
      } else {
        console.warn(
          `Skipping article "${articleName}" from sitemap template due to missing name or parsable date.`
        );
      }
    } catch (e) {
      console.error(`Error processing ${file}:`, e.message);
      if (!articles.some((a) => a.name === articleName)) {
        articles.push(articleData);
      }
    }
  }

  // 2. Sort articles for index.json
  articles.sort((a, b) => {
    if (a.date && b.date) return b.date.getTime() - a.date.getTime();
    if (a.date) return 1;
    if (b.date) return -1;
    return a.title.localeCompare(b.title);
  });

  // 3. Generate index.json with full metadata to reduce API calls
  const index = articles.map((a) => {
    // Read the full metadata file
    const metadataPath = path.join(articlesDir, `${a.name}.json`);
    let fullMetadata = { name: a.name };

    try {
      const content = fs.readFileSync(metadataPath, "utf8");
      fullMetadata = JSON.parse(content);
      fullMetadata.name = a.name; // Ensure name is included
    } catch (e) {
      console.error(`Error reading metadata for ${a.name}:`, e.message);
    }

    return fullMetadata;
  });

  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(
    `Successfully generated sorted article index with metadata: ${indexPath}`
  );
  console.log(`Processed ${articles.length} articles for index.json`);

  // 4. Generate sitemap_template.xml (only contains article URLs with placeholders)
  // Note: We add the <?xml...> and <urlset> tags here, the frontend will insert static pages *before* the closing </urlset>
  const sitemapTemplateContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join("")}
</urlset>`; // Closing tag included here

  fs.writeFileSync(sitemapTemplatePath, sitemapTemplateContent);
  console.log(
    `Successfully generated sitemap template: ${sitemapTemplatePath}`
  );
  console.log(
    `Included ${sitemapEntries.length} article URLs in sitemap template.`
  );
} catch (error) {
  console.error("Error generating index or sitemap template:", error);
  process.exit(1);
}
// --- END OF FILE generate-index.js ---
