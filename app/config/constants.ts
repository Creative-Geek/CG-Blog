// Environment variables for CG Blog configuration
// These can be set via .env file or deployment platform settings (Vercel, Netlify, Cloudflare Pages, etc.)
// All variables are optional and have sensible defaults

// Base URL for your content (Articles, Pages, etc.)
export const BASE_URL = import.meta.env.VITE_BASE_URL || "https://cg-blog-articles.pages.dev";

// Your name or site name - displayed in navbar, SEO, etc.
export const NAME = import.meta.env.VITE_NAME || "Creative Geek";

// Logo text displayed in the navbar (defaults to "CG Blog")
export const LOGO_TEXT = import.meta.env.VITE_LOGO_TEXT || "CG Blog";

// Social links - leave empty to hide the button
export const GITHUB_URL = import.meta.env.VITE_GITHUB_URL || "https://github.com/Creative-Geek";
export const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL || "https://www.linkedin.com/in/ahmed-taha-thecg";

// External resume URL (Google Drive, Dropbox, etc.)
// Leave empty or unset if using resume.pdf hosted at BASE_URL/Pages/resume.pdf
export const RESUME_URL = import.meta.env.VITE_RESUME_URL || "";

// Set to "true" to check if resume.pdf exists at BASE_URL/Pages/resume.pdf
// Set to "false" if using external link (RESUME_URL) - skips existence check
export const CHECK_RESUME_EXISTS = import.meta.env.VITE_CHECK_RESUME_EXISTS === "true";

// Set to "true" to use cover image as homepage background
// Set to "false" to use the animated Prism background
export const USE_COVER_IMAGE = import.meta.env.VITE_USE_COVER_IMAGE === "true";
