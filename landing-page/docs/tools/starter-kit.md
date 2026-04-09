# Starter Kit

Dynamic MVP application that can be customized in minutes.

## Overview

The Siriux Starter Kit is a complete, production-ready SaaS application that can be customized by simply updating configuration files. No coding required!

## Features

- 🎨 **Dynamic Configuration** - Update colors, text, features in one file
- 🚀 **MVP Ready** - Launch your SaaS in minutes
- 📱 **Responsive Design** - Works perfectly on all devices
- 🌙 **Dark Mode** - Built-in theme switching
- 🔐 **Authentication** - Complete user management
- 📊 **Analytics Ready** - Easy analytics integration
- ♿ **Accessible** - WCAG compliant
- 🛠️ **Developer Friendly** - Clean, maintainable code

## Quick Start

### 1. Create Project

```bash
npm create siriux-app@latest my-saas --template saas
cd my-saas
```

### 2. Customize Configuration

Edit `config/app-config.ts`:

```typescript
export const appConfig = {
  app: {
    name: "Your SaaS",
    tagline: "Your tagline",
    description: "What your app does"
  },
  // ... more customization
};
```

### 3. Add Your Assets

Place your images in `public/images/`:
- `logo.png` - Your app logo
- `favicon.ico` - Favicon icon
- `hero-bg.jpg` - Hero background

### 4. Launch Your App

```bash
npm run dev
```

Visit `http://localhost:3000` to see your customized SaaS!

## Configuration Guide

### App Identity

```typescript
app: {
  name: "Your SaaS",
  tagline: "Build Your MVP Fast",
  description: "A modern SaaS application built with Siriux",
  url: "https://yourapp.com",
  logo: "/images/logo.png",
  favicon: "/images/favicon.ico"
}
```

### Theme Customization

```typescript
theme: {
  primaryColor: "#3B82F6",    // Change primary color
  secondaryColor: "#10B981",  // Change secondary color
  accentColor: "#F59E0B",     // Change accent color
  darkMode: true              // Enable dark mode
}
```

### Feature Toggles

```typescript
features: {
  authentication: true,    // Enable login/register
  userManagement: true,     // User profiles and admin
  analytics: true,         // Analytics dashboard
  blog: true,             // Blog system
  marketplace: false,      // Marketplace features
  forums: false,           // Community forums
  events: false,           // Events management
  newsletter: true        // Newsletter system
}
```

### Contact Information

```typescript
contact: {
  email: "contact@yourapp.com",
  phone: "+1 (555) 123-4567",
  address: "123 Business Ave, Suite 100, San Francisco, CA 94102",
  social: {
    twitter: "https://twitter.com/yourapp",
    linkedin: "https://linkedin.com/company/yourapp",
    github: "https://github.com/yourapp",
    facebook: "https://facebook.com/yourapp",
    instagram: "https://instagram.com/yourapp"
  }
}
```

## Content Management

### Hero Section

```typescript
content: {
  hero: {
    title: "Build Your SaaS MVP Fast",
    subtitle: "Launch your next big idea with our comprehensive starter kit",
    description: "Everything you need to build, launch, and scale your SaaS application.",
    ctaText: "Get Started Free",
    ctaLink: "/register"
  }
}
```

### Services Section

```typescript
services: {
  title: "Everything You Need",
  subtitle: "Comprehensive features to power your SaaS application",
  items: [
    {
      title: "Authentication",
      description: "Secure user authentication with JWT tokens",
      icon: "shield",
      features: ["JWT Authentication", "Role Management", "Social Login"]
    },
    {
      title: "User Management",
      description: "Complete user management system",
      icon: "users",
      features: ["User Profiles", "Permission System", "User Analytics"]
    }
  ]
}
```

### Pricing Plans

```typescript
pricing: {
  title: "Simple, Transparent Pricing",
  subtitle: "Choose the plan that fits your needs",
  plans: [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      features: [
        "Up to 100 users",
        "Basic analytics",
        "Email support",
        "Core features"
      ],
      cta: "Get Started"
    },
    {
      name: "Pro",
      price: "$49",
      period: "per month",
      features: [
        "Unlimited users",
        "Advanced analytics",
        "Priority support",
        "API access"
      ],
      highlighted: true,
      cta: "Start Free Trial"
    }
  ]
}
```

