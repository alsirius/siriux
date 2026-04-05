# Siriux Monorepo Project Configuration

## Project Overview

This is the Siriux monorepo - a comprehensive SaaS platform toolkit consisting of modular packages that work together seamlessly.

## Repository Structure

```
siriux-monorepo/
├── packages/                    # Core packages
│   ├── core/                    # Contracts and interfaces
│   ├── auth/                    # Authentication middleware
│   ├── ui/                      # React components
│   ├── docs/                    # Documentation platform
│   ├── access-control/          # RBAC and permissions
│   ├── logging/                 # Structured logging
│   └── config/                  # Configuration management
├── apps/                        # Example applications
│   └── starter-next-saas/       # Dynamic starter kit
├── create-siriux-app/           # CLI tool
├── .windsurf/                   # AI assistant rules
└── README.md                    # Project documentation
```

## Package Management

### Package Structure
Each package follows a consistent structure:
```
package-name/
├── src/                        # Source code
├── dist/                       # Built output
├── package.json                # Package configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                   # Package documentation
```

### Dependencies
- **@siriux/core** is the foundation package
- All other packages depend on @siriux/core
- Packages are designed to work independently
- Use peer dependencies for shared packages

### Publishing
- All packages use semantic versioning
- Publish to npm under @siriux scope
- Use `npm publish --access public`
- Include built files only

## Development Workflow

### Branch Strategy
- `main` - Stable production code
- `develop` - Integration branch
- `feature/*` - Feature development
- `hotfix/*` - Critical fixes

### Pull Request Process
1. Create feature branch from develop
2. Make changes with proper documentation
3. Update package versions if breaking changes
4. Submit PR to develop branch
5. Code review and testing
6. Merge to develop
7. Deploy from develop to staging
8. Merge develop to main for production

### Testing
- Unit tests for each package
- Integration tests for package interactions
- E2E tests for complete workflows
- Documentation tests (code examples)

## AI Assistant Guidelines

### Code Quality
- Always use TypeScript strict mode
- Follow established patterns and conventions
- Write comprehensive documentation
- Include examples for all public APIs
- Handle errors gracefully

### Package Boundaries
- Respect package boundaries and responsibilities
- Don't create circular dependencies
- Use proper dependency injection
- Keep packages focused and modular

### Documentation Requirements
- **MANDATORY**: Update documentation for ALL changes
- Update package documentation when modifying APIs
- Update version numbers in docs when bumping
- Test all code examples before submitting
- Follow documentation rules in `.windsurf/documentation.md`

### Documentation Synchronization
- **Code changes MUST be accompanied by documentation updates**
- New packages MUST have complete documentation
- Breaking changes MUST include migration guides
- Version numbers MUST be synchronized across docs and code

## Development Standards

### TypeScript
- Use strict mode throughout
- Prefer explicit types over implicit
- Use interfaces for object shapes
- Document complex types with JSDoc
- Use proper error handling

### Code Style
- Use Prettier for formatting
- Use ESLint for linting
- Follow conventional commits
- Use meaningful variable names
- Keep functions small and focused

### Security
- Never commit secrets or keys
- Use environment variables for configuration
- Validate all inputs
- Use HTTPS in production
- Follow security best practices

## Code Review Checklist

### Functionality
- [ ] Code works as intended
- [ ] All edge cases handled
- [ ] Error handling implemented
- [ ] Performance considerations addressed

### Documentation (CRITICAL)
- [ ] **Package documentation updated**
- [ ] **API documentation updated**
- [ ] **Code examples tested**
- [ ] **Version numbers synchronized**
- [ ] **Navigation updated if needed**

### Quality
- [ ] TypeScript strict mode
- [ ] No linting errors
- [ ] Tests pass
- [ ] No console.log in production

## Deployment

### Package Publishing
1. Update version in package.json
2. Update changelog
3. **Update documentation versions**
4. Run build process
5. Test built package
6. Publish to npm
7. **Verify documentation is updated**

### Application Deployment
1. Build application
2. Test in staging
3. Update environment variables
4. Deploy to production
5. Monitor for issues
6. Roll back if needed

## Documentation Standards

### Package Documentation
Each package MUST have:
- README.md with installation and usage
- API documentation for all public methods
- Code examples for common use cases
- Troubleshooting section
- Contributing guidelines

### Project Documentation
- Comprehensive README in root
- Architecture overview
- Development setup guide
- Deployment instructions
- Contribution guidelines

### Documentation Updates
- **ALWAYS update docs when making code changes**
- **Test all code examples**
- **Verify all links work**
- **Update version numbers consistently**
- **Follow documentation rules in `.windsurf/documentation.md`**

## Security Guidelines

### Best Practices
- Use input validation
- Implement proper authentication
- Use HTTPS everywhere
- Keep dependencies updated
- Follow OWASP guidelines

### Sensitive Data
- Never commit secrets
- Use environment variables
- Encrypt sensitive data at rest
- Use secure key management
- Implement proper access controls

## Performance

### Optimization
- Use lazy loading where appropriate
- Implement caching strategies
- Optimize bundle sizes
- Monitor performance metrics
- Use CDN for static assets

### Monitoring
- Implement error tracking
- Use performance monitoring
- Set up alerts for issues
- Monitor resource usage
- Track user metrics

## Troubleshooting

### Common Issues
- Dependency conflicts
- Build failures
- TypeScript errors
- Test failures
- **Documentation issues**

### Debugging
- Use proper logging
- Implement error boundaries
- Use debugging tools
- Check browser console
- Review error messages

## Contributing

### Getting Started
1. Clone repository
2. Install dependencies
3. Set up environment
4. Run tests
5. Start development

### Guidelines
- Follow existing patterns
- Write tests for new features
- **Update documentation for all changes**
- Use conventional commits
- Submit pull requests

## Maintenance

### Regular Tasks
- Update dependencies
- **Review and update documentation**
- Check for security issues
- Monitor performance
- Update examples

### Version Management
- Use semantic versioning
- Update changelog for releases
- Tag releases properly
- Document breaking changes
- Maintain compatibility

## Documentation Integration

### Windsurf Rules Integration
- **All AI assistants must follow `.windsurf/documentation.md`**
- **Documentation updates are mandatory, not optional**
- **Code changes without documentation updates will be rejected**
- **Always test documentation changes**

### Documentation Quality Assurance
- **Documentation is as important as code**
- **Incomplete documentation is worse than no documentation**
- **Always verify documentation accuracy**
- **Maintain consistency across all documentation**

### Emergency Documentation Procedures
- **Critical documentation issues require immediate fixes**
- **Broken documentation must be fixed before code changes**
- **Version synchronization is critical for user experience**
