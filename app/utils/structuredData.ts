import { BASE_URL, NAME } from "~/config/constants";

interface ArticleData {
  title: string;
  description: string;
  image?: string;
  author?: string;
  date?: string;
  url: string;
}

interface PersonData {
  name: string;
  description: string;
  image?: string;
  url: string;
}

interface WebsiteData {
  name: string;
  description: string;
  url: string;
}

export function generateArticleStructuredData(data: ArticleData) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "description": data.description,
    "author": {
      "@type": "Person",
      "name": data.author || NAME,
      "url": data.url.split('/blog/')[0]
    },
    "publisher": {
      "@type": "Person",
      "name": NAME,
      "url": data.url.split('/blog/')[0]
    },
    "datePublished": data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    "dateModified": data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    "url": data.url,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": data.url
    }
  };

  if (data.image) {
    (structuredData as any).image = {
      "@type": "ImageObject",
      "url": data.image,
      "width": 1200,
      "height": 630
    };
  }

  return structuredData;
}

export function generatePersonStructuredData(data: PersonData) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "jobTitle": "Software Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    },
    "knowsAbout": [
      "Software Engineering",
      "Web Development",
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "AI Integration"
    ]
  };

  if (data.image) {
    (structuredData as any).image = {
      "@type": "ImageObject",
      "url": data.image,
      "width": 400,
      "height": 400
    };
  }

  return structuredData;
}

export function generateWebsiteStructuredData(data: WebsiteData) {
  return {
    "@context": "https://schema.org",
    "@type": "Website",
    "name": data.name,
    "description": data.description,
    "url": data.url,
    "author": {
      "@type": "Person",
      "name": NAME
    },
    "publisher": {
      "@type": "Person",
      "name": NAME
    }
  };
}

export function generateBlogStructuredData(data: WebsiteData) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": `${data.name} - Blog`,
    "description": data.description,
    "url": `${data.url}/blog`,
    "author": {
      "@type": "Person",
      "name": NAME,
      "url": data.url
    },
    "publisher": {
      "@type": "Person",
      "name": NAME,
      "url": data.url
    }
  };
}

// Note: createStructuredDataScript is no longer needed as we're using
// React's dangerouslySetInnerHTML directly in components
