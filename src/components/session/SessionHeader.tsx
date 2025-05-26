import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Session } from '@/types/session';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { SessionNameEditForm } from './SessionNameEditForm';
import { EditSessionButton } from './EditSessionButton';
import { ShareSessionMenu } from './ShareSessionMenu';

interface SessionHeaderProps {
  session: Session;
  isSessionParticipant: boolean;
  onSessionUpdate: (updatedSession: Session) => void;
}

export function SessionHeader({ session, isSessionParticipant, onSessionUpdate }: SessionHeaderProps) {
  const { theme } = useTheme();
  const [editState, setEditState] = useState({
    isEditing: false,
    isLoading: false,
    error: null as string | null
  });
  const { put } = useApi();

  const handleEditSessionName = async (newName: string) => {
    setEditState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const updatedSession = await put<Session>(
        ENDPOINTS.SESSIONS.MANAGE.UPDATE.path(session.uuid),
        { name: newName }
      );
      onSessionUpdate(updatedSession);
      setEditState(prev => ({ ...prev, isEditing: false }));
    } catch (err) {
      console.error('Failed to update session name:', err);
      setEditState(prev => ({ 
        ...prev, 
        error: 'Failed to update session name. Please try again.' 
      }));
    } finally {
      setEditState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-grow">
          {editState.isEditing ? (
            <SessionNameEditForm
              initialName={session.name}
              isLoading={editState.isLoading}
              onSubmit={handleEditSessionName}
              onCancel={() => {
                setEditState(prev => ({ ...prev, isEditing: false }));
              }}
            />
          ) : (
            <div className="flex items-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" 
                style={{color: theme.typography.primary}}>
                {session.name}
              </h2>
              {isSessionParticipant && (
                <EditSessionButton
                  onClick={() => setEditState(prev => ({ ...prev, isEditing: true }))}
                />
              )}
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <ShareSessionMenu sessionId={session.uuid} />
        </div>
      </div>
      <div className="mt-2">
        {editState.error && (
          <p className="text-sm" style={{ color: theme.error.DEFAULT }}>
            {editState.error}
          </p>
        )}
      </div>
    </div>
  );
} 