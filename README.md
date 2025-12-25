# CG Blog :art:

![image](https://github.com/user-attachments/assets/819fe6a2-05bc-4303-aeca-72d766d337ac)

_Minimalist React blog engine with first-class RTL support. Your content, any hosting, no lock-in._

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

🔁 Auto RTL Article switching (Arabic/Urdu/Persian ready)  
🌐 Server-side rendering (React Router 7)  
📡 Remote markdown content from any URL  
♾️ Infinite scroll with loading states  
🖼️ Graceful fallbacks for missing data  
🌗 Built-in dark mode (Shadcn/ui)

## Get Started in 4 Steps

1. Clone:

```bash
git clone https://github.com/Creative-Geek/cg-blog.git
```

2. Create Content:

- Copy the template folder contents to a new folder and edit the content.
- Set a build command:

  ```bash
  node generate-index.js
  ```

- Deploy to any static serving service.

3. Configure via environment variables:

Create a `.env` file or set these in your deployment platform (Vercel, Netlify, Cloudflare Pages):

```bash
# Required: URL where your content is hosted
VITE_BASE_URL=https://your-content.pages.dev

# Your name/site name (default: "Creative Geek")
VITE_NAME=Your Name

# Optional: External resume URL (Google Drive, etc.)
# Leave empty to use BASE_URL/Pages/resume.pdf
VITE_RESUME_URL=

# Check if resume.pdf exists at BASE_URL (default: false)
VITE_CHECK_RESUME_EXISTS=true

# Use cover image instead of animated background (default: false)
VITE_USE_COVER_IMAGE=false
```

See `.env.example` for all available options.

4. Launch:

```bash
npm install && npm run dev
```

## Content Structure Template

```tree
Content Server/
├── Articles/
│   ├── my-post.md     # Article content in markdown
│   ├── my-post.json   # Article metadata
│   └── my-post.jpg    # Optional cover image
└── Pages/
    ├── about.md       # Static page content
    └── about.json     # Page metadata
```

### Article JSON Format

```json
{
  "title": "Your Article Title",
  "image": "optional-cover.jpg",
  "description": "A brief description of your article",
  "date": "DD MMM YYYY",
  "author": "Author Name"
}
```

### Page JSON Format

```json
{
  "title": "Page Title"
}
```

## Hosting Strategies

- **Frontend**: Deploy this repo to Vercel/Netlify/Github Pages
- **Content**: Host MD files on GitHub/S3/Cloudflare  
  _Edits appear live without redeploys, only new articles need to be added to index using the build command_

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

- Develop Git-based CMS adapter
- Provide feedback!

License: MIT
