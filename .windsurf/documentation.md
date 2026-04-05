# Documentation Management Rules

## Overview

This document defines rules for maintaining and updating Siriux documentation. All AI assistants must follow these guidelines when making changes to documentation.

## Documentation Structure

### Core Documentation Files
- `/packages/docs/docs/` - Main documentation content
- `/packages/docs/docs/packages/` - Package-specific documentation
- `/packages/docs/docs/tools/` - CLI and starter kit documentation
- `/packages/docs/docs/guides/` - User guides and tutorials
- `README.md` files in each package

### Documentation Types
1. **API Documentation** - Technical reference for each package
2. **User Guides** - Step-by-step tutorials
3. **Overview Documents** - High-level explanations
4. **Configuration Guides** - Setup and customization
5. **Examples** - Code samples and use cases

## Documentation Update Rules

### When to Update Documentation

**ALWAYS update documentation when:**
- ✅ Adding a new package
- ✅ Modifying package APIs
- ✅ Changing configuration options
- ✅ Adding new features
- ✅ Breaking changes
- ✅ Deprecating functionality
- ✅ Updating package versions

**MUST update documentation within the same session as code changes.**

### Documentation Synchronization

**Package ↔ Documentation Sync:**
1. **Code Changes First** → **Documentation Updates Second**
2. **Version Bumps** → **Update version numbers in docs**
3. **API Changes** → **Update API reference**
4. **New Features** → **Add feature documentation**
5. **Breaking Changes** → **Update migration guides**

### Documentation Quality Standards

**Content Requirements:**
- ✅ Clear, concise language
- ✅ Complete code examples
- ✅ Proper formatting and structure
- ✅ Accurate version information
- ✅ Working code samples
- ✅ Links to related documentation

**Technical Requirements:**
- ✅ Proper markdown syntax
- ✅ Correct internal links
- ✅ Syntax highlighting in code blocks
- ✅ Table of contents for long documents
- ✅ Proper heading hierarchy

## Package Documentation Rules

### New Package Documentation

When creating a new package, MUST create:

1. **Package Documentation File**: `/packages/docs/docs/packages/{package-name}.md`
2. **Update Overview**: Add to `/packages/docs/docs/packages/overview.md`
3. **Update Navigation**: Add to `/packages/docs/.vitepress/config.ts`
4. **Update Package README**: In the package directory

### Package Documentation Template

```markdown
# @{package-name}

Brief description of the package.

## Installation

```bash
npm install @{package-name}
```

## Quick Start

```typescript
import { Example } from '@{package-name}';

const instance = new Example();
```

## Features

- **Feature 1**: Description
- **Feature 2**: Description
- **Feature 3**: Description

## Usage

### Basic Usage

```typescript
// Code example
```

### Advanced Usage

```typescript
// Advanced example
```

## API Reference

### ClassName

#### Methods

- `method(param: type): returnType` - Description

## Examples

### Example 1

```typescript
// Complete working example
```

## Best Practices

1. Practice 1
2. Practice 2
3. Practice 3

## Troubleshooting

### Common Issues

**Issue**: Description
**Solution**: How to fix it

## Related Documentation

- [Related Package](./related-package.md)
- [Getting Started](../guides/getting-started.md)
```

## Version Management

### Version Number Rules

**All documentation MUST reflect current package versions:**
- ✅ Check `package.json` for current version
- ✅ Update version numbers in docs when bumping
- ✅ Use semantic versioning consistently
- ✅ Document breaking changes clearly

### Version Update Process

1. **Update package.json** → **Update documentation version**
2. **Add changelog entry** → **Update what's new section**
3. **Breaking changes** → **Add migration guide**

## Navigation and Links

### Internal Links

**Rules for internal links:**
- ✅ Use relative paths for same-site links
- ✅ Use absolute paths for cross-site links
- ✅ Test all links after adding
- ✅ Use descriptive link text

**Link Examples:**
```markdown
✅ Good: [Authentication Guide](./auth.md)
✅ Good: [Getting Started](../guides/getting-started.md)
✅ Good: [External Site](https://example.com)

❌ Bad: [click here](./auth.md)
❌ Bad: [link](broken-link.md)
```

### Navigation Updates

**When updating navigation:**
1. Add new items to sidebar in correct order
2. Ensure all links work
3. Maintain logical grouping
4. Test navigation in dev mode

## Code Examples

### Code Block Requirements

**All code examples MUST:**
- ✅ Be syntactically correct
- ✅ Include necessary imports
- ✅ Be complete and runnable
- ✅ Have proper syntax highlighting
- ✅ Include comments for complex logic

