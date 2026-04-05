// Core exports
export * from './types';

// Main classes
export { AccessControlManager } from './AccessControlManager';
export { DefaultPolicyEngine } from './policies/PolicyEngine';

// Guards
export {
  OwnershipGuard,
  TimeGuard,
  IPGuard,
  RoleGuard,
  ResourceStateGuard,
  createCustomGuard,
  GuardRegistry
} from './guards';

// Version information
export const SIRIUX_ACCESS_CONTROL_VERSION = '1.0.0';
