'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { theme } from '@/config/theme';

interface Session {
  id: string;
  name: string;
  user1: number;
  user2: number;
  user1_username: string;
  user2_username: string;
  created_at: string;
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { get } = useApi();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await get<Session[]>(ENDPOINTS.SESSIONS.LIST.path);
        // Sort sessions by creation date in descending order (most recent first)
        const sortedSessions = data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setSessions(sortedSessions);
      } catch (err) {
        console.error(err);
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen p-8" style={{backgroundColor: theme.background.primary}}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold" style={{color: theme.typography.primary}}>TaskLoop</h1>
          <Link 
            href="/session/create"
            style={{
              backgroundColor: theme.brand.background,
              color: theme.brand.text
            }}
            className="px-6 py-3 rounded-md hover:opacity-90 transition-colors cursor-pointer"
          >
            Start Session
          </Link>
        </div>

        {loading ? (
          <div style={{color: theme.typography.primary}} className="text-center">Loading sessions...</div>
        ) : error ? (
          <div style={{color: theme.error.DEFAULT}} className="text-center">{error}</div>
        ) : sessions.length === 0 ? (
          <div style={{color: theme.typography.primary}} className="text-center">No sessions found. Start a new one!</div>
        ) : (
          <div className="space-y-4">
            {sessions.map(session => (
              <Link
                key={session.id}
                href={`/session/${session.id}`}
                style={{
                  backgroundColor: theme.background.secondary,
                  border: `1px solid ${theme.border}`
                }}
                className="block p-4 rounded-lg shadow hover:opacity-90 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold" style={{color: theme.typography.primary}}>{session.name}</h2>
                    <p className="text-sm" style={{color: theme.typography.secondary}}>Created by User {session.user1_username} with {session.user2_username}</p>
                  </div>
                  <span className="text-sm" style={{color: theme.typography.secondary}}>
                    {new Date(session.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
