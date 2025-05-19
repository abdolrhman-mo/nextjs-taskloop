'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { theme } from '@/config/theme';
import { Nav } from '@/components/Nav';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Session {
  id: string;
  name: string;
  user1: number;
  user2: number;
  user1_username: string;
  user2_username: string;
  created_at: string;
}

interface DeleteState {
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [deleteState, setDeleteState] = useState<DeleteState>({
    sessionId: null,
    isLoading: false,
    error: null
  });
  const { get, delete: deleteRequest } = useApi();

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await get<User>(ENDPOINTS.AUTH.ME.path);
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    fetchUserData();
  }, [get]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.session-menu')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set initial delete state
    setDeleteState({
      sessionId,
      isLoading: true,
      error: null
    });

    try {
      await deleteRequest(ENDPOINTS.SESSIONS.MANAGE.DELETE.path(sessionId));
      setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
      setOpenMenuId(null);
    } catch (err) {
      console.error('Failed to delete session:', err);
      setDeleteState(prev => ({
        ...prev,
        error: 'Failed to delete session. Please try again.'
      }));
    } finally {
      // Reset delete state after a short delay to show success state
      setTimeout(() => {
        setDeleteState({
          sessionId: null,
          isLoading: false,
          error: null
        });
      }, 1000);
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const data = await get<Session[]>(ENDPOINTS.SESSIONS.LIST.path);
        setSessions(data); 
      } catch (err) {
        console.error(err);
        setError('Failed to load sessions. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [get]);

  const sortedSessions = useMemo(() => {
    const sorted = [...sessions];
    sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return sorted;
  }, [sessions]);

  const latestSession = sortedSessions.length > 0 ? sortedSessions[0] : null;
  const otherSessions = sortedSessions.length > 1 ? sortedSessions.slice(1) : [];

  const SessionCard = ({ session, isFeatured }: { session: Session; isFeatured?: boolean }) => {
    const isMenuOpen = openMenuId === session.id;
    const isDeleting = deleteState.sessionId === session.id && deleteState.isLoading;
    const hasError = deleteState.sessionId === session.id && deleteState.error;
    
    // Determine if current user created this session
    const isCreator = user && session.user1 === user.id;
    const isParticipant = user && (session.user1 === user.id || session.user2 === user.id);

    return (
      <div
        className={`
          block rounded-lg overflow-hidden transition-all duration-300 group relative
          ${isFeatured 
            ? `p-6 shadow-xl hover:shadow-2xl border-2` 
            : `p-5 shadow-lg hover:shadow-xl border`
          }
          ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
        `}
        style={{
          backgroundColor: theme.background.secondary,
          borderColor: theme.border,
          borderLeftWidth: '1px',
        }}
      >
        {/* Role Badge */}
        {isParticipant && (
          <div 
            className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium"
            style={{
              backgroundColor: `${theme.background.tertiary}20`,
              color: theme.typography.secondary
            }}
          >
            {isCreator ? 'Created by you' : 'Added by ' + session.user1_username}
          </div>
        )}

        {/* Menu Button - adjust position to account for badge */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenMenuId(isMenuOpen ? null : session.id);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-opacity-10 transition-colors duration-200 session-menu cursor-pointer"
          style={{ 
            backgroundColor: `${theme.brand.background}20`,
            color: theme.typography.primary 
          }}
          disabled={isDeleting}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div 
            className="absolute top-12 right-3 w-48 rounded-lg shadow-lg py-1 z-10 session-menu"
            style={{ 
              backgroundColor: theme.background.secondary,
              border: `1px solid ${theme.border}`
            }}
          >
            <button
              onClick={(e) => {
                if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
                  handleDeleteSession(session.id, e);
                } else {
                  setOpenMenuId(null);
                }
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-200 cursor-pointer flex items-center gap-2"
              style={{ 
                color: theme.error.DEFAULT,
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Deleting...
                </>
              ) : hasError ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {deleteState.error}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Session
                </>
              )}
            </button>
          </div>
        )}

        <div className={`mb-3 ${isFeatured ? 'text-center' : ''} ${isParticipant ? 'mt-8' : ''}`}>
          <h2 className={`font-bold group-hover:text-opacity-80 transition-colors ${isFeatured ? 'text-2xl mb-2' : 'text-xl'}`} 
            style={{
              color: theme.typography.primary
            }}
          >
            {session.name}
          </h2>
          <div className="space-y-1">
            <p className={`text-xs ${isFeatured ? 'mb-1' : ''}`} style={{color: theme.typography.secondary}}>
              {isCreator ? (
                <>You and {session.user2_username}</>
              ) : (
                <>You and {session.user1_username}</>
              )}
            </p>
            <p className="text-xs" style={{color: theme.typography.secondary}}>
              On: {formatDate(session.created_at)}
            </p>
          </div>
        </div>
        
        <Link 
          href={`/session/${session.id}`}
          className={`block w-full text-center py-2.5 mt-4 rounded-md text-sm font-semibold transition-all duration-300 hover:opacity-90 cursor-pointer`}
          style={{
            backgroundColor: theme.background.tertiary,
            color: theme.typography.primary,
          }}
        >
          Join Session
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: theme.background.primary}}>
      <Nav />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 py-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 sm:mb-0" style={{color: theme.typography.primary}}>
              Active Sessions
            </h1>
            <Link 
              href="/session/create"
              style={{
                backgroundColor: theme.brand.background,
                color: theme.brand.text
              }}
              className="px-6 py-3 rounded-lg text-base font-medium shadow-md hover:opacity-80 transition-opacity duration-200"
            >
              Create New Session
            </Link>
          </div>

          {loading && (
            <div style={{color: theme.typography.secondary}} className="text-center py-20 text-xl">Loading...</div>
          )}

          {!loading && error && (
            <div style={{backgroundColor: theme.background.secondary, color: theme.error.DEFAULT, borderColor: theme.error.DEFAULT}} className="text-center py-10 px-6 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-3">Oops! Something went wrong.</h2>
              <p>{error}</p>
              {/* Add a logout */}
            </div>
          )}

          {!loading && !error && sessions.length === 0 && (
            <div className="text-center py-20">
              <svg className="mx-auto h-16 w-16 mb-4" style={{color: theme.typography.secondary}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-2xl font-semibold mb-3" style={{color: theme.typography.primary}}>No Sessions Available</h2>
              <p style={{color: theme.typography.secondary}} className="mb-6">
                There are no active sessions right now. Be the first to start one!
              </p>
            </div>
          )}

          {!loading && !error && sessions.length > 0 && (
            <>
              {latestSession && (
                <div className="mb-12 mt-8">
                  <h3 className="text-2xl font-semibold mb-4 tracking-tight" style={{color: theme.typography.primary}}>Latest Session</h3>
                  <SessionCard session={latestSession} isFeatured={true} />
                </div>
              )}

              {otherSessions.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-4 tracking-tight" style={{color: theme.typography.primary}}>
                    {latestSession ? 'Other Active Sessions' : 'All Sessions'} 
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {otherSessions.map(session => <SessionCard key={session.id} session={session} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
