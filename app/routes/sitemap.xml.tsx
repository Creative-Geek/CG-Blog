import { BASE_URL } from "~/config/constants";
import { type LoaderFunctionArgs } from "react-router";

// This function will generate the sitemap XML content
async function generateSitemapXml(requestUrl: string) {
  try {
    // Fetch the list of articles
    const articlesResponse = await fetch(`${BASE_URL}/Articles/index.json`);
    if (!articlesResponse.ok) {
      throw new Error("Failed to fetch articles");
    }

    const articles = await articlesResponse.json();

    // Extract the base URL from the request URL
    const url = new URL(requestUrl);
    const siteUrl = `${url.protocol}//${url.host}`;

    // Start building the XML content
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add the homepage
    xml += "  <url>\n";
    xml += `    <loc>${siteUrl}/</loc>\n`;
    xml += "    <changefreq>weekly</changefreq>\n";
    xml += "    <priority>1.0</priority>\n";
    xml += "  </url>\n";

    // Add the blog page
    xml += "  <url>\n";
    xml += `    <loc>${siteUrl}/blog</loc>\n`;
    xml += "    <changefreq>weekly</changefreq>\n";
    xml += "    <priority>0.8</priority>\n";
    xml += "  </url>\n";

    // Add the about page
    xml += "  <url>\n";
    xml += `    <loc>${siteUrl}/about</loc>\n`;
    xml += "    <changefreq>monthly</changefreq>\n";
    xml += "    <priority>0.7</priority>\n";
    xml += "  </url>\n";

    // Add each article
    for (const article of articles) {
      xml += "  <url>\n";
      xml += `    <loc>${siteUrl}/blog/${article.name}</loc>\n`;

      // Try to get the last modified date from the article metadata
      try {
        const metadataResponse = await fetch(
          `${BASE_URL}/Articles/${article.name}.json`
        );
        if (metadataResponse.ok) {
          const metadata = await metadataResponse.json();
          if (metadata.date) {
            xml += `    <lastmod>${
              new Date(metadata.date).toISOString().split("T")[0]
            }</lastmod>\n`;
          }
        }
      } catch (error) {
        // If we can't get the metadata, just continue without the lastmod tag
        console.error(`Error fetching metadata for ${article.name}:`, error);
      }

      xml += "    <changefreq>monthly</changefreq>\n";
      xml += "    <priority>0.6</priority>\n";
      xml += "  </url>\n";
    }

    // Close the XML
    xml += "</urlset>";

    return xml;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    throw error;
  }
}

// This is the loader function that will be called by React Router
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const xml = await generateSitemapXml(request.url);

    // Create a new Response with the XML content and appropriate headers
    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Content-Length": String(xml.length),
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error in sitemap loader:", error);
    return new Response("Error generating sitemap", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}

// No default export is needed for a resource route
// The absence of a default export tells React Router this is a resource route
