'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { Session, User } from '@/types/session';
import { useTheme } from '@/contexts/ThemeContext';

import { Nav } from '@/components/Nav';
import { SessionList } from '@/components/sessions/SessionList';
import { ErrorState } from '@/components/sessions/ErrorState';
import { LoadingState } from '@/components/sessions/LoadingState';
import { CreateRoomCTA } from '@/components/sessions/CreateRoomCTA';

interface LeaveState {
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface DeleteState {
  sessionId: string | null;
  isLoading: boolean;
  error: string | null;
}

export default function Home() {
  const { theme } = useTheme();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [leaveState, setLeaveState] = useState<LeaveState>({
    sessionId: null,
    isLoading: false,
    error: null
  });
  const [deleteState, setDeleteState] = useState<DeleteState>({
    sessionId: null,
    isLoading: false,
    error: null
  });
  const { get, post, delete: deleteRequest } = useApi();

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

  const handleLeaveSession = async (sessionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLeaveState({
      sessionId,
      isLoading: true,
      error: null
    });

    try {
      await post(ENDPOINTS.SESSIONS.LEAVE.path(sessionId));
      setSessions(prevSessions => prevSessions.filter(s => s.uuid !== sessionId));
    } catch (err) {
      console.error('Failed to leave study room:', err);
      setLeaveState(prev => ({
        ...prev,
        error: 'Failed to leave study room. Please try again.'
      }));
    } finally {
      setTimeout(() => {
        setLeaveState({
          sessionId: null,
          isLoading: false,
          error: null
        });
      }, 1000);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDeleteState({
      sessionId,
      isLoading: true,
      error: null
    });

    try {
      await deleteRequest(ENDPOINTS.SESSIONS.MANAGE.DELETE.path(sessionId));
      setSessions(prevSessions => prevSessions.filter(s => s.uuid !== sessionId));
    } catch (err) {
      console.error('Failed to delete study room:', err);
      setDeleteState(prev => ({
        ...prev,
        error: 'Failed to delete study room. Please try again.'
      }));
    } finally {
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
        setError('Failed to load study rooms. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [get]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: theme.background.primary}}>
      <Nav />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 py-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 sm:mb-0" style={{color: theme.typography.primary}}>
              Study Rooms
            </h1>
            <Link 
              href="/session/create"
              style={{
                backgroundColor: theme.brand.background,
                color: theme.brand.text
              }}
              className="px-6 py-3 rounded-lg text-base font-medium hover:opacity-80 transition-opacity duration-200"
            >
              Start Study Room
            </Link>
          </div>

          {loading && <LoadingState />}
          {!loading && error && <ErrorState error={error} onLogout={handleLogout} />}
          {!loading && !error && sessions.length === 0 && (
            <div className="mt-8">
              <CreateRoomCTA />
            </div>
          )}
          {!loading && !error && sessions.length > 0 && (
            <SessionList 
              sessions={sessions}
              user={user}
              onLeave={handleLeaveSession}
              onDelete={handleDeleteSession}
              leaveState={leaveState}
              deleteState={deleteState}
            />
          )}
        </div>
      </main>
    </div>
  );
}
