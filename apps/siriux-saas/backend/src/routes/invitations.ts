import { Router, Request, Response } from 'express';
import { InvitationService } from '../services/InvitationService';

export function createInvitationRoutes(invitationService: InvitationService): Router {
  const router = Router();

  // Get all invitations
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const response = await invitationService.getAllInvitations();
      
      if (response.success) {
        return res.json({ invitations: response.invitations });
      } else {
        return res.status(500).json({ error: response.error });
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get invitation by ID
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Invitation ID is required' });
      }
      
      const response = await invitationService.getInvitationById(id);
      
      if (response.success) {
        return res.json({ invitation: response.invitation });
      } else {
        return res.status(404).json({ error: response.error });
      }
    } catch (error) {
      console.error('Error fetching invitation:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create new invitation
  router.post('/', async (req: Request, res: Response) => {
    try {
      const { usableBy, sendEmail } = req.body;
      const createdBy = req.headers['x-user-id'] as string || 'unknown';
      
      if (!usableBy) {
        return res.status(400).json({ error: 'UsableBy field is required' });
      }

      const response = await invitationService.createInvitation(
        { usableBy, sendEmail },
        createdBy
      );
      
      if (response.success) {
        return res.status(201).json({ invitation: response.invitation });
      } else {
        return res.status(400).json({ error: response.error });
      }
    } catch (error) {
      console.error('Error creating invitation:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Mark invitation as used
  router.post('/:id/use', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { usedBy } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'Invitation ID is required' });
      }
      
      if (!usedBy) {
        return res.status(400).json({ error: 'UsedBy field is required' });
      }
      
      const response = await invitationService.markInvitationAsUsed(id, usedBy);
      
      if (response.success) {
        return res.json({ invitation: response.invitation });
      } else {
        return res.status(404).json({ error: response.error });
      }
    } catch (error) {
      console.error('Error marking invitation as used:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete invitation
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Invitation ID is required' });
      }
      
      const response = await invitationService.deleteInvitation(id);
      
      if (response.success) {
        return res.json({ message: 'Invitation deleted successfully' });
      } else {
        return res.status(404).json({ error: response.error });
      }
    } catch (error) {
      console.error('Error deleting invitation:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
