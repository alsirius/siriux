// Mock access control system with role-based permissions
export enum Permission {
  // User permissions
  READ_OWN_PROFILE = 'read:own_profile',
  UPDATE_OWN_PROFILE = 'update:own_profile',
  DELETE_OWN_ACCOUNT = 'delete:own_account',
  
  // Content permissions
  READ_CONTENT = 'read:content',
  CREATE_CONTENT = 'create:content',
  UPDATE_OWN_CONTENT = 'update:own_content',
  DELETE_OWN_CONTENT = 'delete:own_content',
  
  // Admin permissions
  READ_ALL_USERS = 'read:all_users',
  UPDATE_ALL_USERS = 'update:all_users',
  DELETE_ALL_USERS = 'delete:all_users',
  MANAGE_ROLES = 'manage:roles',
  
  // System permissions
  READ_SYSTEM_LOGS = 'read:system_logs',
  MANAGE_SYSTEM_CONFIG = 'manage:system_config',
  VIEW_ANALYTICS = 'view:analytics',
  EXPORT_DATA = 'export:data'
}

export enum Role {
  USER = 'user',
  MANAGER = 'manager',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface User {
  id: string;
  email: string;
  role: Role;
  permissions: Permission[];
  groups: string[];
  metadata?: Record<string, any>;
}

export interface Resource {
  id: string;
  type: string;
  ownerId?: string;
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AccessRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    roles?: Role[];
    permissions?: Permission[];
    groups?: string[];
    custom?: (user: User, resource: Resource, action: string) => Promise<boolean>;
  };
  effect: 'allow' | 'deny';
  priority: number;
}

export interface MockAccessControlConfig {
  enableCaching: boolean;
  cacheTimeout: number;
  enableAuditLogging: boolean;
  defaultEffect: 'allow' | 'deny';
}

export class MockAccessControl {
  private config: MockAccessControlConfig;
  private users: Map<string, User> = new Map();
  private resources: Map<string, Resource> = new Map();
  private rules: Map<string, AccessRule> = new Map();
  private cache: Map<string, boolean> = new Map();
  private auditLogs: Array<{
    id: string;
    userId: string;
    resource: string;
    action: string;
    allowed: boolean;
    reason: string;
    timestamp: string;
  }> = [];

  constructor(config: Partial<MockAccessControlConfig> = {}) {
    this.config = {
      enableCaching: true,
      cacheTimeout: 300000, // 5 minutes
      enableAuditLogging: true,
      defaultEffect: 'deny',
      ...config
    };

    this.initializeDefaultData();
  }

  private initializeDefaultData(): void {
    // Default users
    const defaultUsers: User[] = [
      {
        id: '1',
        email: 'admin@siriux.dev',
        role: Role.ADMIN,
        permissions: Object.values(Permission),
        groups: ['administrators', 'system'],
        metadata: { department: 'IT', level: 'senior' }
      },
      {
        id: '2',
        email: 'user@siriux.dev',
        role: Role.USER,
        permissions: [
          Permission.READ_OWN_PROFILE,
          Permission.UPDATE_OWN_PROFILE,
          Permission.READ_CONTENT,
          Permission.CREATE_CONTENT,
          Permission.UPDATE_OWN_CONTENT,
          Permission.DELETE_OWN_CONTENT
        ],
        groups: ['users'],
        metadata: { department: 'Sales', level: 'junior' }
      },
      {
        id: '3',
        email: 'manager@siriux.dev',
        role: Role.MANAGER,
        permissions: [
          Permission.READ_OWN_PROFILE,
          Permission.UPDATE_OWN_PROFILE,
          Permission.READ_CONTENT,
          Permission.CREATE_CONTENT,
          Permission.UPDATE_OWN_CONTENT,
          Permission.DELETE_OWN_CONTENT,
          Permission.READ_ALL_USERS,
          Permission.VIEW_ANALYTICS
        ],
        groups: ['managers', 'users'],
        metadata: { department: 'Sales', level: 'manager' }
      }
    ];

    defaultUsers.forEach(user => {
      this.users.set(user.id, user);
    });

    // Default access rules
    const defaultRules: AccessRule[] = [
      {
        id: 'admin_full_access',
        name: 'Admin Full Access',
        description: 'Administrators have full access to all resources',
        conditions: {
          roles: [Role.ADMIN, Role.SUPER_ADMIN]
        },
        effect: 'allow',
        priority: 100
      },
      {
        id: 'owner_access',
        name: 'Resource Owner Access',
        description: 'Users can access their own resources',
        conditions: {
          custom: async (user: User, resource: Resource, action: string) => {
            return resource.ownerId === user.id;
          }
        },
        effect: 'allow',
        priority: 90
      },
      {
        id: 'manager_user_read',
        name: 'Manager Can Read Users',
        description: 'Managers can read user information',
        conditions: {
          roles: [Role.MANAGER],
          permissions: [Permission.READ_ALL_USERS]
        },
        effect: 'allow',
        priority: 80
      },
      {
        id: 'basic_user_access',
        name: 'Basic User Access',
        description: 'Basic access for regular users',
        conditions: {
          roles: [Role.USER]
        },
        effect: 'allow',
        priority: 50
      }
    ];

    defaultRules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }

