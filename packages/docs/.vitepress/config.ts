import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Siriux Documentation',
  description: 'Complete guides and API documentation for the Siriux platform',
  
  vite: {
    build: {
      minify: false,
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning.code === 'EVAL') return;
          warn(warning);
        }
      }
    }
  },
  
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/guides/getting-started' },
      { text: 'Packages', link: '/packages/overview' }
    ],

    sidebar: [
      {
        text: 'Guides',
        items: [
          { text: 'Getting Started', link: '/guides/getting-started' },
          { text: 'AI-Powered SaaS', link: '/guides/ai-powered-saas' }
        ]
      },
      {
        text: 'Packages',
        items: [
          { text: 'Overview', link: '/packages/overview' },
          { text: '@siriux/core', link: '/packages/core' },
          { text: '@siriux/auth', link: '/packages/auth' },
          { text: '@siriux/ui', link: '/packages/ui' },
          { text: '@siriux/access-control', link: '/packages/access-control' },
          { text: '@siriux/logging', link: '/packages/logging' },
          { text: '@siriux/config', link: '/packages/config' },
          { text: '@siriux/docs', link: '/packages/docs' }
        ]
      },
      {
        text: 'Tools',
        items: [
          { text: 'CLI Tool', link: '/tools/cli' },
          { text: 'Starter Kit', link: '/tools/starter-kit' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jawwadbukhari/siriux' }
    ],

    search: {
      provider: 'local'
    }
  }
})
