import { useEffect } from 'react';

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  author?: string;
  url?: string;
}

export function useMetaTags({
  title,
  description,
  image,
  type = 'article',
  author,
  url,
}: MetaTagsProps) {
  useEffect(() => {
    // Store original meta tags to restore them on cleanup
    const originalTitle = document.title;
    const originalMeta = Array.from(document.getElementsByTagName('meta')).reduce((acc, meta) => {
      const name = meta.getAttribute('name');
      const property = meta.getAttribute('property');
      if (name || property) {
        acc.set(name || property!, meta.getAttribute('content')!);
      }
      return acc;
    }, new Map<string, string>());

    // Update title
    if (title) {
      document.title = `${title} | ${originalTitle}`;
    }

    // Helper function to set meta tag
    const setMetaTag = (name: string, content?: string) => {
      if (!content) return;
      
      let meta = document.querySelector(`meta[name="${name}"]`) ||
                document.querySelector(`meta[property="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Set meta tags
    setMetaTag('description', description);
    setMetaTag('author', author);
    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:image', image);
    setMetaTag('og:type', type);
    setMetaTag('og:url', url);
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    // Cleanup function to restore original meta tags
    return () => {
      document.title = originalTitle;
      
      // Remove added meta tags
      const currentMetas = document.getElementsByTagName('meta');
      Array.from(currentMetas).forEach(meta => {
        const name = meta.getAttribute('name');
        const property = meta.getAttribute('property');
        if (name || property) {
          const key = name || property!;
          if (originalMeta.has(key)) {
            meta.setAttribute('content', originalMeta.get(key)!);
          } else {
            meta.remove();
          }
        }
      });
    };
  }, [title, description, image, type, author, url]);
}
