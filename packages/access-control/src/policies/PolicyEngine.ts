import { Policy, PolicyEngine, AccessRequest, AccessResult, PolicyCondition } from '../types';

export class DefaultPolicyEngine implements PolicyEngine {
  private policies: Map<string, Policy> = new Map();

  constructor(policies: Policy[] = []) {
    policies.forEach(policy => this.addPolicy(policy));
  }

  evaluate(request: AccessRequest): AccessResult {
    const userPermissions = this.getUserPermissions(request.context.userRole);
    
    // Check if user has the required permission
    if (!userPermissions.includes(request.permission)) {
      return {
        granted: false,
        reason: `User does not have permission: ${request.permission}`
      };
    }

    // Evaluate policies
    for (const policy of this.policies.values()) {
      if (!policy.permissions.includes(request.permission)) {
        continue;
      }

      const result = this.evaluatePolicy(policy, request);
      if (!result.granted) {
        return result;
      }
    }

    return { granted: true };
  }

  addPolicy(policy: Policy): void {
    this.policies.set(policy.id, policy);
  }

  removePolicy(policyId: string): void {
    this.policies.delete(policyId);
  }

  getPolicies(): Policy[] {
    return Array.from(this.policies.values());
  }

  private getUserPermissions(role: string): string[] {
    // This would typically come from a role manager
    // For now, return basic role permissions
    switch (role) {
      case 'admin':
        return Object.values(require('../types').Permission);
      case 'user':
        return [
          require('../types').Permission.READ_OWN_PROFILE,
          require('../types').Permission.UPDATE_OWN_PROFILE,
          require('../types').Permission.DELETE_OWN_ACCOUNT,
          require('../types').Permission.READ_ALL_CONTENT,
          require('../types').Permission.CREATE_CONTENT,
          require('../types').Permission.UPDATE_OWN_CONTENT,
          require('../types').Permission.DELETE_OWN_CONTENT
        ];
      default:
        return [];
    }
  }

  private evaluatePolicy(policy: Policy, request: AccessRequest): AccessResult {
    if (!policy.conditions || policy.conditions.length === 0) {
      return { granted: true, policy: policy.id };
    }

    for (const condition of policy.conditions) {
      if (!this.evaluateCondition(condition, request.context)) {
        return {
          granted: false,
          reason: `Policy condition failed: ${policy.name}`,
          policy: policy.id
        };
      }
    }

    return { granted: true, policy: policy.id };
  }

  private evaluateCondition(condition: PolicyCondition, context: any): boolean {
    const fieldValue = this.getFieldValue(context, condition.field);
    
    switch (condition.operator) {
      case 'eq':
        return fieldValue === condition.value;
      case 'ne':
        return fieldValue !== condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      case 'nin':
        return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
      case 'gt':
        return fieldValue > condition.value;
      case 'gte':
        return fieldValue >= condition.value;
      case 'lt':
        return fieldValue < condition.value;
      case 'lte':
        return fieldValue <= condition.value;
      default:
        return false;
    }
  }

  private getFieldValue(context: any, field: string): any {
    return field.split('.').reduce((obj, key) => obj?.[key], context);
  }
}