**Code Example Template:**
```typescript
// Import statements
import { Example } from '@{package-name}';

// Setup
const instance = new Example({
  // Configuration
});

// Usage
const result = await instance.doSomething({
  parameter: 'value'
});

console.log(result);
```

### Testing Code Examples

**Before finalizing documentation:**
1. ✅ Copy-paste code into IDE
2. ✅ Check for syntax errors
3. ✅ Verify imports are correct
4. ✅ Test with current package version

## Content Guidelines

### Writing Style

**Use clear, professional language:**
- ✅ Active voice ("You can install...")
- ✅ Present tense for current features
- ✅ Past tense for historical information
- ✅ Future tense for upcoming features

### Structure Requirements

**Document structure:**
1. **Title** - Clear and descriptive
2. **Brief Description** - One-paragraph summary
3. **Installation** - How to install
4. **Quick Start** - Minimal working example
5. **Features** - List of capabilities
6. **Usage** - Detailed examples
7. **API Reference** - Technical details
8. **Examples** - Real-world use cases
9. **Best Practices** - Recommendations
10. **Troubleshooting** - Common issues

### Formatting Rules

**Markdown formatting:**
- ✅ Use `#` for main title
- ✅ Use `##` for major sections
- ✅ Use `###` for subsections
- ✅ Use `**bold**` for emphasis
- ✅ Use `*italic*` for secondary emphasis
- ✅ Use `>` for quotes and notes
- ✅ Use lists for bullet points

## Quality Assurance

### Documentation Review Checklist

**Before submitting changes:**
- [ ] All code examples work
- [ ] All links are functional
- [ ] Version numbers are correct
- [ ] Navigation is updated
- [ ] Spelling and grammar are correct
- [ ] Formatting is consistent
- [ ] Examples are complete
- [ ] API reference is accurate

### Testing Documentation

**Test documentation by:**
1. ✅ Following your own instructions
2. ✅ Running code examples
3. ✅ Checking all links
4. ✅ Verifying navigation
5. ✅ Testing in different browsers

## Automation Rules

### AI Assistant Responsibilities

**When making code changes, AI assistants MUST:**
1. ✅ Update relevant documentation immediately
2. ✅ Add new package docs when creating packages
3. ✅ Update version numbers when bumping
4. ✅ Add examples for new features
5. ✅ Update navigation when adding sections
6. ✅ Test all documentation changes

### Documentation-First Development

**For new features:**
1. ✅ Write documentation first
2. ✅ Implement feature to match documentation
3. ✅ Update documentation if implementation differs
4. ✅ Test both code and documentation

## File Organization

### Directory Structure

```
packages/docs/
├── docs/
│   ├── index.md                 # Homepage
│   ├── guides/                  # User guides
│   │   ├── getting-started.md
│   │   └── ...
│   ├── packages/                 # Package docs
│   │   ├── overview.md
│   │   ├── core.md
│   │   ├── auth.md
│   │   ├── ui.md
│   │   ├── access-control.md
│   │   ├── logging.md
│   │   ├── config.md
│   │   └── docs.md
│   └── tools/                   # Tool documentation
│       ├── cli.md
│       └── starter-kit.md
├── .vitepress/
│   └── config.ts               # Navigation config
└── package.json
```

### File Naming

**Naming conventions:**
- ✅ Use lowercase with hyphens
- ✅ Use descriptive names
- ✅ Keep names under 50 characters
- ✅ Be consistent with existing patterns

## Maintenance

### Regular Updates

**Monthly documentation review:**
- ✅ Check for broken links
- ✅ Update version numbers
- ✅ Add new feature documentation
- ✅ Remove outdated information
- ✅ Improve examples

### Documentation Debt

**Track and address documentation debt:**
- ✅ Identify missing documentation
- ✅ Prioritize critical gaps
- ✅ Schedule regular updates
- ✅ Measure documentation coverage

## Emergency Procedures

### Critical Issues

**If documentation is broken:**
1. 🚨 **Immediate Fix**: Correct broken links
2. 🚨 **Version Sync**: Ensure versions match
3. 🚨 **Code Examples**: Fix non-working examples
4. 🚨 **Navigation**: Fix broken navigation

### Rollback Procedures

**If documentation changes cause issues:**
1. 🔄 Revert to previous version
2. 🔄 Identify the problematic change
3. 🔄 Fix the issue
4. 🔄 Re-apply changes carefully

## Conclusion

These rules ensure that Siriux documentation remains accurate, comprehensive, and user-friendly. All AI assistants must follow these guidelines when making any changes to documentation.

**Remember: Documentation is as important as code. Incomplete or incorrect documentation is worse than no documentation at all.**
