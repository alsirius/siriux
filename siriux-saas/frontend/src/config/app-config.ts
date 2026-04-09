export const appConfig = {
  name: "Siriux SaaS Platform",
  tagline: "Modern SaaS Development Toolkit",
  description: "Build scalable SaaS applications with enterprise-grade architecture and modern UI components.",
  version: "1.0.0",
  
  menu: {
    brand: "Siriux",
    links: [
      { label: "Features", href: "#features" },
      { label: "Documentation", href: "/docs" },
      { label: "Pricing", href: "#pricing" },
      { label: "About", href: "#about" },
    ],
    auth: {
      signIn: { label: "Sign In", href: "/login" },
      signUp: { label: "Sign Up", href: "/register" },
    },
    authenticated: {
      dashboard: { label: "Dashboard", href: "/dashboard" },
      profile: { label: "Profile", href: "/profile" },
      admin: { label: "Admin", href: "/admin" },
    },
  },

  hero: {
    title: "Build Modern SaaS Applications",
    subtitle: "Enterprise-grade architecture with beautiful UI components. Start building in minutes, not months.",
    cta: {
      primary: { label: "Get Started", href: "/register" },
      secondary: { label: "View Documentation", href: "/docs" },
    },
  },

  features: [
    {
      title: "Enterprise Architecture",
      description: "N-tier architecture with proper separation of concerns. Scalable and maintainable codebase.",
      icon: "🏗️",
    },
    {
      title: "Modern UI Components",
      description: "Beautiful, accessible components built with Tailwind CSS and React. Fully customizable.",
      icon: "🎨",
    },
    {
      title: "Authentication Ready",
      description: "Built-in authentication with JWT, TOTP support, and role-based access control.",
      icon: "🔐",
    },
    {
      title: "Admin Dashboard",
      description: "Complete admin panel for user management, roles, and permissions.",
      icon: "⚙️",
    },
  ],

  docs: {
    url: "http://localhost:3001",
    enabled: true,
  },
};
