import { UserRole } from '@siriux/core';

// Permission types
export enum Permission {
  // User permissions
  READ_OWN_PROFILE = 'read:own:profile',
  UPDATE_OWN_PROFILE = 'update:own:profile',
  DELETE_OWN_ACCOUNT = 'delete:own:account',
  
  // Admin permissions
  READ_ALL_USERS = 'read:all:users',
  UPDATE_ALL_USERS = 'update:all:users',
  DELETE_ALL_USERS = 'delete:all:users',
  MANAGE_ROLES = 'manage:roles',
  
  // Content permissions
  READ_ALL_CONTENT = 'read:all:content',
  CREATE_CONTENT = 'create:content',
  UPDATE_OWN_CONTENT = 'update:own:content',
  UPDATE_ALL_CONTENT = 'update:all:content',
  DELETE_OWN_CONTENT = 'delete:own:content',
  DELETE_ALL_CONTENT = 'delete:all:content',
  
  // System permissions
  READ_SYSTEM_LOGS = 'read:system:logs',
  MANAGE_SYSTEM = 'manage:system',
  VIEW_ANALYTICS = 'view:analytics'
}

// Resource types
export enum ResourceType {
  USER = 'user',
  CONTENT = 'content',
  SYSTEM = 'system',
  ANALYTICS = 'analytics'
}

// Action types
export enum ActionType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage'
}

// Policy interface
export interface Policy {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  conditions?: PolicyCondition[];
}

// Policy conditions
export interface PolicyCondition {
  field: string;
  operator: 'eq' | 'ne' | 'in' | 'nin' | 'gt' | 'gte' | 'lt' | 'lte';
  value: any;
}

// Role definition with permissions
export interface RoleDefinition {
  role: UserRole;
  permissions: Permission[];
  policies?: string[];
}

// Access control context
export interface AccessContext {
  userId: string;
  userRole: UserRole;
  resourceId?: string;
  resourceType?: ResourceType;
  action?: ActionType;
  ip?: string;
  requiredRole?: UserRole;
  resourceState?: string;
  context?: Record<string, any>;
}

// Access request
export interface AccessRequest {
  permission: Permission;
  context: AccessContext;
}

// Access result
export interface AccessResult {
  granted: boolean;
  reason?: string;
  policy?: string;
}

// Resource interface
export interface Resource {
  id: string;
  type: ResourceType;
  ownerId?: string;
  attributes: Record<string, any>;
}

// Guard interface
export interface Guard {
  name: string;
  check: (request: AccessRequest) => AccessResult | Promise<AccessResult>;
}

// Policy engine interface
export interface PolicyEngine {
  evaluate: (request: AccessRequest) => AccessResult | Promise<AccessResult>;
  addPolicy: (policy: Policy) => void;
  removePolicy: (policyId: string) => void;
  getPolicies: () => Policy[];
}

// Role manager interface
export interface RoleManager {
  getRolePermissions: (role: UserRole) => Permission[];
  assignRole: (userId: string, role: UserRole) => void;
  removeRole: (userId: string, role: UserRole) => void;
  getUserRoles: (userId: string) => UserRole[];
}

// Access control configuration
export interface AccessControlConfig {
  defaultRoles: RoleDefinition[];
  policies: Policy[];
  guards: Guard[];
  strictMode?: boolean;
}

// Middleware options
export interface AccessControlMiddlewareOptions {
  resourceType: ResourceType;
  action: ActionType;
  resourceIdParam?: string;
  checkOwnership?: boolean;
  customGuards?: string[];
}

// Express middleware request extension
export interface AccessControlRequest {
  user?: {
    id: string;
    role: UserRole;
    permissions: Permission[];
  };
  resource?: Resource;
  access?: AccessResult;
}
