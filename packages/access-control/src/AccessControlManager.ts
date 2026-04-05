import { 
  Permission, 
  AccessRequest, 
  AccessResult, 
  AccessContext,
  PolicyEngine,
  AccessControlConfig,
  RoleDefinition
} from './types';
import { UserRole } from '@siriux/core';
import { DefaultPolicyEngine } from './policies/PolicyEngine';
import { GuardRegistry as DefaultGuardRegistry } from './guards';

export class AccessControlManager {
  private policyEngine: PolicyEngine;
  private guardRegistry: DefaultGuardRegistry;
  private rolePermissions: Map<UserRole, Permission[]> = new Map();

  constructor(config: AccessControlConfig) {
    this.policyEngine = new DefaultPolicyEngine(config.policies);
    this.guardRegistry = new DefaultGuardRegistry();
    
    // Register custom guards
    config.guards.forEach(guard => this.guardRegistry.register(guard));
    
    // Set up role permissions
    config.defaultRoles.forEach(roleDef => {
      this.rolePermissions.set(roleDef.role, roleDef.permissions);
    });
  }

  // Check if a user has permission for a specific action
  async can(
    permission: Permission, 
    context: AccessContext,
    guards?: string[]
  ): Promise<AccessResult> {
    const request: AccessRequest = {
      permission,
      context
    };

    // First check permission
    const permissionResult = await this.policyEngine.evaluate(request);
    if (!permissionResult.granted) {
      return permissionResult;
    }

    // Then check guards if specified
    if (guards && guards.length > 0) {
      const guardResult = await this.guardRegistry.evaluateGuards(guards, request);
      if (!guardResult.granted) {
        return guardResult;
      }
    }

    return { granted: true };
  }

  // Check multiple permissions at once
  async canAny(
    permissions: Permission[], 
    context: AccessContext,
    guards?: string[]
  ): Promise<AccessResult> {
    for (const permission of permissions) {
      const result = await this.can(permission, context, guards);
      if (result.granted) {
        return result;
      }
    }

    return {
      granted: false,
      reason: `None of the required permissions are granted: ${permissions.join(', ')}`
    };
  }

  // Check if user has all specified permissions
  async canAll(
    permissions: Permission[], 
    context: AccessContext,
    guards?: string[]
  ): Promise<AccessResult> {
    for (const permission of permissions) {
      const result = await this.can(permission, context, guards);
      if (!result.granted) {
        return result;
      }
    }

    return { granted: true };
  }

  // Get user permissions
  getUserPermissions(role: UserRole): Permission[] {
    return this.rolePermissions.get(role) || [];
  }

  // Check if user owns a resource
  async ownsResource(userId: string, resourceId: string): Promise<boolean> {
    const context: AccessContext = {
      userId,
      userRole: UserRole.USER, // Role doesn't matter for ownership check
      resourceId
    };

    const result = await this.can(Permission.READ_OWN_PROFILE, context, ['ownership']);
    return result.granted;
  }

  // Add custom policy
  addPolicy(policy: any): void {
    this.policyEngine.addPolicy(policy);
  }

  // Remove policy
  removePolicy(policyId: string): void {
    this.policyEngine.removePolicy(policyId);
  }

  // Add custom guard
  addGuard(guard: any): void {
    this.guardRegistry.register(guard);
  }

  // Remove guard
  removeGuard(guardName: string): void {
    this.guardRegistry.unregister(guardName);
  }

  // Create middleware for Express
  createMiddleware(options: {
    permission: Permission;
    guards?: string[];
    getResourceContext?: (req: any) => Partial<AccessContext>;
  }) {
    return async (req: any, res: any, next: any) => {
      try {
        // Get user from request (assuming auth middleware already ran)
        if (!req.user) {
          return res.status(401).json({ 
            success: false, 
            error: 'Authentication required' 
          });
        }

        // Build access context
        const baseContext: AccessContext = {
          userId: req.user.userId || req.user.id,
          userRole: req.user.role,
          ip: req.ip || req.connection.remoteAddress
        };

        // Add custom context if provided
        const customContext = options.getResourceContext 
          ? options.getResourceContext(req) 
          : {};

        const context: AccessContext = { ...baseContext, ...customContext };

        // Check permission
        const result = await this.can(options.permission, context, options.guards);

        if (!result.granted) {
          return res.status(403).json({ 
            success: false, 
            error: result.reason || 'Access denied' 
          });
        }

        // Attach access result to request
        req.access = result;
        next();
      } catch (error) {
        console.error('Access control error:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Internal server error' 
        });
      }
    };
  }

  // Factory method to create default configuration
  static createDefault(): AccessControlManager {
    const config: AccessControlConfig = {
      defaultRoles: [
        {
          role: UserRole.USER,
          permissions: [
            Permission.READ_OWN_PROFILE,
            Permission.UPDATE_OWN_PROFILE,
            Permission.DELETE_OWN_ACCOUNT,
            Permission.READ_ALL_CONTENT,
            Permission.CREATE_CONTENT,
            Permission.UPDATE_OWN_CONTENT,
            Permission.DELETE_OWN_CONTENT
          ]
        },
        {
          role: UserRole.ADMIN,
          permissions: Object.values(Permission)
        }
      ],
      policies: [],
      guards: [],
      strictMode: true
    };

    return new AccessControlManager(config);
  }
}
