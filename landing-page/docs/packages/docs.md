# @siriux/docs

Documentation platform and tools for the Siriux ecosystem.

## Installation

```bash
npm install @siriux/docs
```

## Overview

The `@siriux/docs` package provides a complete documentation platform built with VitePress. It includes:

- Professional documentation site
- Search functionality
- Mobile-responsive design
- Dark mode support
- API documentation templates
- Getting started guides

## Features

- **VitePress Powered**: Fast, modern documentation site
- **Search Functionality**: Built-in full-text search
- **Mobile Responsive**: Works perfectly on all devices
- **Dark Mode**: Automatic theme switching
- **Code Examples**: Syntax-highlighted code blocks
- **Navigation**: Hierarchical sidebar navigation
- **SEO Optimized**: Meta tags and structured data

## Usage

### Setting Up Documentation

```bash
# Install dependencies
npm install @siriux/docs

# Create docs directory
mkdir docs
cd docs

# Initialize VitePress
npx vitepress init
```

### Configuration

Create `.vitepress/config.ts`:

```typescript
import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Your Documentation',
  description: 'Complete documentation for your project',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Configuration', link: '#configuration' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Core API', link: '../../packages/core.md' },
          { text: 'Utilities', link: '/api/utilities' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/yourproject' }
    ],
    search: {
      provider: 'local'
    }
  }
});
```

### Writing Documentation

Create markdown files in your docs directory:

```markdown
# Getting Started

Welcome to your documentation!

## Installation

```bash
npm install your-package
```

## Usage

```typescript
import { YourPackage } from 'your-package';

const instance = new YourPackage();
instance.doSomething();
```
```

### Running the Documentation

```bash
# Development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

## Documentation Structure

### Recommended Directory Structure

```
docs/
├── index.md                 # Homepage
├── guide/                   # User guides
│   ├── getting-started.md
│   ├── configuration.md
│   └── examples.md
├── api/                     # API documentation
│   ├── core.md
│   ├── utilities.md
│   └── types.md
├── examples/                # Code examples
│   ├── basic-usage.md
│   └── advanced-usage.md
└── .vitepress/
    ├── config.ts
    └── theme/
        └── index.ts
```

### Homepage Content

Your `index.md` should include:

```markdown
---
layout: home
hero:
  name: Your Project
  tagline: A brief description of your project
  image:
    src: /logo.svg
    alt: Your Project
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/yourusername/yourproject

features:
  - title: Feature One
    description: Description of the first feature
  - title: Feature Two
    description: Description of the second feature
  - title: Feature Three
    description: Description of the third feature
---
```

## Customization

### Theme Customization

Create `.vitepress/theme/index.ts`:

```typescript
import DefaultTheme from 'vitepress/theme';

export default {
  extends: DefaultTheme,
  Layout: () => {
    // Custom layout component
  }
};
```

### Custom Components

Create `.vitepress/theme/components/CustomComponent.vue`:

```vue
<template>
  <div class="custom-component">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
}

defineProps<Props>();
</script>

<style scoped>
.custom-component {
  padding: 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  margin: 1rem 0;
}
</style>
```

Use in markdown:

```vue
<CustomComponent 
  title="Custom Title" 
  description="Custom description" 
/>
```

## Best Practices

### 1. Clear Structure

- Use logical grouping in sidebar
- Keep navigation shallow (max 3 levels)
- Use descriptive titles

### 2. Code Examples

```markdown
<!-- Good: Complete, runnable example -->
```typescript
import { YourPackage } from 'your-package';

// Initialize the package
const instance = new YourPackage({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Use the package
const result = await instance.processData({
  input: 'example',
  options: { validate: true }
});

console.log(result);
```

<!-- Bad: Incomplete example -->
```typescript
const instance = new YourPackage();
instance.doSomething();
```
```

### 3. Consistent Formatting

- Use consistent heading levels
- Include code language tags
- Add alt text for images
- Use semantic HTML

### 4. Navigation

```typescript
// Good sidebar structure
{
  text: 'Getting Started',
  items: [
    { text: 'Installation', link: '/guide/installation' },
    { text: 'Configuration', link: '/guide/configuration' },
    { text: 'First Steps', link: '/guide/first-steps' }
  ]
}
```

### 5. SEO Optimization

```markdown
---
title: Page Title
description: Page description for search engines
keywords: [keyword1, keyword2, keyword3]
---

# Page Content
```

## Examples

### API Documentation

```markdown
# Core API

## Methods

### createInstance(options)

Creates a new instance of the package.

**Parameters:**

- `options` ([InstanceOptions](#instanceoptions)) - Configuration options

**Returns:**

- `Promise<Instance>` - The created instance

**Example:**

```typescript
const instance = await createInstance({
  apiKey: 'your-api-key',
  environment: 'production'
});
```

### InstanceOptions

Configuration options for creating an instance.

| Property | Type | Description |
|----------|------|-------------|
| `apiKey` | `string` | Your API key |
| `environment` | `'development' \| 'production'` | Environment |
| `timeout` | `number` | Request timeout in milliseconds |
```

### Guide Documentation

```markdown
# Getting Started

This guide will help you get up and running with Your Package.

## Prerequisites

Before you begin, make sure you have:

- Node.js 16 or higher
- An API key from [your dashboard](https://yourapp.com/dashboard)
- A code editor (we recommend VS Code)

## Installation

Install the package using npm:

```bash
npm install your-package
```

Or using yarn:

```bash
yarn add your-package
```

## Configuration

Create a configuration file:

```typescript
// config/your-package.ts
export const config = {
  apiKey: process.env.YOUR_API_KEY,
  environment: process.env.NODE_ENV || 'development',
  timeout: 5000
};
```

## First Steps

Now you can use the package:

```typescript
import { YourPackage } from 'your-package';
import { config } from './config/your-package';

const instance = new YourPackage(config);
await instance.initialize();
```

## Next Steps

- [Learn about advanced configuration](#configuration)
- [View API reference](../api/overview.md)
- [Check out examples](#examples)
```

## Deployment

### Static Site Hosting

```bash
# Build the documentation
npm run docs:build

# Deploy to any static hosting service
# The built files are in .vitepress/dist
```

### Popular Hosting Options

1. **Vercel** - Recommended for VitePress
2. **Netlify** - Easy deployment with Git integration
3. **GitHub Pages** - Free hosting for public repositories
4. **Cloudflare Pages** - Fast global CDN

### GitHub Actions

Create `.github/workflows/docs.yml`:

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths: ['docs/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run docs:build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vitepress/dist
```

## Troubleshooting

### Common Issues

#### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules .vitepress/dist
npm install
npm run docs:build
```

#### Search Not Working

Ensure your `.vitepress/config.ts` includes:

```typescript
search: {
  provider: 'local'
}
```

#### Navigation Not Showing

Check your sidebar configuration and ensure file paths are correct.

### Getting Help

- [VitePress Documentation](https://vitepress.dev/)
- [GitHub Discussions](https://github.com/yourusername/yourproject/discussions)
- [Issue Tracker](https://github.com/yourusername/yourproject/issues)

## Contributing to Documentation

We welcome contributions to the documentation! Here's how to get started:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the documentation locally
5. Submit a pull request

### Documentation Guidelines

- Use clear, concise language
- Include code examples for all APIs
- Test all code examples
- Follow the established style guide
- Update the table of contents when adding new sections

### Local Development

```bash
# Clone your fork
git clone https://github.com/yourusername/yourproject.git
cd yourproject

# Install dependencies
npm install

# Start documentation server
npm run docs:dev
```

Visit `http://localhost:5173` to see your changes.
