import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

interface CreateOptions {
  template: string;
  install: boolean;
  git: boolean;
  appName?: string;
  appDescription?: string;
  techStack?: string;
  features?: string[];
}

export async function createProject(projectName: string, options: CreateOptions) {
  const targetDir = path.resolve(process.cwd(), projectName);
  
  // Check if directory already exists
  if (await fs.pathExists(targetDir)) {
    throw new Error(`Directory ${projectName} already exists`);
  }

  const spinner = ora('Creating your Siriux application...').start();

  try {
    // Create project directory
    await fs.ensureDir(targetDir);

    // Copy template files
    const templateDir = path.join(fileURLToPath(import.meta.url), '..', 'templates', options.template);
    await fs.copy(templateDir, targetDir);

    // Update package.json with project details
    if (options.template === 'saas') {
      await updatePackageJson(targetDir, projectName, options);
      await updateAppConfig(targetDir, options);
    }

    // Initialize git if requested
    if (options.git) {
      spinner.text = 'Initializing git repository...';
      await initGit(targetDir);
    }

    // Install dependencies if requested
    if (options.install) {
      spinner.text = 'Installing dependencies...';
      await installDependencies(targetDir);
    }

    spinner.succeed('Project created successfully!');
  } catch (error) {
    spinner.fail('Failed to create project');
    throw error;
  }
}

async function updatePackageJson(targetDir: string, projectName: string, options: CreateOptions) {
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  
  packageJson.name = projectName;
  packageJson.description = options.appDescription || `A Siriux SaaS application`;
  
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

async function updateAppConfig(targetDir: string, options: CreateOptions) {
  const configPath = path.join(targetDir, 'config', 'app-config.ts');
  let configContent = await fs.readFile(configPath, 'utf8');

  // Update app details
  configContent = configContent.replace(/name: "Siriux SaaS"/, `name: "${options.appName}"`);
  configContent = configContent.replace(/description: "A modern SaaS platform built with Siriux components and dynamic configuration."/g, 
    `description: "${options.appDescription}"`);

  // Update features based on selection
  if (options.features) {
    const features = {
      authentication: options.features.includes('auth'),
      userManagement: options.features.includes('users'),
      analytics: options.features.includes('analytics'),
      blog: options.features.includes('blog'),
      marketplace: options.features.includes('marketplace'),
      forums: options.features.includes('forums'),
      events: false,
      newsletter: options.features.includes('email')
    };

    let featuresConfig = 'features: {\n';
    Object.entries(features).forEach(([key, value]) => {
      featuresConfig += `    ${key}: ${value},\n`;
    });
    featuresConfig += '  }';

    configContent = configContent.replace(/features: \{[^}]+\}/s, featuresConfig);
  }

  await fs.writeFile(configPath, configContent);
}

async function initGit(targetDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const git = spawn('git', ['init'], { cwd: targetDir, stdio: 'ignore' });
    
    git.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Failed to initialize git repository'));
      }
    });
  });
}

async function installDependencies(targetDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const npm = spawn('npm', ['install'], { cwd: targetDir, stdio: 'ignore' });
    
    npm.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Failed to install dependencies'));
      }
    });
  });
}
