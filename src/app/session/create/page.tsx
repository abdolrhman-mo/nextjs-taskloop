'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { theme } from '@/config/theme';
import { Nav } from '@/components/Nav';
import Link from 'next/link';

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
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = searchTerm.trim() ? users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await get<User[]>(ENDPOINTS.SESSIONS.USERS.LIST.path);
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [get]);

  const openSessionNameModal = (user: User) => {
    setSelectedUser(user);
    setSessionName('');
    setError(null);
    setIsModalOpen(true);
  };

  const handleCreateSession = async () => {
    if (!selectedUser || !sessionName.trim()) {
      setError('Please enter a session name');
      return;
    }

    try {
      setError(null);
      const response = await post<{session_id: string}>(ENDPOINTS.SESSIONS.CREATE.path, { 
        user2_id: selectedUser.id,
        name: sessionName.trim()
      });
      
      if (response.session_id) {
        router.push(`/session/${response.session_id}`);
      } else {
        throw new Error('No session ID received');
      }
    } catch (err) {
      console.error('Failed to create session:', err);
      setError('Failed to create session. Please try again.');
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: theme.background.primary}}>
      <Nav />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{color: theme.typography.primary}}>Find a Partner</h1>
              <p className="text-sm" style={{color: theme.typography.secondary}}>Start a new collaboration session</p>
            </div>
            <Link 
              href="/"
              className="text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-80 transition-all duration-200 cursor-pointer flex items-center gap-2"
              style={{
                backgroundColor: theme.background.secondary,
                color: theme.typography.primary,
                border: `1px solid ${theme.border}`
              }}
            >
              <span>&larr;</span> Back to Home
            </Link>
          </div>
          
          <div className="max-w-2xl mx-auto bg-opacity-50 backdrop-blur-sm rounded-xl p-6" style={{backgroundColor: theme.background.secondary}}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full px-5 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200"
                style={{
                  borderColor: theme.border,
                  color: theme.typography.primary,
                  backgroundColor: theme.background.primary,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{color: '#ffffff'}}
                >
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="text-center py-12" style={{color: theme.typography.secondary}}>
                  <div className="animate-pulse">Loading users...</div>
                </div>
              ) : error ? (
                <div className="text-center py-8 px-4 rounded-lg" style={{backgroundColor: theme.error.DEFAULT, color: theme.error.text}}>
                  {error}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12" style={{color: theme.typography.secondary}}>
                  {searchTerm.trim() ? 'No users found' : 'Start typing to search users'}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className="p-4 rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
                      onClick={() => openSessionNameModal(user)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium" 
                          style={{
                            backgroundColor: theme.brand.background,
                            color: theme.brand.text
                          }}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium" style={{color: theme.typography.primary}}>
                          {user.username}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Session Name Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="p-8 rounded-xl shadow-2xl w-96 max-w-[90vw] transform transition-all duration-200"
            style={{
              backgroundColor: theme.background.secondary,
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-2" style={{color: theme.typography.primary}}>
              Name Your Session
            </h2>
            <p className="text-sm mb-6" style={{color: theme.typography.secondary}}>
              Choose a name for your session with <span className="font-medium" style={{color: theme.typography.primary}}>{selectedUser?.username}</span>
            </p>
            
            <input
              type="text"
              placeholder="Session Name"
              className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                borderColor: theme.border,
                color: theme.typography.primary,
                backgroundColor: theme.background.primary
              }}
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              maxLength={50}
              autoFocus
            />

            {error && (
              <p className="text-sm mb-4 px-3 py-2 rounded-lg" style={{backgroundColor: theme.error.DEFAULT, color: theme.error.text}}>
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200"
                style={{
                  backgroundColor: theme.background.primary,
                  color: theme.typography.primary,
                  border: `1px solid ${theme.border}`
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSession}
                disabled={!sessionName.trim()}
                className="px-5 py-2.5 rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: theme.brand.background,
                  color: theme.brand.text
                }}
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
