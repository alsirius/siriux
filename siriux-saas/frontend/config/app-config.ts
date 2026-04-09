// Dynamic App Configuration
// Update these values to customize your MVP application

export interface AppConfig {
  //### App Identity
  app: {
    name: string;
    tagline: string;
    description: string;
    url: string;
    logo: string;
    favicon: string;
    docsUrl?: string; // Custom documentation URL
    snowflake?: {
      account?: string;
      username?: string;
      password?: string;
      warehouse?: string;
      schema?: string;
      database?: string;
      role?: string;
    };
  };

  // Contact Information
  contact: {
    email: string;
    phone: string;
    address: string;
    social: {
      twitter?: string;
      linkedin?: string;
      github?: string;
      facebook?: string;
      instagram?: string;
    };
  };

  // Features
  features: {
    authentication: boolean;
    userManagement: boolean;
    analytics: boolean;
    blog: boolean;
    marketplace: boolean;
    forums: boolean;
    events: boolean;
    newsletter: boolean;
  };

  // Theme
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkMode: boolean;
    customCSS?: string;
  };

  // Content
  content: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
      backgroundImage?: string;
      ctaText: string;
      ctaLink: string;
    };
    about: {
      title: string;
      description: string;
      mission: string;
      vision: string;
      values: string[];
    };
    services: {
      title: string;
      subtitle: string;
      items: Array<{
        title: string;
        description: string;
        icon: string;
        features: string[];
      }>;
    };
    pricing: {
      title: string;
      subtitle: string;
      plans: Array<{
        name: string;
        price: string;
        period: string;
        features: string[];
        highlighted?: boolean;
        cta: string;
      }>;
    };
    testimonials: {
      title: string;
      subtitle: string;
      items: Array<{
        name: string;
        role: string;
        company: string;
        content: string;
        avatar: string;
        rating: number;
      }>;
    };
    faq: {
      title: string;
      subtitle: string;
      items: Array<{
        question: string;
        answer: string;
      }>;
    };
  };

  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    twitterCard: string;
  };

  // Legal
  legal: {
    privacyPolicy: string;
    termsOfService: string;
    cookiePolicy: string;
    copyright: string;
  };
}

