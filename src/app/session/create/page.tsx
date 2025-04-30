'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { theme } from '@/config/theme';

interface User {
  id: string;
  username: string;
  email: string;
}

export default function CreateSessionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { get, post } = useApi();

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await get<User[]>(ENDPOINTS.SESSIONS.USERS.LIST.path);
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load users');
      }
    };

    fetchUsers();
  }, [get]);

  const openSessionNameModal = (user: User) => {
    setSelectedUser(user);
    setSessionName('');
    setIsModalOpen(true);
  };

  const handleCreateSession = async () => {
    if (!selectedUser || !sessionName.trim()) {
      setError('Please enter a session name');
      return;
    }

    try {
      const response = await post<{session_id: string}>(ENDPOINTS.SESSIONS.CREATE.path, { 
        user2_id: selectedUser.id,
        name: sessionName.trim()
      });
      
      console.log(response);
      
      if (response.session_id) {
        router.push(`/session/${response.session_id}`);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to create session');
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen p-8 relative" style={{backgroundColor: theme.background.primary}}>
      <h1 className="text-3xl font-bold mb-8" style={{color: theme.typography.primary}}>Find a Partner</h1>
      
      <div className="max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 mb-4 rounded-md border focus:outline-none focus:ring-2" style={{borderColor: theme.border, color: theme.typography.primary}}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="space-y-2">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className="p-4 rounded-md shadow cursor-pointer hover:opacity-90" style={{backgroundColor: theme.background.secondary}}
              onClick={() => openSessionNameModal(user)}
            >
              <div className="font-medium" style={{color: theme.typography.primary}}>{user.username}</div>
              <div className="text-sm" style={{color: theme.typography.secondary}}>{user.email}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Name Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{backgroundColor: theme.background.primary}}>
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4" style={{color: theme.brand.text}}>Name Your Session</h2>
            <p className="text-sm mb-4" style={{color: theme.typography.secondary}}>Choose a name for your session with {selectedUser?.username}</p>
            
            <input
              type="text"
              placeholder="Session Name"
              className="w-full px-3 py-2 border rounded-md mb-4" style={{borderColor: theme.border, color: theme.brand.text}}
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              maxLength={50}
            />

            {error && <p className="text-sm mb-4" style={{color: theme.error.DEFAULT}}>{error}</p>}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md cursor-pointer hover:opacity-90" style={{backgroundColor: theme.brand.background, color: theme.brand.text}}
                >
                Cancel
              </button>
              <button
                onClick={handleCreateSession}
                disabled={!sessionName.trim()}
                className="cursor-pointer px-4 py-2 rounded-md hover:opacity-90" style={{backgroundColor: theme.background.secondary, color: theme.typography.secondary}}
              >
                Create Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
