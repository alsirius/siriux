'use client';

import NavBar from '@/components/NavBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Copy, Trash2, Mail, Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface InvitationCode {
  id: string;
  code: string;
  createdBy: string;
  createdAt: string;
  usedBy: string | null;
  usedAt: string | null;
  usableBy: string;
  status: 'active' | 'used' | 'expired';
}

export default function AdminInvitationsPage() {
  const [codes, setCodes] = useState<InvitationCode[]>([
    {
      id: '1',
      code: 'SIRIUX-2024-ABC123',
      createdBy: 'Admin',
      createdAt: '2024-01-15T10:00:00Z',
      usedBy: null,
      usedAt: null,
      usableBy: 'anyone',
      status: 'active'
    },
    {
      id: '2',
      code: 'SIRIUX-2024-XYZ789',
      createdBy: 'Admin',
      createdAt: '2024-01-14T14:30:00Z',
      usedBy: 'john@example.com',
      usedAt: '2024-01-15T09:15:00Z',
      usableBy: 'anyone',
      status: 'used'
    }
  ]);

  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [newCodeEmail, setNewCodeEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implement actual API call
      console.log('Generating code for:', newCodeEmail || 'anyone');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCode: InvitationCode = {
        id: String(codes.length + 1),
        code: `SIRIUX-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        createdBy: 'Admin',
        createdAt: new Date().toISOString(),
        usedBy: null,
        usedAt: null,
        usableBy: newCodeEmail || 'anyone',
        status: 'active'
      };
      
      setCodes([newCode, ...codes]);
      setSuccess(`New code generated: ${newCode.code}`);
      setNewCodeEmail('');
      setShowGenerateForm(false);
    } catch (err) {
      setError('Failed to generate code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCode = async (codeId: string) => {
    if (!confirm('Are you sure you want to delete this code?')) return;
    
    try {
      // TODO: Implement actual API call
      console.log('Deleting code:', codeId);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCodes(codes.filter(code => code.id !== codeId));
      setSuccess('Code deleted successfully');
    } catch (err) {
      setError('Failed to delete code');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setSuccess('Code copied to clipboard');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <NavBar />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invitation Codes</h1>
              <p className="text-gray-600 mt-2">Generate and manage registration invitation codes.</p>
            </div>
            <Button onClick={() => setShowGenerateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Generate Code
            </Button>
          </div>

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

          {showGenerateForm && (
            <Card className="mb-6 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Generate New Invitation Code</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerateCode} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Restrict to Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCodeEmail}
                      onChange={(e) => setNewCodeEmail(e.target.value)}
                      placeholder="Leave empty for anyone to use"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      If specified, only this email address can use the code.
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button type="submit" disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <KeyRound className="mr-2 h-4 w-4" />
                          Generate Code
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowGenerateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Active Invitation Codes</CardTitle>
            </CardHeader>
            <CardContent>
              {codes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No invitation codes found. Generate one to get started.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Code</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Usable By</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Created By</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Used By</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {codes.map((code) => (
                        <tr key={code.id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                {code.code}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyCode(code.code)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {code.usableBy === 'anyone' ? (
                              <span className="text-gray-600">Anyone</span>
                            ) : (
                              <span className="text-gray-600">{code.usableBy}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-600">{code.createdBy}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              code.status === 'active' ? 'bg-green-100 text-green-800' :
                              code.status === 'used' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {code.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {code.usedBy || '-'}
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCode(code.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
