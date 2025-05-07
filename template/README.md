# CG Blog Template

This template provides a starting point for creating your own content for CG Blog. Follow the structure below to organize your content.

## Directory Structure

```
template/
├── Articles/              # Your blog articles
│   ├── example-article.md     # Example article content
│   ├── example-article.json   # Article metadata
│   └── example-article.jpg    # Article cover image (optional)
└── Pages/                 # Static pages
    ├── home.json         # Homepage configuration
    ├── about.md          # About page content
    ├── about.json        # About page metadata
    ├── about.jpg         # About page image (optional)
    ├── cover.jpg         # Homepage cover image
    └── profile.jpg       # Your profile picture
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
  - `about`: Your brief introduction
  - `projects`: List of featured projects
  - `skills`: Your key skills
  - `experience`: Your work experience
  - `featuredArticles`: Articles to highlight
  - `contact`: Contact information

- `about.md`: Your about page content in Markdown
- `about.json`: About page metadata
- `cover.jpg`: Large image for homepage background
- `profile.jpg`: Your profile picture

## Getting Started

1. Copy this template folder to your content server
2. Replace the example content with your own
3. Update the metadata in JSON files
4. Add your images
5. Run the build command to generate the index:
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
