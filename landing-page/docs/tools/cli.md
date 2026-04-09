# CLI Tool

Project scaffolding and development tools for Siriux applications.

## Installation

```bash
npm create siriux-app@latest
```

## Overview

The Siriux CLI tool helps you create new projects quickly with interactive prompts and templates.

## Features

- **Interactive Setup**: Guided project creation
- **Template Selection**: Multiple project templates
- **Feature Toggles**: Choose what to include
- **Automatic Setup**: Dependencies and git initialization
- **Customizable**: Easy to extend with custom templates

## Usage

### Create New Project

```bash
# Interactive setup
npm create siriux-app@latest

# With project name
npm create siriux-app@latest my-saas-app

# Skip installation
npm create siriux-app@latest my-app --no-install

# Skip git initialization
npm create siriux-app@latest my-app --no-git
```

### Available Templates

#### SaaS Application
Complete SaaS application with authentication, analytics, and more.

```bash
npm create siriux-app@latest my-saas --template saas
```

#### API Backend
Express API backend with authentication and database.

```bash
npm create siriux-app@latest my-api --template api
```

#### Minimal Project
Basic setup with just the essentials.

```bash
npm create siriux-app@latest my-minimal --template minimal
```

## Interactive Prompts

### Project Information

The CLI will prompt for:

1. **Project Name**: Name of your project directory
2. **App Name**: Display name for your application
3. **Description**: What your app does
4. **Tech Stack**: Choose your preferred framework
5. **Features**: Select features to include

### Feature Selection

Available features:

- 🔐 **Authentication** - User login and registration
- 👥 **User Management** - User profiles and admin
- 📊 **Analytics** - User analytics and reporting
- 📝 **Blog System** - Built-in blog functionality
- 💳 **Payment Integration** - Stripe/PayPal integration
- 📧 **Email Service** - Email notifications
- 🏪 **Marketplace** - E-commerce features
- 💬 **Community Forums** - Discussion forums

## Examples

### Quick SaaS App

```bash
$ npm create siriux-app@latest my-saas
? What is your project named? my-saas
? What is your app called? My SaaS App
? What does your app do? A modern SaaS platform
? Which tech stack? Next.js + TypeScript
? Which features would you like to include? 
❯◉ Authentication
 ◉ User Management
 ◉ Analytics
 ◯ Blog System
 ◯ Payment Integration
 ◯ Email Service
 ◯ Marketplace
 ◯ Community Forums

✨ Success! Your Siriux application is ready.

Next steps:
  cd my-saas
  npm run dev

Happy coding! 🚀
```

### API Backend

```bash
$ npm create siriux-app@latest my-api --template api
✨ Success! Your Siriux API is ready.

Next steps:
  cd my-api
  npm install
  npm run dev

Happy coding! 🚀
```

## Project Structure

### SaaS Template

```
my-saas/
├── config/
│   └── app-config.ts          # 🎨 Dynamic configuration
├── public/
│   └── images/                # 📸 Your images
├── src/
│   ├── app/                   # Next.js App Router
│   ├── components/            # React components
│   ├── lib/                   # Utilities
│   └── styles/                # CSS and styling
├── package.json
├── README.md
└── .env.local                 # Environment variables
```

### API Template

```
my-api/
├── src/
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Express middleware
│   ├── models/                # Data models
│   ├── routes/                # API routes
│   └── utils/                 # Utilities
├── package.json
├── README.md
└── .env.local
```

## Configuration

### Dynamic Configuration (SaaS)

After creating a SaaS project, customize it by editing `config/app-config.ts`:

```typescript
export const appConfig = {
  app: {
    name: "Your SaaS",
    tagline: "Your tagline",
    description: "What your app does"
  },
  theme: {
    primaryColor: "#3B82F6",
    secondaryColor: "#10B981",
    darkMode: true
  },
  features: {
    authentication: true,
    analytics: true,
    blog: false
  }
};
```

### Environment Variables

Create `.env.local`:

```bash
# App Configuration
NODE_ENV=development
APP_URL=http://localhost:3000

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Database
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
```

## Custom Templates

### Creating Custom Templates

1. **Create Template Directory**:
```bash
mkdir ~/.siriux/templates/my-custom-template
```

