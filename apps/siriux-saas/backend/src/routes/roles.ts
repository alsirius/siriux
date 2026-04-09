import { Router, Request, Response } from 'express';
import { RoleService } from '../services/RoleService';

export function createRoleRoutes(roleService: RoleService): Router {
  const router = Router();

  // Get all roles
  router.get('/', async (_req: Request, res: Response) => {
    try {
      const response = await roleService.getAllRoles();
      
      if (response.success) {
        return res.json({ roles: response.roles });
      } else {
        return res.status(500).json({ error: response.error });
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get role by ID
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Role ID is required' });
      }
      
      const response = await roleService.getRoleById(id);
      
      if (response.success) {
        return res.json({ role: response.role });
      } else {
        return res.status(404).json({ error: response.error });
      }
    } catch (error) {
      console.error('Error fetching role:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Create new role
  router.post('/', async (req: Request, res: Response) => {
    try {
      const { name, description, permissions } = req.body;
      
      if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
      }

      const response = await roleService.createRole({
        name,
        description,
        permissions: permissions || []
      });
      
      if (response.success) {
        return res.status(201).json({ role: response.role });
      } else {
        return res.status(400).json({ error: response.error });
      }
    } catch (error) {
      console.error('Error creating role:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Update role
  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Role ID is required' });
      }
      
      const updates = req.body;
      
      const response = await roleService.updateRole(id, updates);
      
      if (response.success) {
        return res.json({ role: response.role });
      } else {
        return res.status(404).json({ error: response.error });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete role
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'Role ID is required' });
      }
      
      const response = await roleService.deleteRole(id);
      
      if (response.success) {
        return res.json({ message: 'Role deleted successfully' });
      } else {
        return res.status(404).json({ error: response.error });
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