  private generateCacheKey(userId: string, resource: string, action: string): string {
    return `${userId}:${resource}:${action}`;
  }

  private async evaluateRule(rule: AccessRule, user: User, resource: Resource, action: string): Promise<boolean> {
    // Check role conditions
    if (rule.conditions.roles && !rule.conditions.roles.includes(user.role)) {
      return false;
    }

    // Check permission conditions
    if (rule.conditions.permissions && !rule.conditions.permissions.some(p => user.permissions.includes(p))) {
      return false;
    }

    // Check group conditions
    if (rule.conditions.groups && !rule.conditions.groups.some(g => user.groups.includes(g))) {
      return false;
    }

    // Check custom conditions
    if (rule.conditions.custom) {
      return await rule.conditions.custom(user, resource, action);
    }

    return true;
  }

  private async logAccessDecision(
    userId: string,
    resource: string,
    action: string,
    allowed: boolean,
    reason: string
  ): Promise<void> {
    if (!this.config.enableAuditLogging) return;

    const log = {
      id: Date.now().toString(),
      userId,
      resource,
      action,
      allowed,
      reason,
      timestamp: new Date().toISOString()
    };

    this.auditLogs.push(log);

    // Keep only last 1000 logs
    if (this.auditLogs.length > 1000) {
      this.auditLogs = this.auditLogs.slice(-1000);
    }
  }

