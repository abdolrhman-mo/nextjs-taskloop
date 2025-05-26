'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { useTheme } from '@/contexts/ThemeContext';
import { Nav } from '@/components/Nav';
import Link from 'next/link';

interface CreateSessionResponse {
  uuid: string;
  name: string;
}

export default function CreateSessionPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const { post, get } = useApi();
  const [sessionName, setSessionName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Poll for session creation status
  const checkSessionStatus = async (sessionId: string) => {
      try {
      const session = await get(ENDPOINTS.SESSIONS.READ.path(sessionId));
      if (session) {
        router.push(`/session/${sessionId}`);
      }
      } catch (err) {
      console.error('Failed to verify session:', err);
      // Keep polling if session is not ready
      setTimeout(() => checkSessionStatus(sessionId), 1000);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim()) {
      setError('Please enter a session name');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);
      const response = await post<CreateSessionResponse>(ENDPOINTS.SESSIONS.CREATE.path, { 
        name: sessionName.trim()
      });
      
      if (response.uuid) {
        // Start polling for session status
        checkSessionStatus(response.uuid);
      } else {
        throw new Error('No session UUID received');
      }
    } catch (err) {
      console.error('Failed to create session:', err);
      setError('Failed to create session. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: theme.background.primary}}>
      <Nav />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{color: theme.typography.primary}}>Create New Session</h1>
              <p className="text-sm" style={{color: theme.typography.secondary}}>Start a new task sharing session</p>
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
          
          <div 
            className="max-w-2xl mx-auto bg-opacity-50 backdrop-blur-sm rounded-xl p-6 shadow-sm transition-colors duration-200" 
            style={{
              backgroundColor: theme.background.secondary,
              border: `1px solid ${theme.border}`
            }}
          >
            <form onSubmit={handleCreateSession} className="space-y-6">
              <div>
                <label 
                  htmlFor="sessionName" 
                  className="block text-sm font-medium mb-2"
                  style={{color: theme.typography.primary}}
                >
                  Session Name
                </label>
                <input
                  id="sessionName"
                  type="text"
                  placeholder="Enter a name for your session"
                  className="w-full px-5 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                  style={{
                    borderColor: theme.border,
                    color: theme.typography.primary,
                    backgroundColor: theme.background.primary,
                    '--tw-ring-offset-color': theme.background.secondary,
                    '--tw-ring-color': `${theme.brand.background}40`
                  } as React.CSSProperties}
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  maxLength={50}
                  autoFocus
                  disabled={isCreating}
                />
              </div>

              {error && (
                <div 
                  className="p-4 rounded-lg transition-colors duration-200" 
                  style={{
                    backgroundColor: `${theme.error.DEFAULT}20`,
                    color: theme.error.DEFAULT,
                    border: `1px solid ${theme.error.DEFAULT}40`
                  }}
                >
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200"
                  style={{
                    backgroundColor: theme.background.primary,
                    color: theme.typography.primary,
                    border: `1px solid ${theme.border}`
                  }}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={!sessionName.trim() || isCreating}
                  className="px-5 py-2.5 rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{
                    backgroundColor: theme.brand.background,
                    color: theme.brand.text
                  }}
                >
                  {isCreating && (
                    <div 
                      className="animate-spin rounded-full h-4 w-4 border-2" 
                      style={{
                        borderColor: theme.brand.text,
                        borderTopColor: 'transparent'
                      }}
                    />
                  )}
                  {isCreating ? 'Creating session...' : 'Create Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
