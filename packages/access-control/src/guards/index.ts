import { Guard, AccessRequest, AccessResult, AccessContext } from '../types';

// Ownership guard - checks if user owns the resource
export const OwnershipGuard: Guard = {
  name: 'ownership',
  check: (request: AccessRequest): AccessResult => {
    const { userId } = request.context;
    const { resourceId } = request.context;

    if (!resourceId) {
      return {
        granted: false,
        reason: 'No resource ID provided for ownership check'
      };
    }

    // In a real implementation, this would check the database
    // For now, we'll assume the resource ID contains the owner ID
    const isOwner = resourceId.includes(`owner:${userId}`);

    return {
      granted: isOwner,
      reason: isOwner ? 'User owns the resource' : 'User does not own the resource'
    };
  }
};

// Time-based guard - checks if access is within allowed time windows
export const TimeGuard: Guard = {
  name: 'time',
  check: (request: AccessRequest): AccessResult => {
    const now = new Date();
    const hour = now.getHours();

    // Allow access during business hours (9 AM - 6 PM)
    const isBusinessHours = hour >= 9 && hour <= 18;

    return {
      granted: isBusinessHours,
      reason: isBusinessHours ? 'Access within business hours' : 'Access outside business hours'
    };
  }
};

// IP-based guard - checks if access is from allowed IP addresses
export const IPGuard: Guard = {
  name: 'ip',
  check: (request: AccessRequest): AccessResult => {
    const clientIP = request.context?.ip;
    
    if (!clientIP) {
      return {
        granted: false,
        reason: 'No IP address provided'
      };
    }

    // In a real implementation, this would check against a whitelist
    const allowedIPs = ['127.0.0.1', '::1']; // localhost
    const isAllowed = allowedIPs.includes(clientIP);

    return {
      granted: isAllowed,
      reason: isAllowed ? 'IP address allowed' : 'IP address not allowed'
    };
  }
};

// Role-based guard - checks if user has required role
export const RoleGuard: Guard = {
  name: 'role',
  check: (request: AccessRequest): AccessResult => {
    const { userRole } = request.context;
    const requiredRole = request.context?.requiredRole;

    if (!requiredRole) {
      return { granted: true };
    }

    const roleHierarchy = {
      'admin': 3,
      'manager': 2,
      'user': 1
    };

    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    const hasRequiredRole = userLevel >= requiredLevel;

    return {
      granted: hasRequiredRole,
      reason: hasRequiredRole ? 'Role requirement satisfied' : 'Insufficient role level'
    };
  }
};

// Resource state guard - checks if resource is in a state that allows access
export const ResourceStateGuard: Guard = {
  name: 'resource-state',
  check: (request: AccessRequest): AccessResult => {
    const resourceState = request.context?.resourceState;

    if (!resourceState) {
      return { granted: true };
    }

    // Define states that allow different actions
    const allowedStates: Record<string, string[]> = {
      'read': ['active', 'archived', 'draft'],
      'update': ['active', 'draft'],
      'delete': ['active', 'draft'],
      'create': []
    };

    const action = request.context?.action || 'read';
    const allowedStatesForAction = allowedStates[action] || [];
    
    const isAllowed = allowedStatesForAction.includes(resourceState);

    return {
      granted: isAllowed,
      reason: isAllowed ? 'Resource state allows action' : 'Resource state does not allow action'
    };
  }
};

// Custom guard factory for creating dynamic guards
export function createCustomGuard(
  name: string,
  checkFunction: (request: AccessRequest) => AccessResult | Promise<AccessResult>
): Guard {
  return {
    name,
    check: checkFunction
  };
}

// Guard registry for managing multiple guards
export class GuardRegistry {
  private guards: Map<string, Guard> = new Map();

  constructor() {
    // Register default guards
    this.register(OwnershipGuard);
    this.register(TimeGuard);
    this.register(IPGuard);
    this.register(RoleGuard);
    this.register(ResourceStateGuard);
  }

  register(guard: Guard): void {
    this.guards.set(guard.name, guard);
  }

  unregister(guardName: string): void {
    this.guards.delete(guardName);
  }

  get(guardName: string): Guard | undefined {
    return this.guards.get(guardName);
  }

  getAll(): Guard[] {
    return Array.from(this.guards.values());
  }

  async evaluateGuards(guardNames: string[], request: AccessRequest): Promise<AccessResult> {
    for (const guardName of guardNames) {
      const guard = this.get(guardName);
      if (!guard) {
        return {
          granted: false,
          reason: `Guard not found: ${guardName}`
        };
      }

      const result = await guard.check(request);
      if (!result.granted) {
        return result;
      }
    }

    return { granted: true };
  }
}