// Default Configuration - Customize these values
export const defaultConfig: AppConfig = {
  app: {
    name: "Siriux AI-Powered SaaS",
    tagline: "Build Your MVP with Snowflake Data and AI",
    description: "A modern SaaS platform built with Siriux components, Snowflake data warehousing, and AI capabilities.",
    url: "https://yourapp.com",
    logo: "/images/logo.png",
    favicon: "/images/favicon.ico",
    docsUrl: "http://localhost:5173",
    snowflake: {
      account: process.env.SNOWFLAKE_ACCOUNT || 'your-account',
      username: process.env.SNOWFLAKE_USERNAME || 'your-username',
      password: process.env.SNOWFLAKE_PASSWORD || 'your-password',
      warehouse: process.env.SNOWFLAKE_WAREHOUSE || 'DEMO_WAREHOUSE',
      schema: process.env.SNOWFLAKE_SCHEMA || 'SIRIUX_DEMO',
      database: process.env.SNOWFLAKE_DATABASE || 'SIRIUX_DEMO',
      role: process.env.SNOWFLAKE_ROLE || 'ACCOUNTADMIN'
    }
  },

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
  },

  features: {
    authentication: true,
    userManagement: true,
    analytics: true,
    blog: true,
    marketplace: true,
    forums: true,
    events: true,
    newsletter: true
  },

  theme: {
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    accentColor: "#F59E0B",
    darkMode: true
  },

  content: {
    hero: {
      title: "Build Your SaaS MVP Fast",
      subtitle: "Launch your next big idea with our comprehensive starter kit",
      description: "Everything you need to build, launch, and scale your SaaS application. From authentication to analytics, we've got you covered.",
      ctaText: "Try Demo",
      ctaLink: "/register"
    },
    about: {
      title: "About Siriux SaaS",
      description: "We provide developers with the tools they need to build successful SaaS applications quickly and efficiently.",
      mission: "To democratize SaaS development by providing accessible, powerful, and customizable tools.",
      vision: "A world where every great idea can become a successful SaaS product without technical barriers.",
      values: [
        "Simplicity",
        "Performance",
        "Security",
        "Scalability",
        "Developer Experience"
      ]
    },
    services: {
      title: "Everything You Need",
      subtitle: "Comprehensive features to power your SaaS application",
      items: [
        {
          title: "Authentication",
          description: "Secure user authentication with JWT tokens and role-based access control.",
          icon: "shield",
          features: ["JWT Authentication", "Role Management", "Social Login", "2FA Support"]
        },
        {
          title: "User Management",
          description: "Complete user management system with profiles and permissions.",
          icon: "users",
          features: ["User Profiles", "Permission System", "User Analytics", "Bulk Operations"]
        },
        {
          title: "Analytics",
          description: "Comprehensive analytics to understand your users and grow your business.",
          icon: "chart-bar",
          features: ["Real-time Metrics", "User Behavior", "Conversion Tracking", "Custom Reports"]
        },
        {
          title: "Blog System",
          description: "Built-in blog system to drive traffic and engage your audience.",
          icon: "file-text",
          features: ["Rich Editor", "SEO Optimization", "Comments", "Social Sharing"]
        }
      ]
    },
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
            "API access",
            "Custom integrations"
          ],
          highlighted: true,
          cta: "Start Free Trial"
        },
        {
          name: "Enterprise",
          price: "Custom",
          period: "contact us",
          features: [
            "Everything in Pro",
            "Dedicated support",
            "Custom features",
            "SLA guarantee",
            "On-premise option"
          ],
          cta: "Contact Sales"
        }
      ]
    },
    testimonials: {
      title: "Loved by Developers",
      subtitle: "See what our users are saying about Siriux SaaS",
      items: [
        {
          name: "Sarah Johnson",
          role: "CTO",
          company: "TechStart Inc.",
          content: "Siriux SaaS helped us launch our MVP in just 2 weeks instead of 2 months. The authentication and user management features saved us countless hours.",
          avatar: "/images/testimonials/sarah.jpg",
          rating: 5
        },
        {
          name: "Michael Chen",
          role: "Founder",
          company: "DataFlow Analytics",
          content: "The built-in analytics and reporting features are incredible. We got insights into our user behavior from day one.",
          avatar: "/images/testimonials/michael.jpg",
          rating: 5
        },
        {
          name: "Emily Rodriguez",
          role: "Product Manager",
          company: "CloudSync Solutions",
          content: "The customization options are amazing. We were able to tailor everything to match our brand and specific needs.",
          avatar: "/images/testimonials/emily.jpg",
          rating: 5
        }
      ]
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about Siriux SaaS",
      items: [
        {
          question: "How quickly can I launch my MVP?",
          answer: "With Siriux SaaS, you can launch a fully functional MVP in under 30 minutes. Just update the configuration file and you're ready to go!"
        },
        {
          question: "Can I customize the design and features?",
          answer: "Absolutely! Siriux SaaS is built for customization. You can modify colors, layouts, features, and even add custom components."
        },
        {
          question: "What's included in the starter kit?",
          answer: "The starter kit includes authentication, user management, analytics, blog system, UI components, and everything else you need for a SaaS application."
        },
        {
          question: "Do I need technical skills to use Siriux SaaS?",
          answer: "Basic technical skills are helpful, but we provide comprehensive documentation and support to help you get started."
        },
        {
          question: "Can I use Siriux SaaS for commercial projects?",
          answer: "Yes! Siriux SaaS is designed for commercial use and comes with a flexible license for your business needs."
        }
      ]
    }
  },

  seo: {
    title: "Siriux SaaS - Build Your MVP in Minutes",
    description: "Launch your SaaS application fast with our comprehensive starter kit. Authentication, user management, analytics, and more.",
    keywords: ["SaaS", "MVP", "starter kit", "authentication", "user management", "analytics"],
    ogImage: "/images/og-image.png",
    twitterCard: "summary_large_image"
  },

  legal: {
    privacyPolicy: "https://yourapp.com/privacy",
    termsOfService: "https://yourapp.com/terms",
    cookiePolicy: "https://yourapp.com/cookies",
    copyright: `© ${new Date().getFullYear()} Siriux SaaS. All rights reserved.`
  }
};

// Export configuration for use in components
export const appConfig = defaultConfig;
