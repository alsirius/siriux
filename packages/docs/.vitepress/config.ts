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

    sidebar: {
      '/packages/': [
        {
          text: 'Overview',
          items: [
            { text: 'All Packages', link: '/packages/overview' },
            { text: 'Core', link: '/packages/core' },
            { text: 'Auth', link: '/packages/auth' },
            { text: 'Access Control', link: '/packages/access-control' },
            { text: 'Config', link: '/packages/config' },
            { text: 'Logging', link: '/packages/logging' },
            { text: '@siriux/docs', link: '/packages/docs' }
          ]
        }
      ],
      '/guides/': [
        {
          text: 'Guides',
          items: [
            { text: 'Getting Started', link: '/guides/getting-started' },
            { text: 'AI-Powered SaaS', link: '/guides/ai-powered-saas' }
          ]
        }
      ],
      '/tools/': [
        {
          text: 'Tools',
          items: [
            { text: 'CLI Tool', link: '/tools/cli' },
            { text: 'Starter Kit', link: '/tools/starter-kit' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jawwadbukhari/siriux' }
    ],

    search: {
      provider: 'local'
    }
  }
})
