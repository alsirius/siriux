import { InvitationDao, CreateInvitationRequest, InvitationCode } from '../dao/InvitationDao';
import { Logger } from '@siriux/logging';

export interface InvitationResponse {
  success: boolean;
  invitation?: InvitationCode;
  invitations?: InvitationCode[];
  error?: string;
}

export class InvitationService {
  constructor(
    private invitationDao: InvitationDao,
    private logger: Logger
  ) {}

  async createInvitation(invitationData: CreateInvitationRequest, createdBy: string): Promise<InvitationResponse> {
    this.logger.info('Creating new invitation', { usableBy: invitationData.usableBy });
    
    try {
      const createdInvitation = await this.invitationDao.create(invitationData, createdBy);
      this.logger.info('Invitation created successfully', { invitationId: createdInvitation.id, code: createdInvitation.code });

      return {
        success: true,
        invitation: createdInvitation
      };
    } catch (error) {
      this.logger.error('Failed to create invitation', { error: error instanceof Error ? error.message : String(error) });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create invitation'
      };
    }
  }

  async getInvitationById(id: string): Promise<InvitationResponse> {
    this.logger.debug('Getting invitation by ID', { invitationId: id });
    
    const invitation = await this.invitationDao.findById(id);
    if (!invitation) {
      return {
        success: false,
        error: 'Invitation not found'
      };
    }

    return {
      success: true,
      invitation
    };
  }

  async getInvitationByCode(code: string): Promise<InvitationResponse> {
    this.logger.debug('Getting invitation by code', { code });
    
    const invitation = await this.invitationDao.findByCode(code);
    if (!invitation) {
      return {
        success: false,
        error: 'Invitation not found'
      };
    }

    return {
      success: true,
      invitation
    };
  }

  async deleteInvitation(id: string): Promise<InvitationResponse> {
    this.logger.debug('Deleting invitation', { invitationId: id });
    
    const deleted = await this.invitationDao.delete(id);
    if (!deleted) {
      return {
        success: false,
        error: 'Failed to delete invitation'
      };
    }

    this.logger.info('Invitation deleted successfully', { invitationId: id });

    return {
      success: true
    };
  }

  async getAllInvitations(): Promise<InvitationResponse> {
    this.logger.debug('Getting all invitations');
    
    const invitations = await this.invitationDao.findAll();
    
    return {
      success: true,
      invitations
    };
  }

  async markInvitationAsUsed(id: string, usedBy: string): Promise<InvitationResponse> {
    this.logger.info('Marking invitation as used', { invitationId: id, usedBy });
    
    const updatedInvitation = await this.invitationDao.markAsUsed(id, usedBy);
    if (!updatedInvitation) {
      return {
        success: false,
        error: 'Failed to mark invitation as used'
      };
    }

    this.logger.info('Invitation marked as used successfully', { invitationId: id });

    return {
      success: true,
      invitation: updatedInvitation
    };
  }
}
