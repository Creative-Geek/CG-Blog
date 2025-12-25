# CG Blog Template

This template provides a starting point for creating your own content for CG Blog. Follow the structure below to organize your content.

## Directory Structure

```
template/
├── Articles/              # Your blog articles
│   ├── example-article.md     # Example article content
│   ├── example-article.json   # Article metadata
│   └── example-article.jpg    # Article cover image (optional)
├── Pages/                 # Static pages
│   ├── home.json         # Homepage configuration
│   ├── projects.json     # List of projects
│   ├── about.md          # About page content
│   ├── about.json        # About page metadata
│   ├── about.jpg         # About page image (optional)
│   ├── cover.jpg         # Homepage cover image
│   ├── profile.jpg       # Your profile picture
│   └── resume.pdf        # Your resume/CV (optional)
├── index.html             # Local previewer
├── 404.html               # 404 Page
└── _redirects             # Redirect rules (for Netlify etc.)
```

## File Descriptions

### Articles

- `.md` files contain your article content in Markdown format
- `.json` files contain article metadata (title, date, author, etc.)
- `.jpg` files are optional cover images for articles

### Pages

- `home.json`: Configures your homepage layout and content

  - `mainTitle`: Your name or site title
  - `mainSubtitle`: Your tagline or main skills
  - `coverImage`: Homepage cover image filename
  - `links`: Array of external links (e.g. Portfolio, Socials)
  - `about`: Your brief introduction
  - `projects`: List of featured projects (manual selection)
  - `skills`: Your key skills
  - `experience`: Your work experience
  - `featuredArticles`: Articles to highlight
  - `contact`: Contact information

- `projects.json`: List of all projects to be generated
- `about.md`: Your about page content in Markdown
- `about.json`: About page metadata
- `cover.jpg`: Large image for homepage background
- `profile.jpg`: Your profile picture
- `resume.pdf`: Your professional resume/CV (optional)

### Root Files

- `index.html`: A simple HTML file to preview your articles locally.
- `404.html`: Custom 404 page for static hosting.
- `_redirects`: Configuration for redirects (e.g. for Netlify).
- `generate-index.js`: Script to generate `index.json`, `sitemap_template.xml`, and `projects-generated.json`.

## Getting Started

1. Copy this template folder to your content server
2. Replace the example content with your own
3. Update the metadata in JSON files
4. Add your images
5. Add your resume.pdf if desired
6. Run the build command to generate the index:
   ```bash
   node generate-index.js
   ```

## Image Guidelines

- Use `.jpg` or `.png` format
- Recommended sizes:
  - `cover.jpg`: 1920x1080px
  - `profile.jpg`: 400x400px
  - Article covers: 1200x630px

## Markdown Support

The blog supports standard Markdown features:

- Headers
- Lists
- Code blocks
- Images
- Links
- And more!

See `example-article.md` for examples of Markdown usage.
