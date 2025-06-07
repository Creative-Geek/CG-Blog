import { useLoaderData, useNavigation, useLocation } from "react-router-dom";
import { Article } from "../components/Article";
import { BASE_URL, NAME } from "~/config/constants";
import { Loader2, FileDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/Toast";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface ArticleData {
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
  content: string;
}

export async function loader({ params }: { params: { path: string } }) {
  const { path } = params;
  const articlePath = `Articles/${path}`;

  try {
    const [markdownResponse, metadataResponse] = await Promise.all([
      fetch(`${BASE_URL}/${articlePath}.md`),
      fetch(`${BASE_URL}/${articlePath}.json`),
    ]);

    if (!markdownResponse.ok || !metadataResponse.ok) {
      throw new Error("Failed to fetch article");
    }

    const [content, metadata] = await Promise.all([
      markdownResponse.text(),
      metadataResponse.json(),
    ]);

    // Handle image path
    if (metadata.image && !metadata.image.startsWith("http")) {
      metadata.image = `${BASE_URL}/${articlePath
        .split("/")
        .slice(0, -1)
        .join("/")}/${metadata.image}`;
    }

    if (!metadata.image) {
      const extensions = [".jpg", ".jpeg", ".png", ".webp"];
      for (const ext of extensions) {
        const url = `${BASE_URL}/${articlePath}${ext}`;
        try {
          const response = await fetch(url);
          if (response.ok) {
            metadata.image = url;
            break;
          }
        } catch (_) {}
      }
    }

    return { ...metadata, content };
  } catch (error) {
    throw new Error("Failed to load article");
  }
}

export function meta({ data }: any) {
  return [
    { title: data?.title ? `${data.title} - ${NAME}` : NAME },
    { name: "description", content: data?.description },
  ];
}

function LoadingArticle() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-col items-center space-y-8">
        <div className="w-full space-y-4">
          <div className="h-8 w-3/4 mx-auto bg-muted animate-pulse rounded" />
          <div className="h-4 w-1/2 mx-auto bg-muted animate-pulse rounded" />
        </div>
        <div className="w-full h-64 bg-muted animate-pulse rounded-lg" />
        <div className="w-full space-y-4">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
          <div className="h-4 w-4/6 bg-muted animate-pulse rounded" />
        </div>
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    </article>
  );
}

export default function ViewArticle() {
  const articleData = useLoaderData() as ArticleData;
  const navigation = useNavigation();
  const location = useLocation();
  const isLoading = navigation.state === "loading";
  const [url, setUrl] = useState(location.pathname);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(`${window.location.origin}${location.pathname}`);
    }
  }, [location.pathname]);

  // Function to download article as PDF (single long page)
  const handleDownloadPDF = async (fileName: string = 'article') => {
    if (!articleRef.current) return;
    
    try {
      setIsPdfGenerating(true);
      showToast("Generating PDF...");
      
      // Find the article content element
      const articleElement = articleRef.current.querySelector('#article-content') as HTMLElement;
      if (!articleElement) return;
      
      // Create a clone of the article to manipulate without affecting the displayed version
      const clone = articleElement.cloneNode(true) as HTMLElement;
      
      // Apply light mode styles to the clone
      const tempStyles = document.createElement('style');
      tempStyles.textContent = `
        .article-pdf-container {
          background-color: white !important;
          color: black !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
          padding: 40px !important;
          max-width: none !important;
          margin: 0 !important;
          width: 800px !important;
        }
        .article-pdf-container * {
          color: black !important;
          background-color: transparent !important;
        }
        .article-pdf-container a {
          color: #0066cc !important;
          text-decoration: underline !important;
        }
        .article-pdf-container img {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 10px auto !important;
        }
        .article-pdf-container pre {
          border: 1px solid #ddd !important;
          background-color: #f8f8f8 !important;
          padding: 10px !important;
          overflow-x: auto !important;
          margin: 15px 0 !important;
          font-family: monospace !important;
          white-space: pre-wrap !important;
        }
        .article-pdf-container code {
          font-family: monospace !important;
          background-color: #f8f8f8 !important;
          color: #333 !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
        }
      `;
      document.head.appendChild(tempStyles);
      
      clone.classList.add('article-pdf-container');
      
      // Add clone to the document but make it invisible
      document.body.appendChild(clone);
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      
      // Force any images to load completely
      const images = Array.from(clone.querySelectorAll('img'));
      await Promise.all(
        images.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
      
      // Render HTML to canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 800,
      });
      
      // Create PDF with custom dimensions to fit content (single long page)
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Create PDF with dimensions matching the content
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'px',
        format: [imgWidth / 2, imgHeight / 2], // Divide by 2 due to scale factor
        compress: true
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Add the entire content as a single page
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth / 2, imgHeight / 2);
      
      // Save the PDF with better filename sanitization
      let safeName = 'article';
      if (fileName) {
        safeName = fileName
          // Replace unsafe filename characters
          .replace(/[/\\:*?"<>|]/g, '')
          // Replace spaces and multiple whitespace with single dash
          .replace(/\s+/g, '-')
          // Remove any remaining problematic characters but keep Unicode letters/numbers
          .replace(/[^\p{L}\p{N}\-_.]/gu, '')
          // Collapse multiple consecutive dashes
          .replace(/-+/g, '-')
          // Remove dashes from start and end
          .replace(/^-+|-+$/g, '')
          // Limit length
          .substring(0, 100);
        
        // Fallback if sanitization resulted in empty string
        if (!safeName || safeName === '') {
          safeName = 'article';
        }
      }
      pdf.save(`${safeName}.pdf`);
      
      // Clean up
      document.body.removeChild(clone);
      document.head.removeChild(tempStyles);
      
      showToast("PDF downloaded successfully!");
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast("Failed to generate PDF. Please try again.");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  if (isLoading) {
    return <LoadingArticle />;
  }

  return (
    <motion.div
      ref={articleRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.6,
      }}
    >
      <Article {...articleData} />
      
      <div className="container mx-auto max-w-3xl px-4 pb-8">
        <div className="flex justify-center">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleDownloadPDF(articleData.title)}
            disabled={isPdfGenerating}
            aria-label="Download article as PDF"
          >
            {isPdfGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="h-4 w-4" /> Download as PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
