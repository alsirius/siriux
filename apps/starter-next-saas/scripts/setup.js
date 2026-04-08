#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('Welcome to Siriux SaaS Starter Kit Setup! \n');
  console.log('This script will help you configure your SaaS application.\n');

  const config = {
    app: {
      name: await question('App name: '),
      tagline: await question('App tagline: '),
      description: await question('App description: '),
      url: await question('App URL (e.g., https://yourapp.com): '),
    },
    company: {
      name: await question('Company name: '),
      email: await question('Support email: '),
      address: await question('Company address: '),
    },
    theme: {
      primaryColor: await question('Primary color (hex, e.g., #3B82F6): ') || '#3B82F6',
      secondaryColor: await question('Secondary color (hex, e.g., #10B981): ') || '#10B981',
    }
  };

  console.log('\nGenerating your configuration...\n');

  // Update app-config.ts
  const configPath = path.join(__dirname, '../config/app-config.ts');
  let configContent = fs.readFileSync(configPath, 'utf8');

  // Replace placeholders
  configContent = configContent.replace(/Siriux SaaS/g, config.app.name);
  configContent = configContent.replace(/Your Modern SaaS Platform/g, config.app.tagline);
  configContent = configContent.replace(/A comprehensive SaaS starter kit/g, config.app.description);
  configContent = configContent.replace(/https:\/\/yourapp\.com/g, config.app.url);
  configContent = configContent.replace(/#3B82F6/g, config.theme.primaryColor);
  configContent = configContent.replace(/#10B981/g, config.theme.secondaryColor);

  fs.writeFileSync(configPath, configContent);

  // Update package.json
  const packagePath = path.join(__dirname, '../package.json');
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageContent.name = `@siriux/${config.app.name.toLowerCase().replace(/\s+/g, '-')}`;
  packageContent.description = config.app.description;
  packageContent.author = config.company.email;
  fs.writeFileSync(packagePath, JSON.stringify(packageContent, null, 2));

  console.log('Configuration updated successfully!\n');
  
  console.log('Next steps:');
  console.log('1. Add your logo to public/images/logo.png');
  console.log('2. Add your favicon to public/images/favicon.ico');
  console.log('3. Run npm run dev to start development');
  console.log('4. Visit http://localhost:3000 to see your app');
  console.log('\nHappy building! \ud83d\ude80');

  rl.close();
}

setup().catch(console.error);
