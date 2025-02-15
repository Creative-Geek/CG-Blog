# CG Blog :art:  

_Minimalist React blog engine with first-class RTL support. Your content, your hosting, no lock-in._

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features  
🔁 Auto RTL layout switching (Arabic/Urdu/Persian ready)  
🌐 Server-side rendering (React Router 7)  
📡 Remote markdown content from any URL  
♾️ Infinite scroll with loading states  
🖼️ Graceful image fallbacks  
🌗 Built-in dark mode (Shadcn/ui)  

## Get Started in 3 Steps  
1. Clone:  
```bash
git clone https://github.com/Creative-Geek/cg-blog.git
```

2. Set content source in `src/constants.js`:  
```js
// Use GitHub raw URLs, CMS API, or your own server
export const BASE_URL = "YOUR_MARKDOWN_FILES_URL";
```

3. Launch:  
```bash
npm install && npm run dev
```

## Content Structure Template  
```tree
Content Server/
├── Articles
│   ├── my-post.md     # Body content
│   ├── my-post.json   # { "title": "...", "date": "2025-01-01", ... }
│   └── my-post.jpg    # Optional cover
└── Pages
    ├── about.md       # Static page content
    └── about.json     # { "title": "About Me" }
```

## Hosting Strategies  
**Dynamic Mode (Recommended)**  
- Frontend: Deploy to Netlify/Vercel  
- Content: Host MD files on GitHub/S3/Cloudflare  
*Edits appear live without redeploys*

**Static Mode**  
- Place content in `/public` folder  
- Build with `npm run build`  
*Requires rebuild on content changes*

## Configuration Guide  
- **RTL Support**: Set `"dir": "rtl"` in article JSON  
- **SEO**: Edit `sitemap-generator.js`  
- **Styling**: Modify `tailwind.config.js`  
- **Empty States**: Customize `src/components/placeholder`

## Why CG Blog?  
- 🕋 Providing real RTL support to markdown content.  
- 🚀 Content lives separately - no CMS wars
- 🧩 Tested with 100+ articles (stress-free scroll)  

```bash
# Rebuild search index when adding content
node generate-index.js
```

## Contribute  
Help us improve:  
- Add content migration guides  
- Enhance image lazy-loading  
- Develop Git-based CMS adapter  

License: MIT  
