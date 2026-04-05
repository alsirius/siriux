---
layout: home
hero:
  name: "Siriux"
  text: "Modern SaaS Platform Toolkit"
  tagline: "Build scalable SaaS applications with reusable packages and best practices"
  image:
    src: /logo.svg
    alt: Siriux
  actions:
    - theme: brand
      text: Get Started
      link: /guides/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/jawwadbukhari/siriux
    - theme: alt
      text: API Reference
      link: /api/overview

features:
  - icon: 🛡️
    title: Authentication
    details: JWT-based authentication middleware with role-based access control, session management, and security best practices.
    link: /packages/auth
  - icon: 🎨
    title: UI Components
    details: Modern React components with authentication context, forms, and layouts built for SaaS applications.
    link: /packages/ui
  - icon: 🏗️
    title: Core Contracts
    details: TypeScript interfaces and contracts that provide a stable foundation for all Siriux packages.
    link: /packages/core
  - icon: 📦
    title: Modular Architecture
    details: Pick and choose packages you need. No monolithic dependencies, independent versioning, and focused scope.
    link: /guides/getting-started
  - icon: 🚀
    title: Developer Experience
    details: TypeScript-first, comprehensive documentation, and seamless integration with popular frameworks.
    link: /guides/quick-start
  - icon: 🔧
    title: Extensible
    details: Plugin system, lifecycle hooks, and dependency injection for maximum flexibility.
    link: /api/overview

---

## 🚀 Quick Start

### **Build Your AI-Powered SaaS**

```bash
# Clone and start in minutes
git clone https://github.com/jawwadbukhari/siriux.git
cd siriux-monorepo
npm install
npm run dev:all

# Open your browser
http://localhost:3000  # AI-Powered SaaS App
http://localhost:5173  # Documentation
```

### **Choose Your Database**

```bash
# Zero setup - works immediately
MOCK_DB_TYPE=in-memory

# Real Snowflake (optional)
MOCK_DB_TYPE=snowflake-real
SNOWFLAKE_ACCOUNT=your-account.snowflakecomputing.com
```

### **Demo Credentials**

| Role | Email | Password |
|-------|--------|----------|
| Admin | admin@siriux.dev | admin123 |
| User | user@siriux.dev | user123 |
| Manager | manager@siriux.dev | manager123 |

---

## 🎯 What's Inside

### **📚 Documentation**

- **[Getting Started](guides/getting-started.md)** - Complete setup guide
- **[AI-Powered SaaS](guides/ai-powered-saas.md)** - Build with Snowflake & AI
- **[API Reference](api/overview.md)** - Technical documentation
- **[Package Guides](packages/overview.md)** - Individual package docs

### **�️ Packages**

| Package | Description | Status |
|---------|-------------|--------|
| **[@siriux/core](packages/core.md)** | Core utilities & database | ✅ Production Ready |
| **[@siriux/auth](packages/auth.md)** | Authentication & security | ✅ Production Ready |
| **[@siriux/ui](packages/ui.md)** | React components | ✅ Production Ready |
| **[@siriux/access-control](packages/access-control.md)** | RBAC & permissions | ✅ Production Ready |
| **[@siriux/logging](packages/logging.md)** | Multi-output logging | ✅ Production Ready |
| **[@siriux/config](packages/config.md)** | Configuration management | ✅ Production Ready |

### **🔧 Tools**

- **[CLI Tool](tools/cli.md)** - Command-line interface
- **[Starter Kit](tools/starter-kit.md)** - Next.js SaaS template

---

## 🌟 Features

### **� Zero-Setup Development**
- **Mock Authentication**: Works without backend
- **Multi-Database Support**: In-memory, SQLite, Snowflake
- **Hot Reload**: Instant development feedback
- **TypeScript**: Full type safety

### **❄️ Enterprise Snowflake**
- **Real Connection**: Production Snowflake integration
- **Auto-Schema**: Automatic table creation
- **Analytics**: SQL queries and insights
- **Audit Trail**: Complete logging

### **🤖 AI-Ready Architecture**
- **Data Insights**: AI-powered analytics
- **ML Integration**: Machine learning ready
- **Smart Features**: Automation capabilities
- **Scalable Design**: Enterprise architecture

