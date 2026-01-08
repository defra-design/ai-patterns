# Defra AI Patterns

This repository contains the Defra AI Patterns playbook, which aims to provide patterns for reusable use case, techical components and best practices for building AI solutions within Defra.

## Prerequisites

- Node.js (v24 LTS recommended) - We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage your Node.js versions.

## Development Guide

This playbook is built as a static site using [Astro](https://astro.build/) and uses the [GOV.UK Design System](https://design-system.service.gov.uk/) for frontend components and styling.

### Running Locally
To set up the project locally, follow these steps:
1. Clone the repository:
    ```bash
    git clone https://github.com/DEFRA/defra-ai-patterns.git
    cd defra-ai-patterns
    ```
2. Install dependencies:
    ```bash
    npm install --ignore-scripts
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:4321` to view the playbook.

### Adding New Patterns

Patterns are organized into two categories:

#### Use Case Patterns
Use case patterns describe real-world applications and scenarios for AI solutions. To add a new use case pattern, create a new Markdown file in the `src/pages/use-cases/` directory with the following frontmatter:

```markdown
---
layout: ../../layouts/MarkdownPost.astro
title: "Your Use Case Pattern Title"
activeNav: "use-cases"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
status: "Experimental" # or "In Development", "Stable", "Deprecated"
category: "Category Name" # e.g., "Document Processing", "Automation", "Analysis"
description: "A brief description of the use case pattern."
---
```

#### Technical Patterns
Technical patterns cover implementation details, architectures, and technical best practices. To add a new technical pattern, create a new Markdown file in the `src/pages/technical/` directory with the following frontmatter:

```markdown
---
layout: ../../layouts/MarkdownPost.astro
title: "Your Technical Pattern Title"
activeNav: "technical"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
status: "Experimental" # or "In Development", "Stable", "Deprecated"
category: "Category Name" # e.g., "Development", "Architecture", "Security"
description: "A brief description of the technical pattern."
---
```

### Adding New Blog Posts
To add a new blog post, create a new Markdown file in the `src/pages/blog/` directory. Each blog post should have the following frontmatter at the top of the file:

```markdown
---
layout: ../../layouts/MarkdownPost.astro
title: "Your Blog Post Title"
activeNav: "blog"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
status: "Published" # or "Draft", "Archived"
category: "Category Name" # e.g., "Updates", "Announcements", "Insights"
description: "A brief description of the blog post."
---
```

All blog posts should be written in Markdown format and be named using the format `YYYYMMDD-title.md` to ensure proper ordering.
