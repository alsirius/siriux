import { PostgresDatabase, getPostgresConfig } from '@siriux/core';
import { Logger } from '@siriux/logging';

export interface InvitationCode {
  id: string;
  code: string;
  createdBy: string;
  createdAt: Date;
  usedBy: string | null;
  usedAt: Date | null;
  usableBy: string; // 'anyone' or specific email
  status: 'active' | 'used' | 'expired';
}

export interface CreateInvitationRequest {
  usableBy: string;
  sendEmail?: boolean;
}

export interface InvitationDao {
  findById(id: string): Promise<InvitationCode | null>;
  findByCode(code: string): Promise<InvitationCode | null>;
  create(invitationData: CreateInvitationRequest, createdBy: string): Promise<InvitationCode>;
  update(id: string, updates: Partial<InvitationCode>): Promise<InvitationCode | null>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<InvitationCode[]>;
  markAsUsed(id: string, usedBy: string): Promise<InvitationCode | null>;
}

export class InvitationDaoImpl implements InvitationDao {
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

  public async findById(id: string): Promise<InvitationCode | null> {
    this.logger.debug('Finding invitation by ID', { invitationId: id });
    await this.ensureInitialized();
    
    const invitation = await this.database.getInvitationById(id);
    if (!invitation) {
      return null;
    }

    return this.mapToInvitationCode(invitation);
  }

  public async findByCode(code: string): Promise<InvitationCode | null> {
    this.logger.debug('Finding invitation by code', { code });
    await this.ensureInitialized();
    
    const invitation = await this.database.getInvitationByCode(code);
    if (!invitation) {
      return null;
    }

    return this.mapToInvitationCode(invitation);
  }

  public async create(invitationData: CreateInvitationRequest, createdBy: string): Promise<InvitationCode> {
    this.logger.info('Creating invitation', { usableBy: invitationData.usableBy });
    await this.ensureInitialized();
    
    const createdInvitation = await this.database.createInvitation(invitationData, createdBy);

    this.logger.info('Invitation created successfully', { invitationId: createdInvitation.id, code: createdInvitation.code });
    
    return this.mapToInvitationCode(createdInvitation);
  }

  public async update(id: string, updates: Partial<InvitationCode>): Promise<InvitationCode | null> {
    this.logger.debug('Updating invitation', { invitationId: id, updates });
    await this.ensureInitialized();
    
    const updatedInvitation = await this.database.updateInvitation(id, updates);
    if (!updatedInvitation) {
      this.logger.warn('Invitation not found for update', { invitationId: id });
      return null;
    }

    this.logger.info('Invitation updated successfully', { invitationId: id });
    return this.mapToInvitationCode(updatedInvitation);
  }

  public async delete(id: string): Promise<boolean> {
    this.logger.debug('Deleting invitation', { invitationId: id });
    await this.ensureInitialized();
    
    const deleted = await this.database.deleteInvitation(id);
    if (!deleted) {
      this.logger.warn('Invitation not found for deletion', { invitationId: id });
      return false;
    }

    this.logger.info('Invitation deleted successfully', { invitationId: id });
    return true;
  }

  public async findAll(): Promise<InvitationCode[]> {
    this.logger.debug('Finding all invitations');
    await this.ensureInitialized();
    
    const invitations = await this.database.getAllInvitations();
    return invitations.map((invitation: any) => this.mapToInvitationCode(invitation));
  }

  public async markAsUsed(id: string, usedBy: string): Promise<InvitationCode | null> {
    this.logger.info('Marking invitation as used', { invitationId: id, usedBy });
    await this.ensureInitialized();
    
    const markedInvitation = await this.database.markInvitationAsUsed(id, usedBy);
    if (!markedInvitation) {
      return null;
    }

    return this.mapToInvitationCode(markedInvitation);
  }

  private mapToInvitationCode(dbInvitation: any): InvitationCode {
    return {
      id: dbInvitation.id,
      code: dbInvitation.code,
      createdBy: dbInvitation.created_by,
      createdAt: new Date(dbInvitation.created_at),
      usedBy: dbInvitation.used_by,
      usedAt: dbInvitation.used_at ? new Date(dbInvitation.used_at) : null,
      usableBy: dbInvitation.usable_by,
      status: dbInvitation.status
    };
  }
}

// Factory function to create InvitationDao with PostgreSQL
export const createInvitationDao = async (logger: Logger): Promise<InvitationDaoImpl> => {
  const config = getPostgresConfig();
  const database = new PostgresDatabase(config);
  return new InvitationDaoImpl(database, logger);
};