### **🎨 Modern UI/UX**
- **Beautiful Components**: Professional design
- **Responsive**: Mobile-first approach
- **Accessible**: WCAG compliant
- **Customizable**: Easy theming

---

## 🎯 Use Cases

### **🚀 MVP Development**
Build your minimum viable product in days, not months.

```typescript
// Works immediately with mock data
import { createSmartAuthConfig } from '@siriux/auth';
import { createMockLogger } from '@siriux/logging';

const auth = createSmartAuthConfig();
const logger = createMockLogger();
```

### **🏢 Enterprise Sales**
Impressive demos with real Snowflake data warehousing.

```typescript
// Real-time enterprise analytics
const analytics = await snowflake.execute(`
  SELECT * FROM SALES_DATA 
  WHERE DATE >= CURRENT_DATE() - 30
`);
```

### **🤖 AI Integration**
Add machine learning capabilities without ML expertise.

```typescript
// AI-powered insights
const insights = await ai.analyzeUserBehavior(userData);
const recommendations = await ai.generateRecommendations(userHistory);
```

---

## 🚀 Getting Started

### **1. Explore the Demo**

```bash
# Start the platform
npm run dev:all

# Try the features
http://localhost:3000/demo          # Authentication demo
http://localhost:3000/database-demo # Database showcase
```

### **2. Choose Your Path**

**For Development:**
```bash
# Zero setup required
MOCK_DB_TYPE=in-memory
npm run dev:all
```

**For Production:**
```bash
# Add your Snowflake credentials
MOCK_DB_TYPE=snowflake-real
# Add .env configuration
npm run build
npm run start
```

### **3. Customize Your App**

```typescript
// apps/starter-next-saas/config/app-config.ts
export const defaultConfig = {
  app: {
    name: "Your AI-Powered SaaS",
    tagline: "Your Unique Value Proposition",
    snowflake: {
      warehouse: "YOUR_WAREHOUSE",
      schema: "YOUR_SCHEMA"
    }
  }
};
```

---

## 📊 What You Get

### **Complete SaaS Platform**
- ✅ **Authentication**: JWT with role-based access
- ✅ **User Management**: Multi-role user system
- ✅ **Data Analytics**: Real-time insights
- ✅ **AI Integration**: Machine learning ready
- ✅ **Modern UI**: Beautiful, responsive design

### **Enterprise Features**
- ✅ **Snowflake Integration**: Real data warehousing
- ✅ **Audit Logging**: Complete activity tracking
- ✅ **Security**: Enterprise-grade security
- ✅ **Scalability**: Production-ready architecture
- ✅ **Compliance**: GDPR and SOC2 ready

### **Developer Experience**
- ✅ **TypeScript**: Full type safety
- ✅ **Hot Reload**: Instant feedback
- ✅ **Documentation**: Comprehensive guides
- ✅ **Testing**: Complete test suite
- ✅ **Deployment**: Easy deployment

---

## 🎯 Next Steps

1. **📖 Read the [Getting Started Guide](guides/getting-started.md)**
2. **🚀 Try the [AI-Powered SaaS Guide](guides/ai-powered-saas.md)**
3. **🛠️ Explore [Package Documentation](packages/overview.md)**
4. **🔧 Check out [CLI Tools](tools/cli.md)**
5. **🎨 Customize the [Starter Kit](tools/starter-kit.md)**

---

## 🤝 Community

- **🐛 [Report Issues](https://github.com/jawwadbukhari/siriux/issues)**
- **💬 [Discussions](https://github.com/jawwadbukhari/siriux/discussions)**
- **📧 [Email Support](mailto:support@siriux.dev)**
- **🐦 [Twitter](https://twitter.com/siriux)**

---

## 🎉 Start Building Today!

With **Siriux AI-Powered SaaS**, you can:

- ✅ **Build MVPs in days, not months**
- ✅ **Leverage enterprise Snowflake data**
- ✅ **Add AI capabilities without ML expertise**
- ✅ **Deploy to production with confidence**
- ✅ **Scale to millions of users**

**Ready to start?** `git clone https://github.com/jawwadbukhari/siriux.git` 🚀
