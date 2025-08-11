# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog site built with Astro, hosted at jw1.dev. The site uses MDX for content, Tailwind CSS for styling, and SolidJS for interactive components.

## Development Commands

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Create a new blog post
node cli.js new-post "Post Title"
# Or create MDX post
node cli.js new-post "Post Title" -t mdx
# Create draft post
node cli.js new-post "Post Title" --draft
```

## Architecture

### Content Structure
- Blog posts are stored in `src/content/posts/` with filename format: `YYYY-MM-DD-slug.md(x)`
- Posts use frontmatter with schema defined in `src/content.config.ts`:
  - `title` (required)
  - `tags` (optional array)
  - `deprecated`, `draft` (optional boolean)
  - `date`, `updated` (optional date/string)
  - `issue` (optional number for comments)
  - `desc` (optional description)

### Routing System
- Dynamic routing based on post filenames
- URL pattern: `/slug` for posts
- Legacy URL pattern: `/YYYY/MM/DD/slug` for posts
- Legacy redirect from old slug format handled in `[slug].astro`

### Key Components
- Custom remark plugins for markdown processing:
  - `remark-plugin-image.js`: Image optimization
  - `remark-plugin-text.js`: Text formatting with Pangu
  - `remark-plugin-link.js`: External link handling
- Interactive audio components in SolidJS (`app-audio.jsx`)
- Comment system integration via issue numbers

### Styling
- Tailwind CSS for utility classes
- SCSS for component-specific styles
- Theme support with light/dark code highlighting

## Important Notes
- Site is deployed to Cloudflare Pages (jw1.dev)
- Uses Sharp for image processing
- Custom 404 page with redirect functionality
- RSS/Atom feed generation at `/atom.xml`