import { useState } from 'react';
import { theme } from '@/config/theme';
import { Session } from '@/types/session';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';

interface SessionHeaderProps {
  session: Session;
  isSessionParticipant: boolean;
  onSessionUpdate: (updatedSession: Session) => void;
}

export function SessionHeader({ session, isSessionParticipant, onSessionUpdate }: SessionHeaderProps) {
  const [editState, setEditState] = useState({
    isEditing: false,
    isLoading: false,
    error: null as string | null
  });
  const [editedName, setEditedName] = useState(session.name);
  const { put } = useApi();

  const handleEditSessionName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedName.trim()) return;

    setEditState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const updatedSession = await put<Session>(
        ENDPOINTS.SESSIONS.MANAGE.UPDATE.path(session.id),
        { name: editedName.trim() }
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
    <div className="w-full sm:w-auto">
      {editState.isEditing ? (
        <form onSubmit={handleEditSessionName} className="flex items-center gap-2 mb-1">
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-transparent border-b-2 focus:outline-none focus:border-blue-500 transition-colors duration-200 pb-1"
            style={{
              color: theme.typography.primary,
              borderColor: theme.border
            }}
            autoFocus
            disabled={editState.isLoading}
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className={`p-1.5 rounded-lg hover:bg-opacity-10 transition-colors duration-200 
                ${!editState.isLoading && !editedName.trim() ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              style={{ 
                backgroundColor: `${theme.brand.background}20`,
                color: theme.brand.background
              }}
              disabled={editState.isLoading || !editedName.trim()}
            >
              {editState.isLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditState(prev => ({ ...prev, isEditing: false }));
                setEditedName(session.name);
              }}
              className={`p-1.5 rounded-lg hover:bg-opacity-10 transition-colors duration-200 
                ${!editState.isLoading ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              style={{ 
                backgroundColor: `${theme.error.DEFAULT}20`,
                color: theme.error.DEFAULT
              }}
              disabled={editState.isLoading}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white text-center sm:text-left">
            {session.name}
          </h2>
          {isSessionParticipant && (
            <button
              onClick={() => {
                setEditedName(session.name);
                setEditState(prev => ({ ...prev, isEditing: true }));
              }}
              className="p-1.5 rounded-lg hover:bg-opacity-10 transition-colors duration-200 cursor-pointer"
              style={{ 
                backgroundColor: `${theme.brand.background}20`,
                color: theme.brand.background
              }}
              title="Edit session name"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
      )}
      {editState.error && (
        <p className="text-sm mt-1" style={{ color: theme.error.DEFAULT }}>
          {editState.error}
        </p>
      )}
      <p className="text-gray-400 text-sm sm:text-base mt-1">
        Session with {session.user1_username} and {session.user2_username}
      </p>
    </div>
  );
} 