### Testimonials

```typescript
testimonials: {
  title: "Loved by Developers",
  subtitle: "See what our users are saying",
  items: [
    {
      name: "Sarah Johnson",
      role: "CTO",
      company: "TechStart Inc.",
      content: "Siriux SaaS helped us launch our MVP in just 2 weeks.",
      avatar: "/images/testimonials/sarah.jpg",
      rating: 5
    }
  ]
}
```

### FAQ Section

```typescript
faq: {
  title: "Frequently Asked Questions",
  subtitle: "Everything you need to know",
  items: [
    {
      question: "How quickly can I launch my MVP?",
      answer: "With Siriux SaaS, you can launch in under 30 minutes."
    },
    {
      question: "Can I customize the design?",
      answer: "Absolutely! You can modify colors, layouts, and features."
    }
  ]
}
```

## Customization Examples

### Change Colors

```typescript
theme: {
  primaryColor: "#FF6B6B",    // Red theme
  secondaryColor: "#4ECDC4",  // Teal accents
  accentColor: "#FFD93D"      // Yellow highlights
}
```

### Update Hero Section

```typescript
content: {
  hero: {
    title: "Launch Your Dream App",
    subtitle: "No code required",
    description: "Build your SaaS in minutes, not months.",
    ctaText: "Start Free Trial",
    ctaLink: "/register"
  }
}
```

### Add New Service

```typescript
services: {
  items: [
    // ... existing services
    {
      title: "AI Integration",
      description: "Powerful AI features for your app",
      icon: "brain",
      features: ["Chat GPT", "Image Generation", "Text Analysis"]
    }
  ]
}
```

### Enable Features

```typescript
features: {
  authentication: true,
  userManagement: true,
  analytics: true,
  blog: true,
  marketplace: true,    // Enable marketplace
  forums: true,         // Enable forums
  events: true,         // Enable events
  newsletter: true
}
```

## Project Structure

```
my-saas/
├── config/
│   └── app-config.ts          # 🎨 Main configuration file
├── public/
│   └── images/                # 📸 Your images and assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── (auth)/            # Auth routes
│   │   └── (dashboard)/       # Dashboard routes
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   ├── layout/           # Layout components
│   │   └── auth/             # Auth components
│   ├── lib/                   # Utilities and helpers
│   └── styles/                # CSS and styling
├── package.json
├── README.md
└── .env.local                 # Environment variables
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Build
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

### Docker

```bash
# Build Docker image
docker build -t siriux-saas .

# Run container
docker run -p 3000:3000 siriux-saas
```

### Environment Variables

Create `.env.local` for production:

```bash
NEXT_PUBLIC_APP_URL=https://yourapp.com
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
```

## Advanced Customization

### Custom Components

Create custom components in `src/components/`:

```typescript
// src/components/CustomFeature.tsx
import React from 'react';
import { appConfig } from '../../config/app-config';

export const CustomFeature: React.FC = () => {
  return (
    <div className="custom-feature">
      <h2>{appConfig.app.name} Special Feature</h2>
      <p>{appConfig.app.description}</p>
    </div>
  );
};
```

### Custom Pages

Add new pages in `src/app/`:

```typescript
// src/app/features/page.tsx
import React from 'react';
import { appConfig } from '../../config/app-config';

export default function FeaturesPage() {
  return (
    <div>
      <h1>Features of {appConfig.app.name}</h1>
      {/* Custom content */}
    </div>
  );
}
```

### Custom Styles

Update `src/styles/globals.css`:

```css
:root {
  --primary-color: {{appConfig.theme.primaryColor}};
  --secondary-color: {{appConfig.theme.secondaryColor}};
}

