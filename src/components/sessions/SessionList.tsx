import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { SessionCard } from './SessionCard';
import { Session, User } from '@/types/session';

interface SessionListProps {
  sessions: Session[];
  user: User | null;
  onLeave: (sessionId: string, e: React.MouseEvent) => Promise<void>;
  leaveState: {
    sessionId: string | null;
    isLoading: boolean;
    error: string | null;
  };
}

export const SessionList = ({ sessions, user, onLeave, leaveState }: SessionListProps) => {
  const { theme } = useTheme();
  const sortedSessions = useMemo(() => {
    const sorted = [...sessions];
    sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return sorted;
  }, [sessions]);

  const latestSession = sortedSessions.length > 0 ? sortedSessions[0] : null;
  const otherSessions = sortedSessions.length > 1 ? sortedSessions.slice(1) : [];

  if (sessions.length === 0) {
    return null;
  }

  return (
    <>
      {latestSession && (
        <div className="mb-12 mt-8">
          <h3 className="text-2xl font-semibold mb-4 tracking-tight" style={{color: theme.typography.primary}}>
            Latest Session
          </h3>
          <SessionCard 
            session={latestSession} 
            user={user}
            isFeatured={true}
            onLeave={onLeave}
            isLeaving={leaveState.sessionId === latestSession.uuid && leaveState.isLoading}
            leaveError={leaveState.sessionId === latestSession.uuid ? leaveState.error : null}
          />
        </div>
      )}

      {otherSessions.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-4 tracking-tight" style={{color: theme.typography.primary}}>
            {latestSession ? 'Other Active Sessions' : 'All Sessions'} 
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {otherSessions.map(session => (
              <SessionCard 
                key={session.uuid} 
                session={session}
                user={user}
                onLeave={onLeave}
                isLeaving={leaveState.sessionId === session.uuid && leaveState.isLoading}
                leaveError={leaveState.sessionId === session.uuid ? leaveState.error : null}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}; 