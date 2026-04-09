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
  private invitations: InvitationCode[] = [];
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
    
    // Initialize with sample data
    this.invitations = [
      {
        id: '1',
        code: 'SIRIUX-2024-ABC123',
        createdBy: 'admin',
        createdAt: new Date('2024-01-15'),
        usedBy: null,
        usedAt: null,
        usableBy: 'anyone',
        status: 'active'
      }
    ];
  }

  public async findById(id: string): Promise<InvitationCode | null> {
    this.logger.debug('Finding invitation by ID', { invitationId: id });
    const invitation = this.invitations.find(i => i.id === id);
    return invitation || null;
  }

  public async findByCode(code: string): Promise<InvitationCode | null> {
    this.logger.debug('Finding invitation by code', { code });
    const invitation = this.invitations.find(i => i.code === code);
    return invitation || null;
  }

  public async create(invitationData: CreateInvitationRequest, createdBy: string): Promise<InvitationCode> {
    this.logger.info('Creating invitation', { usableBy: invitationData.usableBy });
    
    const newInvitation: InvitationCode = {
      id: Math.random().toString(36).substr(2, 9),
      code: `SIRIUX-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      createdBy,
      createdAt: new Date(),
      usedBy: null,
      usedAt: null,
      usableBy: invitationData.usableBy,
      status: 'active'
    };

    this.invitations.push(newInvitation);
    this.logger.info('Invitation created successfully', { invitationId: newInvitation.id, code: newInvitation.code });
    
    return newInvitation;
  }

  public async update(id: string, updates: Partial<InvitationCode>): Promise<InvitationCode | null> {
    this.logger.debug('Updating invitation', { invitationId: id, updates });
    
    const invitationIndex = this.invitations.findIndex(i => i.id === id);
    if (invitationIndex === -1) {
      this.logger.warn('Invitation not found for update', { invitationId: id });
      return null;
    }

    const currentInvitation = this.invitations[invitationIndex];
    if (!currentInvitation) {
      this.logger.warn('Invitation not found for update', { invitationId: id });
      return null;
    }

    this.invitations[invitationIndex] = {
      id: currentInvitation.id,
      code: updates.code ?? currentInvitation.code,
      createdBy: currentInvitation.createdBy,
      createdAt: currentInvitation.createdAt,
      usedBy: updates.usedBy ?? currentInvitation.usedBy,
      usedAt: updates.usedAt ?? currentInvitation.usedAt,
      usableBy: updates.usableBy ?? currentInvitation.usableBy,
      status: updates.status ?? currentInvitation.status
    };

    this.logger.info('Invitation updated successfully', { invitationId: id });
    return this.invitations[invitationIndex];
  }

  public async delete(id: string): Promise<boolean> {
    this.logger.debug('Deleting invitation', { invitationId: id });
    
    const invitationIndex = this.invitations.findIndex(i => i.id === id);
    if (invitationIndex === -1) {
      this.logger.warn('Invitation not found for deletion', { invitationId: id });
      return false;
    }

    this.invitations.splice(invitationIndex, 1);
    this.logger.info('Invitation deleted successfully', { invitationId: id });
    return true;
  }

  public async findAll(): Promise<InvitationCode[]> {
    this.logger.debug('Finding all invitations');
    return this.invitations;
  }

  public async markAsUsed(id: string, usedBy: string): Promise<InvitationCode | null> {
    this.logger.info('Marking invitation as used', { invitationId: id, usedBy });
    
    return this.update(id, {
      usedBy,
      usedAt: new Date(),
      status: 'used'
    });
  }
}
