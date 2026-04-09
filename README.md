# Siriux Dual-Repo Structure

This repository contains two main projects organized as separate repositories for better maintainability:

- **siriux-saas**: Production-ready SaaS application with backend and frontend
- **landing-page**: Documentation and landing page for the Siriux platform

## 📁 Repository Structure

```
siriux-monorepo/
├── siriux-saas/              # Main SaaS application
│   ├── backend/              # Node.js/Express backend
│   ├── frontend/             # Next.js React frontend
│   └── README.md
├── landing-page/             # Documentation and landing page
│   ├── docs/                 # Documentation content
│   └── README.md
├── .windsurf/                # AI assistant configuration
│   └── rules.md             # AI rules and guidelines
├── LICENSE.md               # License file
└── README.md               # This file
```

## 🚀 Quick Start

### Siriux SaaS Application

```bash
cd siriux-saas
# Follow the instructions in siriux-saas/README.md
```

### Landing Page

```bash
cd landing-page
# Follow the instructions in landing-page/README.md
```

## 📊 Architecture

This dual-repo structure provides:

- **Separation of Concerns**: Clear separation between the main application and documentation
- **Independent Deployment**: Each repo can be deployed independently
- **Focused Development**: Teams can work on different parts without conflicts
- **Simplified Dependencies**: Each repo has its own dependencies

## 🔧 Configuration

Each repository has its own configuration files:

- **siriux-saas/backend/.env**: Backend environment variables
- **siriux-saas/frontend/.env**: Frontend environment variables  
- **landing-page/.env**: Landing page environment variables

## 🤝 Contributing

Please refer to the individual repository README files for contribution guidelines.

## 📄 License

MIT License - see LICENSE file for details.