import { Logger } from '@siriux/logging';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

export interface RoleDao {
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  create(roleData: CreateRoleRequest): Promise<Role>;
  update(id: string, updates: Partial<Role>): Promise<Role | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Role[]>;
}

export class RoleDaoImpl implements RoleDao {
  private roles: Role[] = [];
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
    
    // Initialize with default roles
    this.roles = [
      {
        id: '1',
        name: 'admin',
        description: 'Full system access',
        permissions: ['*'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'user',
        description: 'Standard user access',
        permissions: ['read:own', 'update:own'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '3',
        name: 'manager',
        description: 'Team management access',
        permissions: ['read:own', 'update:own', 'read:team', 'update:team'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
    ];
  }

  public async findById(id: string): Promise<Role | null> {
    this.logger.debug('Finding role by ID', { roleId: id });
    const role = this.roles.find(r => r.id === id);
    return role || null;
  }

  public async findByName(name: string): Promise<Role | null> {
    this.logger.debug('Finding role by name', { roleName: name });
    const role = this.roles.find(r => r.name === name);
    return role || null;
  }

  public async create(roleData: CreateRoleRequest): Promise<Role> {
    this.logger.info('Creating role', { roleName: roleData.name });
    
    // Check if role already exists
    const existingRole = await this.findByName(roleData.name);
    if (existingRole) {
      throw new Error('Role with this name already exists');
    }

    const newRole: Role = {
      id: Math.random().toString(36).substr(2, 9),
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.roles.push(newRole);
    this.logger.info('Role created successfully', { roleId: newRole.id });
    
    return newRole;
  }

  public async update(id: string, updates: Partial<Role>): Promise<Role | null> {
    this.logger.debug('Updating role', { roleId: id, updates });
    
    const roleIndex = this.roles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      this.logger.warn('Role not found for update', { roleId: id });
      return null;
    }

    const currentRole = this.roles[roleIndex];
    if (!currentRole) {
      this.logger.warn('Role not found for update', { roleId: id });
      return null;
    }

    this.roles[roleIndex] = {
      id: currentRole.id,
      name: updates.name ?? currentRole.name,
      description: updates.description ?? currentRole.description,
      permissions: updates.permissions ?? currentRole.permissions,
      createdAt: currentRole.createdAt,
      updatedAt: new Date()
    };

    this.logger.info('Role updated successfully', { roleId: id });
    return this.roles[roleIndex];
  }

  public async delete(id: string): Promise<boolean> {
    this.logger.debug('Deleting role', { roleId: id });
    
    const roleIndex = this.roles.findIndex(r => r.id === id);
    if (roleIndex === -1) {
      this.logger.warn('Role not found for deletion', { roleId: id });
      return false;
    }

    this.roles.splice(roleIndex, 1);
    this.logger.info('Role deleted successfully', { roleId: id });
    return true;
  }

  public async findAll(): Promise<Role[]> {
    this.logger.debug('Finding all roles');
    return this.roles;
  }
}