  // Public API methods
  async canAccess(userId: string, resource: string, action: string): Promise<{
    allowed: boolean;
    reason: string;
    rule?: string;
  }> {
    // Check cache first
    const cacheKey = this.generateCacheKey(userId, resource, action);
    if (this.config.enableCaching) {
      const cached = this.cache.get(cacheKey);
      if (cached !== undefined) {
        return {
          allowed: cached,
          reason: cached ? 'Cached decision' : 'Cached denial'
        };
      }
    }

    const user = this.users.get(userId);
    if (!user) {
      const decision = { allowed: false, reason: 'User not found' };
      await this.logAccessDecision(userId, resource, action, decision.allowed, decision.reason);
      return decision;
    }

    const resourceObj = this.resources.get(resource);
    const resourceData = resourceObj || { 
      id: resource, 
      type: 'unknown', 
      attributes: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Sort rules by priority (highest first)
    const sortedRules = Array.from(this.rules.values()).sort((a, b) => b.priority - a.priority);

    // Evaluate rules
    for (const rule of sortedRules) {
      const ruleResult = await this.evaluateRule(rule, user, resourceData, action);
      
      if (ruleResult) {
        const decision = {
          allowed: rule.effect === 'allow',
          reason: `Rule "${rule.name}" (${rule.effect})`,
          rule: rule.id
        };

        // Update cache
        if (this.config.enableCaching) {
          this.cache.set(cacheKey, decision.allowed);
        }

        await this.logAccessDecision(userId, resource, action, decision.allowed, decision.reason);
        return decision;
      }
    }

    // Default effect
    const decision = {
      allowed: this.config.defaultEffect === 'allow',
      reason: `Default effect: ${this.config.defaultEffect}`
    };

    // Update cache
    if (this.config.enableCaching) {
      this.cache.set(cacheKey, decision.allowed);
    }

    await this.logAccessDecision(userId, resource, action, decision.allowed, decision.reason);
    return decision;
  }

  // User management
  async addUser(user: Omit<User, 'id'>): Promise<User> {
    const newUser: User = {
      id: Date.now().toString(),
      ...user
    };

    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(userId);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.users.set(userId, updatedUser);
    
    // Clear cache for this user
    this.clearCacheForUser(userId);
    
    return updatedUser;
  }

  async getUser(userId: string): Promise<User | null> {
    return this.users.get(userId) || null;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Resource management
  async addResource(resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Promise<Resource> {
    const newResource: Resource = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...resource
    };

    this.resources.set(newResource.id, newResource);
    return newResource;
  }

  async getResource(resourceId: string): Promise<Resource | null> {
    return this.resources.get(resourceId) || null;
  }

  async getUserResources(userId: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(resource => resource.ownerId === userId);
  }

  // Rule management
  async addRule(rule: Omit<AccessRule, 'id'>): Promise<AccessRule> {
    const newRule: AccessRule = {
      id: Date.now().toString(),
      ...rule
    };

    this.rules.set(newRule.id, newRule);
    this.clearCache();
    
    return newRule;
  }

  async updateRule(ruleId: string, updates: Partial<AccessRule>): Promise<AccessRule | null> {
    const rule = this.rules.get(ruleId);
    if (!rule) return null;

    const updatedRule = { ...rule, ...updates };
    this.rules.set(ruleId, updatedRule);
    this.clearCache();
    
    return updatedRule;
  }

  async removeRule(ruleId: string): Promise<boolean> {
    const deleted = this.rules.delete(ruleId);
    if (deleted) {
      this.clearCache();
    }
    return deleted;
  }

  async getAllRules(): Promise<AccessRule[]> {
    return Array.from(this.rules.values()).sort((a, b) => b.priority - a.priority);
  }

  // Permission checking
  async hasPermission(userId: string, permission: Permission): Promise<boolean> {
    const user = this.users.get(userId);
    return user ? user.permissions.includes(permission) : false;
  }

  async hasRole(userId: string, role: Role): Promise<boolean> {
    const user = this.users.get(userId);
    return user ? user.role === role : false;
  }

  async isInGroup(userId: string, group: string): Promise<boolean> {
    const user = this.users.get(userId);
    return user ? user.groups.includes(group) : false;
  }

  // Audit and analytics
  async getAuditLogs(userId?: string, limit: number = 100): Promise<any[]> {
    let logs = this.auditLogs;
    
    if (userId) {
      logs = logs.filter(log => log.userId === userId);
    }
    
    return logs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async getAccessStats(): Promise<{
    totalUsers: number;
    totalResources: number;
    totalRules: number;
    totalAuditLogs: number;
    accessByRole: Record<Role, number>;
    mostAccessedResources: Array<{ resource: string; count: number }>;
    recentDenials: number;
  }> {
    const accessByRole: Record<Role, number> = {
      [Role.USER]: 0,
      [Role.MANAGER]: 0,
      [Role.ADMIN]: 0,
      [Role.SUPER_ADMIN]: 0
    };

    const resourceAccessCount: Record<string, number> = {};
    let recentDenials = 0;

    for (const log of this.auditLogs) {
      const user = this.users.get(log.userId);
      if (user) {
        accessByRole[user.role]++;
      }

      resourceAccessCount[log.resource] = (resourceAccessCount[log.resource] || 0) + 1;

      if (!log.allowed && new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
        recentDenials++;
      }
    }

    const mostAccessedResources = Object.entries(resourceAccessCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([resource, count]) => ({ resource, count }));

    return {
      totalUsers: this.users.size,
      totalResources: this.resources.size,
      totalRules: this.rules.size,
      totalAuditLogs: this.auditLogs.length,
      accessByRole,
      mostAccessedResources,
      recentDenials
    };
  }

  // Utility methods
  clearCache(): void {
    this.cache.clear();
  }

  clearCacheForUser(userId: string): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${userId}:`)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  clearAuditLogs(): void {
    this.auditLogs = [];
  }

  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0.85 // Mock hit rate
    };
  }
}

// Factory function
export const createMockAccessControl = (config?: Partial<MockAccessControlConfig>): MockAccessControl => {
  return new MockAccessControl(config);
};

// Environment-based access control
export const createEnvironmentAccessControl = (): MockAccessControl => {
  const config: Partial<MockAccessControlConfig> = {
    enableCaching: process.env.ACCESS_CONTROL_CACHING !== 'false',
    enableAuditLogging: process.env.ACCESS_CONTROL_AUDIT !== 'false',
    defaultEffect: (process.env.DEFAULT_EFFECT as 'allow' | 'deny') || 'deny'
  };

  return new MockAccessControl(config);
};
