#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import validateNpmPackageName from 'validate-npm-package-name';
import { createProject } from './creator.js';

const program = new Command();

program
  .name('create-siriux-app')
  .description('Create a new Siriux SaaS application')
  .version('1.0.0')
  .argument('[project-name]', 'Name of the project')
  .option('-t, --template <template>', 'Template to use (saas, api, minimal)', 'saas')
  .option('--no-install', 'Skip installing dependencies')
  .option('--no-git', 'Skip git initialization')
  .action(async (projectName: string | undefined, options) => {
    try {
      // Get project name if not provided
      if (!projectName) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectName',
            message: 'What is your project named?',
            default: 'my-siriux-app',
            validate: (input) => {
              const validation = validateNpmPackageName(input);
              if (validation.validForNewPackages) {
                return true;
              }
              return 'Invalid project name. Please use a valid npm package name.';
            }
          }
        ]);
        projectName = answers.projectName;
      }

      // Get template if not specified
      if (!options.template) {
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'template',
            message: 'Which template would you like to use?',
            choices: [
              {
                name: '🚀 SaaS Application',
                value: 'saas',
                description: 'Full-featured SaaS application with authentication, analytics, and more'
              },
              {
                name: '🔧 API Backend',
                value: 'api',
                description: 'Express API backend with authentication and database'
              },
              {
                name: '📦 Minimal',
                value: 'minimal',
                description: 'Basic setup with just the essentials'
              }
            ]
          }
        ]);
        options.template = answers.template;
      }

      // Get project details for SaaS template
      let projectDetails: any = {};
      if (options.template === 'saas') {
        projectDetails = await inquirer.prompt([
          {
            type: 'input',
            name: 'appName',
            message: 'What is your app called?',
            default: projectName,
          },
          {
            type: 'input',
            name: 'appDescription',
            message: 'What does your app do?',
            default: 'A modern SaaS application built with Siriux',
          },
          {
            type: 'list',
            name: 'techStack',
            message: 'Which tech stack?',
            choices: [
              { name: 'Next.js + TypeScript', value: 'nextjs' },
              { name: 'React + Vite', value: 'react' },
              { name: 'Vue.js', value: 'vue' },
            ],
            default: 'nextjs'
          },
          {
            type: 'checkbox',
            name: 'features',
            message: 'Which features would you like to include?',
            choices: [
              { name: '🔐 Authentication', value: 'auth', checked: true },
              { name: '👥 User Management', value: 'users', checked: true },
              { name: '📊 Analytics', value: 'analytics', checked: true },
              { name: '📝 Blog System', value: 'blog', checked: false },
              { name: '💳 Payment Integration', value: 'payments', checked: false },
              { name: '📧 Email Service', value: 'email', checked: false },
              { name: '🏪 Marketplace', value: 'marketplace', checked: false },
              { name: '💬 Community Forums', value: 'forums', checked: false },
            ]
          }
        ]);
      }

      // Create the project
      await createProject(projectName!, {
        template: options.template,
        install: options.install,
        git: options.git,
        ...projectDetails
      });

      console.log(chalk.green('\n✨ Success! Your Siriux application is ready.'));
      console.log(chalk.cyan('\nNext steps:'));
      console.log(`  cd ${projectName}`);
      if (options.install) {
        console.log('  npm run dev');
      } else {
        console.log('  npm install');
        console.log('  npm run dev');
      }
      console.log(chalk.cyan('\nHappy coding! 🚀'));

    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program.parse();