/* Custom styles */
.custom-button {
  background-color: var(--primary-color);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
}
```

## Best Practices

### 1. Keep Configuration Clean

```typescript
// Good: Clear, descriptive configuration
app: {
  name: "My SaaS",
  tagline: "Making businesses better",
  description: "Complete SaaS platform for modern businesses"
}

// Avoid: Unclear or generic values
app: {
  name: "App",
  tagline: "Welcome",
  description: "An app"
}
```

### 2. Use Semantic Versioning

```typescript
// Update version when making changes
app: {
  version: "1.0.0"
}
```

### 3. Test All Features

```typescript
// Enable features one by one and test
features: {
  authentication: true,    // Test first
  userManagement: false,   // Enable later
  analytics: false        // Enable last
}
```

### 4. Optimize Images

```bash
# Compress images before adding
# Use WebP format for better compression
# Keep images under 100KB
```

### 5. Use Environment Variables

```typescript
// Use environment variables for sensitive data
app: {
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}
```

## Examples

### E-commerce Platform

```typescript
export const ecommerceConfig = {
  app: {
    name: "ShopHub",
    tagline: "Your E-commerce Solution",
    description: "Complete e-commerce platform for online stores"
  },
  features: {
    authentication: true,
    userManagement: true,
    marketplace: true,
    payments: true,
    analytics: true,
    blog: false,
    forums: false
  },
  content: {
    hero: {
      title: "Launch Your Online Store",
      subtitle: "Complete e-commerce platform",
      description: "Everything you need to sell online"
    }
  }
};
```

### Education Platform

```typescript
export const educationConfig = {
  app: {
    name: "EduLearn",
    tagline: "Education Made Simple",
    description: "Comprehensive learning management system"
  },
  features: {
    authentication: true,
    userManagement: true,
    analytics: true,
    blog: true,
    forums: true,
    events: true,
    marketplace: false,
    payments: true
  },
  theme: {
    primaryColor: "#6366F1",  // Purple theme
    secondaryColor: "#10B981", // Green accents
    darkMode: true
  }
};
```

### Healthcare Platform

```typescript
export const healthcareConfig = {
  app: {
    name: "HealthCare+",
    tagline: "Healthcare Management",
    description: "Complete healthcare management platform"
  },
  features: {
    authentication: true,
    userManagement: true,
    analytics: true,
    notifications: true,
    auditLogging: true,
    multiTenant: true
  },
  content: {
    hero: {
      title: "Modern Healthcare Management",
      subtitle: "Complete platform for healthcare providers",
      description: "Patient management, scheduling, and billing"
    }
  }
};
```

## Troubleshooting

### Common Issues

#### Configuration Not Updating

```bash
# Restart development server
npm run dev
```

#### Images Not Loading

```bash
# Check image paths
# Ensure images are in public/images/
# Use correct file extensions
```

#### Styles Not Applying

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

#### Build Errors

```bash
# Check TypeScript configuration
npm run type-check
# Fix any TypeScript errors
```

### Getting Help

- [Documentation](https://docs.siriux.dev)
- [GitHub Issues](https://github.com/siriux/starter-kit/issues)
- [Discord Community](https://discord.gg/siriux)

## Contributing

We welcome contributions to improve the starter kit!

### Development Setup

```bash
# Clone repository
git clone https://github.com/siriux/starter-kit.git
cd starter-kit

# Install dependencies
npm install

# Run development server
npm run dev
```

### Submitting Changes

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## Roadmap

### Version 1.1
- [ ] More templates (e-commerce, education, healthcare)
- [ ] Advanced customization options
- [ ] Plugin system
- [ ] Internationalization support

### Version 1.2
- [ ] Multi-tenant support
- [ ] Advanced analytics
- [ ] Email templates
- [] Social login integration

### Version 2.0
- [ ] AI-powered customization
- [ ] Visual configuration editor
- [ ] Template marketplace
- [] Enterprise features

## License

MIT License - see [https://github.com/jawwadbukhari/siriux/blob/main/LICENSE](https://github.com/jawwadbukhari/siriux/blob/main/LICENSE) file for details.

---

**Built with ❤️ using [Siriux](https://siriux.dev) - The Modern SaaS Platform Toolkit**
