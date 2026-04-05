# Terminal Usage Guidelines

## 🖥️ Terminal Window Usage

### **ALWAYS use the dedicated terminal window for terminal operations**

**NEVER use terminal commands inside the Cascade/AI interface.**

## ✅ When to Use Terminal Window

### Package Management
```bash
# Use terminal window for:
npm install
npm run build
npm test
npm publish
```

### Development Servers
```bash
# Use terminal window for:
npm run dev

### 1. System Terminal (YOUR TERMINAL)
- **Purpose**: Development servers, long-running processes
- **Examples**: Terminal.app, iTerm2, VS Code Terminal, Windows Terminal
- **Usage**: Running `npm run dev`, database servers, etc.

### 2. Cascade Terminal (AI TERMINAL)
- **Purpose**: Quick commands, file operations, git operations ONLY
- **Examples**: The terminal provided by Cascade AI
- **Usage**: File management, package installation, testing

## 📋 Usage Guidelines

### ✅ Use System Terminal For:
- Development servers (`npm run dev`, `npm start`)
- Database servers (`mongod`, `postgres`, redis-server`)
- Long-running processes
- Interactive applications
- Real-time logging
- Live development workflows

### ✅ Use System Terminal For:
- File operations (`ls`, `mv`, `cp`, `mkdir`)
- Git operations (`git status`, `git add`, `git commit`)
- Package management (`npm install`, `npm update`)
- Build processes (`npm run build`)
- Testing (`npm test`, `npm run test`)
- Configuration verification
- Quick checks and diagnostics

### ❌ Use Cascade Terminal For:
- Code editing and analysis
- File content review
- Code generation and refactoring
- Documentation updates
- Architecture planning

## 🔄 Proper Development Workflow

### Standard Development Setup
1. **System Terminal**: Open and navigate to project
2. **System Terminal**: Run `npm run dev` (keep this running)
3. **System Terminal**: Use for all npm commands, git, file operations
4. **Cascade**: Code editing, analysis, and documentation
5. **System Terminal**: See live updates from dev server

### Build and Deploy Workflow
1. **System Terminal**: `npm run build`
2. **System Terminal**: Verify build output
3. **System Terminal**: Deploy if needed

### Database Operations
1. **System Terminal**: Start database server
2. **System Terminal**: Run migrations or setup scripts
3. **System Terminal**: Keep database running

## ⚠️ Common Mistakes to Avoid

### ❌ WRONG: Using Cascade for System Operations
```bash
# DON'T DO THIS IN CASCADE
npm install
npm run build
git status
ls -la
```

### ✅ RIGHT: Use System Terminal for All Operations
```bash
# DO THIS IN YOUR SYSTEM TERMINAL
npm install
npm run build
git status
ls -la
```

## 📋 Updated Command Reference

### System Terminal Commands (ALL OPERATIONS)
```bash
# Development
npm run dev
npm start

# Package Management
npm install
npm update
npm run build

# Git Operations
git status
git add .
git commit -m "message"
git push

# File Operations
ls -la
mv old-file new-file
cp source dest
mkdir new-folder

# Testing
npm test
npm run lint
```

### Cascade Operations (CODE ONLY)
```bash
# Code Analysis
# - Review file contents
# - Analyze code structure
# - Plan refactoring

# Code Generation
# - Generate new components
# - Write documentation
# - Create test cases

# File Review
# - Read configuration files
# - Check code quality
# - Review error messages
```

## 🎯 Final Summary

### ✅ SYSTEM TERMINAL (Your Terminal) - ALL OPERATIONS:
- Development servers (`npm run dev`)
- Package management (`npm install`, `npm run build`)
- Git operations (`git status`, `git commit`)
- File operations (`ls`, `mv`, `cp`)
- Testing (`npm test`, `npm run lint`)
- ALL system commands

### ✅ CASCADE (AI Assistant) - CODE ONLY:
- Code editing and analysis
- File content review
- Code generation
- Documentation updates
- Architecture planning
- NO system commands

### 🚨 GOLDEN RULE:
**If it's a command → Use System Terminal**
**If it's code → Use Cascade**

---

**Remember**: Terminal window for system operations, Cascade for code operations. This separation ensures better workflow and prevents confusion.
