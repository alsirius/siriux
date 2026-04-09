'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  KeyRound,
  CheckCircle,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function RolesManagementDashboard() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access',
      permissions: ['users.create', 'users.delete', 'users.update', 'roles.manage', 'system.configure'],
      userCount: 3
    },
    {
      id: '2',
      name: 'User',
      description: 'Standard user access',
      permissions: ['content.view', 'content.create'],
      userCount: 15
    },
    {
      id: '3',
      name: 'Moderator',
      description: 'Content moderation access',
      permissions: ['content.view', 'content.create', 'content.moderate', 'users.view'],
      userCount: 5
    }
  ]);

  const [permissions, setPermissions] = useState<Permission[]>([
    { id: 'users.create', name: 'Create Users', description: 'Create new user accounts', category: 'Users' },
    { id: 'users.delete', name: 'Delete Users', description: 'Remove user accounts', category: 'Users' },
    { id: 'users.update', name: 'Update Users', description: 'Modify user information', category: 'Users' },
    { id: 'users.view', name: 'View Users', description: 'View user information', category: 'Users' },
    { id: 'roles.manage', name: 'Manage Roles', description: 'Create and modify roles', category: 'Roles' },
    { id: 'system.configure', name: 'System Configuration', description: 'Configure system settings', category: 'System' },
    { id: 'content.view', name: 'View Content', description: 'View content', category: 'Content' },
    { id: 'content.create', name: 'Create Content', description: 'Create new content', category: 'Content' },
    { id: 'content.moderate', name: 'Moderate Content', description: 'Moderate user content', category: 'Content' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddRole, setShowAddRole] = useState(false);
  const [showPermissionManager, setShowPermissionManager] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // New role form state
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // TODO: Implement actual add role API call
      console.log('Adding role:', newRole);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const addedRole: Role = {
        id: String(roles.length + 1),
        ...newRole,
        userCount: 0
      };
      
      setRoles([...roles, addedRole]);
      setSuccess('Role added successfully!');
      setNewRole({ name: '', description: '', permissions: [] });
      setShowAddRole(false);
    } catch (err) {
      setError('Failed to add role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to remove this role? This may affect users assigned to this role.')) return;
    
    setError('');
    try {
      // TODO: Implement actual remove role API call
      console.log('Removing role:', roleId);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRoles(roles.filter(role => role.id !== roleId));
      setSuccess('Role removed successfully!');
    } catch (err) {
      setError('Failed to remove role');
    }
  };

  const handleTogglePermission = (permissionId: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const getPermissionCount = (category: string) => {
    return permissions.filter(p => p.category === category).length;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Shield className="mr-2 h-6 w-6" />
            Roles & Permissions Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">{success}</span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowPermissionManager(true)}
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Manage Permissions
              </Button>
              <Button onClick={() => setShowAddRole(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </div>
          </div>

          {showAddRole && (
            <Card className="mb-6 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Add New Role</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddRole(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddRole} className="space-y-4">
                  <div>
                    <Label htmlFor="roleName">Role Name *</Label>
                    <Input
                      id="roleName"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="roleDescription">Description *</Label>
                    <Input
                      id="roleDescription"
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>Permissions</Label>
                    <div className="mt-2 space-y-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                      {['Users', 'Roles', 'System', 'Content'].map(category => (
                        <div key={category}>
                          <h4 className="font-medium text-sm text-gray-700 mb-2">
                            {category} ({getPermissionCount(category)})
                          </h4>
                          <div className="space-y-2 pl-2">
                            {permissions
                              .filter(p => p.category === category)
                              .map(permission => (
                                <label key={permission.id} className="flex items-center space-x-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={newRole.permissions.includes(permission.id)}
                                    onChange={() => handleTogglePermission(permission.id)}
                                    className="rounded border-gray-300"
                                  />
                                  <span>{permission.name}</span>
                                </label>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddRole(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Role
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">{role.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {role.permissions.length} permissions
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{role.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {role.userCount} users
                        </span>
                        <span className="flex items-center">
                          <KeyRound className="h-4 w-4 mr-1" />
                          {role.permissions.slice(0, 3).join(', ')}
                          {role.permissions.length > 3 && '...'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRole(role.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRoles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No roles found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      {showPermissionManager && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center">
                <KeyRound className="mr-2 h-5 w-5" />
                Permission Manager
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowPermissionManager(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Users', 'Roles', 'System', 'Content'].map(category => (
                <div key={category}>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    {category} ({getPermissionCount(category)})
                  </h4>
                  <div className="grid gap-2 pl-2">
                    {permissions
                      .filter(p => p.category === category)
                      .map(permission => (
                        <Card key={permission.id} className="p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-medium text-sm">{permission.name}</h5>
                              <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
              
              <Button className="w-full mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add New Permission
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