2. **Add Template Files**:
```
my-custom-template/
├── package.json.template
├── README.md.template
├── src/
│   └── index.ts.template
└── config/
    └── app-config.ts.template
```

3. **Use Template**:
```bash
npm create siriux-app@latest my-project --template ~/.siriux/templates/my-custom-template
```

### Template Variables

Templates can use variables:

```json
{
  "name": "{{PROJECT_NAME}}",
  "description": "{{APP_DESCRIPTION}}",
  "version": "1.0.0"
}
```

## CLI Options

### Command Line Options

```bash
npm create siriux-app@latest [project-name] [options]

Options:
  -t, --template <template>     Template to use (saas, api, minimal)
  --no-install                 Skip installing dependencies
  --no-git                     Skip git initialization
  -h, --help                  Display help for command
```

### Examples

```bash
# Create SaaS app with all features
npm create siriux-app@latest my-app --template saas

# Create API without dependencies
npm create siriux-app@latest my-api --template api --no-install

# Create minimal project without git
npm create siriux-app@latest my-minimal --template minimal --no-git
```

## Development Workflow

### 1. Create Project

```bash
npm create siriux-app@latest my-project
cd my-project
```

### 2. Customize Configuration

Edit `config/app-config.ts` to customize your app:

```typescript
export const appConfig = {
  app: {
    name: "My Awesome App",
    tagline: "Making life better",
    description: "A revolutionary SaaS platform"
  },
  // ... more configuration
};
```

### 3. Add Your Assets

Place your images in `public/images/`:
- `logo.png` - Your app logo
- `hero-bg.jpg` - Hero background
- `favicon.ico` - Favicon

### 4. Set Environment

Create `.env.local`:
```bash
JWT_SECRET=your-secret-key
APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your customized app!

## Advanced Usage

### Programmatic Usage

```typescript
import { createProject } from 'create-siriux-app';

await createProject('my-project', {
  template: 'saas',
  install: true,
  git: true,
  appName: 'My App',
  features: ['auth', 'analytics']
});
```

### Custom Prompts

Create a custom CLI that extends Siriux:

```typescript
import { prompt } from 'inquirer';
import { createProject } from 'create-siriux-app';

async function customSetup() {
  const answers = await prompt([
    {
      type: 'input',
      name: 'companyName',
      message: 'What is your company name?'
    },
    {
      type: 'list',
      name: 'industry',
      message: 'What industry are you in?',
      choices: ['Technology', 'Healthcare', 'Finance', 'Education']
    }
  ]);

  await createProject('company-app', {
    template: 'saas',
    companyName: answers.companyName,
    industry: answers.industry
  });
}
```

## Troubleshooting

### Common Issues

#### Permission Denied

```bash
# Fix permissions
sudo chown -R $USER:$USER ~/.siriux
```

#### Template Not Found

```bash
# Update CLI to latest version
npm install -g create-siriux-app@latest
```

#### Installation Failed

```bash
# Clear npm cache
npm cache clean --force
# Try again
npm create siriux-app@latest my-project
```

#### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill
# Or use different port
PORT=3001 npm run dev
```

### Getting Help

- [Documentation](https://docs.siriux.dev)
- [GitHub Issues](https://github.com/siriux/create-siriux-app/issues)
- [Discord Community](https://discord.gg/siriux)

## Contributing

We welcome contributions to the CLI tool!

### Development Setup

```bash
# Clone repository
git clone https://github.com/siriux/create-siriux-app.git
cd create-siriux-app

# Install dependencies
npm install

# Run tests
npm test

# Build CLI
npm run build

# Test locally
npm link
create-siriux-app test-project
```

### Adding New Templates

1. Create template in `templates/` directory
2. Update template options in `src/cli.ts`
3. Add tests for new template
4. Update documentation

### Submitting Changes

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## Version History

### v1.0.0
- Initial release
- Interactive project setup
- SaaS, API, and Minimal templates
- Feature selection
- Automatic dependency installation
- Git initialization

### Future Releases

- More templates (e-commerce, education, healthcare)
- Plugin system for custom templates
- Project templates for different industries
- Integration with cloud services
- Advanced customization options
