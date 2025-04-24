import { BASE_URL } from "~/config/constants";
import { type LoaderFunctionArgs } from "react-router";

const PLACEHOLDER_URL = "__FRONTEND_URL_PLACEHOLDER__"; // Must match placeholder in backend script

// This is the loader function that will be called by React Router
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // 1. Fetch the sitemap template from the backend
    const sitemapTemplateUrl = `${BASE_URL}/Articles/sitemap_template.xml`;
    const templateResponse = await fetch(sitemapTemplateUrl);

    if (!templateResponse.ok) {
      console.error(
        `Sitemap Error: Failed to fetch template (${templateResponse.status}) from ${sitemapTemplateUrl}`
      );
      throw new Error(
        `Failed to fetch sitemap template: ${templateResponse.statusText}`
      );
    }

    let sitemapXml = await templateResponse.text();

    // 2. Determine the actual frontend URL (origin) from the incoming request
    // This ensures it works correctly on localhost, Vercel previews, and production
    const frontendUrl = new URL(request.url);
    const frontendOrigin = frontendUrl.origin; // e.g., "https://creative-geek-blog.vercel.app" or "http://localhost:3000"

    // 3. Replace the placeholder with the actual frontend origin
    // Using a regex with 'g' flag ensures all occurrences are replaced
    const placeholderRegex = new RegExp(PLACEHOLDER_URL, "g");
    sitemapXml = sitemapXml.replace(placeholderRegex, frontendOrigin);

    // 4. Define static frontend pages (add/remove as needed)
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const staticPages = [
      { path: "/", priority: "1.0", freq: "weekly" },
      { path: "/blog", priority: "0.8", freq: "weekly" },
      { path: "/about", priority: "0.5", freq: "monthly" },
      // Add any other static pages here
    ];

    const staticPageEntries = staticPages
      .map(
        (page) => `
  <url>
    <loc>${frontendOrigin}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
      )
      .join("");

    // 5. Inject static pages before the closing </urlset> tag
    const closingTag = "</urlset>";
    const closingTagIndex = sitemapXml.lastIndexOf(closingTag);

    if (closingTagIndex !== -1) {
      sitemapXml =
        sitemapXml.slice(0, closingTagIndex) +
        staticPageEntries +
        sitemapXml.slice(closingTagIndex);
    } else {
      // Fallback if template structure is unexpected
      console.warn(
        "Sitemap Warning: </urlset> tag not found in the template. Appending static pages might result in invalid XML."
      );
      // Attempt to append, though it might break XML validation
      sitemapXml = sitemapXml.replace(
        /^(<\?xml[^>]*>)/, // Keep XML declaration if present
        `$1\n${staticPageEntries}` // Add static pages after declaration
      );
      // If no XML declaration, just prepend (less ideal)
      if (!sitemapXml.includes(staticPageEntries)) {
        sitemapXml = staticPageEntries + sitemapXml;
      }

      // Ensure the main tags are present if appending failed correctly
      if (!sitemapXml.includes("<urlset")) {
        sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticPageEntries}\n</urlset>`;
      } else if (!sitemapXml.endsWith("</urlset>")) {
        sitemapXml += "\n</urlset>";
      }
    }

    // 6. Return the final sitemap as a Response object
    return new Response(sitemapXml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // Cache for 1 hour on CDN/browser. Adjust as needed.
        // Fetching the template on every request isn't ideal without caching.
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap.xml:", error);

    // Return a minimal valid sitemap or an error response in case of failure
    const minimalSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
    return new Response(minimalSitemap, {
      status: 500, // Indicate server error
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    });
  }
}

// No default export is needed for a resource route
// The absence of a default export tells React Router this is a resource route
