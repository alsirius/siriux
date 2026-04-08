# 🚀 Siriux SaaS Starter Kit

A comprehensive, dynamic MVP starter kit built with Siriux components. Launch your SaaS application in minutes by simply updating the configuration file!

## ✨ Features

- 🎨 **Dynamic Configuration** - Update colors, text, and features in one file
- 🔐 **Authentication** - Built-in user authentication and authorization
- 👥 **User Management** - Complete user profile and permission system
- 📊 **Analytics** - Real-time user analytics and reporting
- 📝 **Blog System** - Built-in blog with SEO optimization
- 🎯 **MVP Ready** - Everything you need to launch fast
- 📱 **Responsive Design** - Mobile-first, modern UI
- 🌙 **Dark Mode** - Built-in theme switching
- ♿ **Accessible** - WCAG compliant components

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/siriux-starter-saas
cd siriux-starter-saas
npm install
```

### 2. Configure Your App

Edit `config/app-config.ts` to customize:

- **App Identity**: Name, logo, description
- **Content**: Hero section, about, services, pricing
- **Theme**: Colors, fonts, styling
- **Features**: Enable/disable modules
- **Contact**: Email, social links, address

### 3. Add Your Assets

Place your images in the `public/images/` folder:
- Logo: `public/images/logo.png`
- Favicon: `public/images/favicon.ico`
- Hero background: `public/images/hero-bg.jpg`

### 4. Launch Your MVP

```bash
npm run dev
```

Visit `http://localhost:3000` to see your customized SaaS application!

## 📁 Project Structure

```
starter-next-saas/
├── config/
│   └── app-config.ts          # 🎨 Main configuration file
├── public/
│   └── images/                # 📸 Your images and assets
├── src/
│   ├── app/                   # Next.js App Router
│   ├── components/            # React components
│   ├── lib/                   # Utilities and helpers
│   └── styles/                # CSS and styling
├── package.json
└── README.md
```

## ⚙️ Configuration Guide

### App Identity
```typescript
app: {
  name: "Your SaaS",
  tagline: "Your tagline",
  description: "What your app does",
  url: "https://yourapp.com",
  logo: "/images/logo.png",
  favicon: "/images/favicon.ico"
}
```

### Theme Customization
```typescript
theme: {
  primaryColor: "#3B82F6",
  secondaryColor: "#10B981",
  accentColor: "#F59E0B",
  darkMode: true
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

### Content Management
All your website content is managed in the configuration:

- **Hero Section**: Landing page hero with title, subtitle, CTA
- **About**: Mission, vision, company values
- **Services**: Feature descriptions and benefits
- **Pricing**: Subscription plans and features
- **Testimonials**: Customer reviews and ratings
- **FAQ**: Frequently asked questions

## 🎨 Customization Examples

### Change Colors
```typescript
theme: {
  primaryColor: "#FF6B6B",    // Change to red
  secondaryColor: "#4ECDC4",  // Change to teal
  accentColor: "#FFD93D"      // Change to yellow
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

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=.next
```

### Docker
```bash
docker build -t siriux-saas .
docker run -p 3000:3000 siriux-saas
```

## 📚 Siriux Packages Used

This starter kit is built with the following Siriux packages:

- **@siriux/core** - Type contracts and interfaces
- **@siriux/auth** - Authentication middleware
- **@siriux/ui** - React UI components
- **@siriux/access-control** - Role-based permissions
- **@siriux/logging** - Structured logging
- **@siriux/config** - Configuration management

## 🛠️ Development

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Type checking
```

### Environment Variables
Create `.env.local`:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

## 🎯 MVP Launch Checklist

- [ ] Update `config/app-config.ts` with your details
- [ ] Add your logo and images to `public/images/`
- [ ] Set up environment variables
- [ ] Test authentication flow
- [ ] Verify all pages work correctly
- [ ] Check mobile responsiveness
- [ ] Test dark mode functionality
- [ ] Configure analytics if enabled
- [ ] Set up custom domain
- [ ] Deploy to production

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](https://docs.siriux.dev)
- 🐛 [Report Issues](https://github.com/yourusername/siriux-starter-saas/issues)
- 💬 [Discord Community](https://discord.gg/siriux)
- 📧 [Email Support](mailto:support@siriux.dev)

---

**Built with ❤️ using [Siriux](https://siriux.dev) - The Modern SaaS Platform Toolkit**
