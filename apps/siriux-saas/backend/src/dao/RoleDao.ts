import { PostgresDatabase, getPostgresConfig } from '@siriux/core';
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
  private database: PostgresDatabase;
  private logger: Logger;
  private initialized: boolean = false;

  constructor(database: PostgresDatabase, logger: Logger) {
    this.database = database;
    this.logger = logger;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      try {
        await this.database.initialize();
        this.initialized = true;
      } catch (error) {
        this.logger.error('Failed to initialize database', { error: error instanceof Error ? error.message : String(error) });
        throw error;
      }
    }
  }

  public async findById(id: string): Promise<Role | null> {
    this.logger.debug('Finding role by ID', { roleId: id });
    await this.ensureInitialized();
    
    const role = await this.database.getRoleById(id);
    if (!role) {
      return null;
    }

    return this.mapToRole(role);
  }

  public async findByName(name: string): Promise<Role | null> {
    this.logger.debug('Finding role by name', { roleName: name });
    await this.ensureInitialized();
    
    const role = await this.database.getRoleByName(name);
    if (!role) {
      return null;
    }

    return this.mapToRole(role);
  }

  public async create(roleData: CreateRoleRequest): Promise<Role> {
    this.logger.info('Creating role', { roleName: roleData.name });
    await this.ensureInitialized();
    
    // Check if role already exists
    const existingRole = await this.findByName(roleData.name);
    if (existingRole) {
      throw new Error('Role with this name already exists');
    }

    const createdRole = await this.database.createRole(roleData);

    this.logger.info('Role created successfully', { roleId: createdRole.id });
    
    return this.mapToRole(createdRole);
  }

  public async update(id: string, updates: Partial<Role>): Promise<Role | null> {
    this.logger.debug('Updating role', { roleId: id, updates });
    await this.ensureInitialized();
    
    const updatedRole = await this.database.updateRole(id, updates);
    if (!updatedRole) {
      this.logger.warn('Role not found for update', { roleId: id });
      return null;
    }

    this.logger.info('Role updated successfully', { roleId: id });
    return this.mapToRole(updatedRole);
  }

  public async delete(id: string): Promise<boolean> {
    this.logger.debug('Deleting role', { roleId: id });
    await this.ensureInitialized();
    
    const deleted = await this.database.deleteRole(id);
    if (!deleted) {
      this.logger.warn('Role not found for deletion', { roleId: id });
      return false;
    }

    this.logger.info('Role deleted successfully', { roleId: id });
    return true;
  }

  public async findAll(): Promise<Role[]> {
    this.logger.debug('Finding all roles');
    await this.ensureInitialized();
    
    const roles = await this.database.getAllRoles();
    return roles.map((role: any) => this.mapToRole(role));
  }

  private mapToRole(dbRole: any): Role {
    return {
      id: dbRole.id,
      name: dbRole.name,
      description: dbRole.description,
      permissions: Array.isArray(dbRole.permissions) ? dbRole.permissions : JSON.parse(dbRole.permissions || '[]'),
      createdAt: new Date(dbRole.created_at),
      updatedAt: new Date(dbRole.updated_at)
    };
  }
}

// Factory function to create RoleDao with PostgreSQL
export const createRoleDao = async (logger: Logger): Promise<RoleDaoImpl> => {
  const config = getPostgresConfig();
  const database = new PostgresDatabase(config);
  return new RoleDaoImpl(database, logger);
};
