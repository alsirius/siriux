import { RoleDao, CreateRoleRequest, Role } from '../dao/RoleDao';
import { Logger } from '@siriux/logging';

export interface RoleResponse {
  success: boolean;
  role?: Role;
  roles?: Role[];
  error?: string;
}

export class RoleService {
  constructor(
    private roleDao: RoleDao,
    private logger: Logger
  ) {}

  async createRole(roleData: CreateRoleRequest): Promise<RoleResponse> {
    this.logger.info('Creating new role', { name: roleData.name });
    
    try {
      const createdRole = await this.roleDao.create(roleData);
      this.logger.info('Role created successfully', { roleId: createdRole.id });

      return {
        success: true,
        role: createdRole
      };
    } catch (error) {
      this.logger.error('Failed to create role', { error: error instanceof Error ? error.message : String(error) });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create role'
      };
    }
  }

  async getRoleById(id: string): Promise<RoleResponse> {
    this.logger.debug('Getting role by ID', { roleId: id });
    
    const role = await this.roleDao.findById(id);
    if (!role) {
      return {
        success: false,
        error: 'Role not found'
      };
    }

    return {
      success: true,
      role
    };
  }

  async getRoleByName(name: string): Promise<RoleResponse> {
    this.logger.debug('Getting role by name', { roleName: name });
    
    const role = await this.roleDao.findByName(name);
    if (!role) {
      return {
        success: false,
        error: 'Role not found'
      };
    }

    return {
      success: true,
      role
    };
  }

  async updateRole(id: string, updates: Partial<Role>): Promise<RoleResponse> {
    this.logger.debug('Updating role', { roleId: id, updates });
    
    const updatedRole = await this.roleDao.update(id, updates);
    if (!updatedRole) {
      return {
        success: false,
        error: 'Failed to update role'
      };
    }

    this.logger.info('Role updated successfully', { roleId: id });

    return {
      success: true,
      role: updatedRole
    };
  }

  async deleteRole(id: string): Promise<RoleResponse> {
    this.logger.debug('Deleting role', { roleId: id });
    
    const deleted = await this.roleDao.delete(id);
    if (!deleted) {
      return {
        success: false,
        error: 'Failed to delete role'
      };
    }

    this.logger.info('Role deleted successfully', { roleId: id });

    return {
      success: true
    };
  }

  async getAllRoles(): Promise<RoleResponse> {
    this.logger.debug('Getting all roles');
    
    const roles = await this.roleDao.findAll();
    
    return {
      success: true,
      roles
    };
  }
}
