import { useState, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useHoverBackground } from '@/hooks/useHoverBackground';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { DropdownPanel } from '@/components/common/DropdownPanel';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { Settings, Edit2, LogOut, Trash2, ArrowUpDown } from 'lucide-react';
import { Session } from '@/types/session';
import { ENDPOINTS } from '@/config/endpoints';

interface SettingsMenuProps {
  sessionId: string;
  session: Session;
  isCreator: boolean;
  isParticipant: boolean;
  onSessionUpdate: (session: Session) => void;
  onSessionLeave?: () => void;
  onSessionDelete?: () => void;
  taskSortOrder: 'newest' | 'oldest';
  onTaskSortChange: (order: 'newest' | 'oldest') => void;
}

interface EditState {
  isLoading: boolean;
  error: string | null;
}

export function SettingsMenu({ 
  session, 
  isCreator, 
  isParticipant,
  onSessionUpdate,
  onSessionLeave,
  onSessionDelete,
  taskSortOrder,
  onTaskSortChange
}: SettingsMenuProps) {
  const { theme } = useTheme();
  const { put, post, delete: deleteRequest } = useApi();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [editState, setEditState] = useState<EditState>({
    isLoading: false,
    error: null
  });
  const [actionState, setActionState] = useState<{
    isLoading: boolean;
    error: string | null;
  }>({
    isLoading: false,
    error: null
  });
  const { handleMouseEnter, handleMouseLeave, style } = useHoverBackground();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleEditName = () => {
    setIsEditingName(true);
    setEditState({ isLoading: false, error: null });
    // Focus input after it's rendered
    setTimeout(() => nameInputRef.current?.focus(), 0);
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newName = nameInputRef.current?.value.trim();
    
    if (!newName || newName === session.name) {
      setIsEditingName(false);
      return;
    }

    setEditState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const updatedSession = await put<Session>(
        ENDPOINTS.SESSIONS.MANAGE.UPDATE.path(session.uuid),
        { name: newName }
      );
      if (onSessionUpdate) {
        onSessionUpdate(updatedSession);
      }
      setIsEditingName(false);
      setIsOpen(false); // Close the dropdown after successful update
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

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditState({ isLoading: false, error: null });
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
    setIsOpen(false);
  };

  const handleLeaveClick = () => {
    setShowConfirmLeave(true);
    setIsOpen(false);
  };

  const handleConfirmDelete = async () => {
    setActionState({ isLoading: true, error: null });

    try {
      await deleteRequest(ENDPOINTS.SESSIONS.MANAGE.DELETE.path(session.uuid));
      onSessionDelete?.();
    } catch (err) {
      console.error('Failed to delete session:', err);
      setActionState(prev => ({
        ...prev,
        error: 'Failed to delete session. Please try again.'
      }));
    } finally {
      setTimeout(() => {
        setActionState({ isLoading: false, error: null });
        setShowConfirmDelete(false);
      }, 1000);
    }
  };

  const handleConfirmLeave = async () => {
    setActionState({ isLoading: true, error: null });

    try {
      await post(ENDPOINTS.SESSIONS.LEAVE.path(session.uuid));
      onSessionLeave?.();
    } catch (err) {
      console.error('Failed to leave session:', err);
      setActionState(prev => ({
        ...prev,
        error: 'Failed to leave session. Please try again.'
      }));
    } finally {
      setTimeout(() => {
        setActionState({ isLoading: false, error: null });
        setShowConfirmLeave(false);
      }, 1000);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg transition-colors duration-200 cursor-pointer"
        style={{ 
          ...style,
          color: theme.typography.primary,
          cursor: 'pointer'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title="Room Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <DropdownPanel
          onClose={() => {
            if (!isEditingName) {
              setIsOpen(false);
              setEditState({ isLoading: false, error: null });
            }
          }}
          title="Room Settings"
          triggerRef={triggerRef}
        >
          <div className="p-4 space-y-3">
            {/* Edit Study Room Name */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium" style={{ color: theme.typography.secondary }}>
                Study Room Name
              </h4>
              {isEditingName ? (
                <form onSubmit={handleNameSubmit} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      ref={nameInputRef}
                      type="text"
                      defaultValue={session.name}
                      className="flex-1 px-3 py-2 rounded-lg text-sm bg-transparent border transition-colors cursor-text"
                      style={{ 
                        borderColor: editState.error ? theme.error.DEFAULT : theme.border,
                        color: theme.typography.primary,
                      }}
                      disabled={editState.isLoading}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
                        style={{
                          backgroundColor: theme.background.primary,
                          color: theme.typography.primary,
                          border: `1px solid ${theme.border}`,
                          cursor: 'pointer'
                        }}
                        disabled={editState.isLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
                        style={{
                          backgroundColor: theme.brand.background,
                          color: theme.background.primary,
                          cursor: 'pointer'
                        }}
                        disabled={editState.isLoading}
                      >
                        {editState.isLoading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                  {editState.error && (
                    <p className="text-sm" style={{ color: theme.error.DEFAULT }}>
                      {editState.error}
                    </p>
                  )}
                </form>
              ) : (
                <button
                  onClick={handleEditName}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors hover:bg-opacity-10 cursor-pointer"
                  style={{
                    backgroundColor: `${theme.brand.background}10`,
                    color: theme.typography.primary,
                    cursor: 'pointer'
                  }}
                >
                  <span>{session.name}</span>
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Task Sort Settings */}
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: theme.border }}>
              <h4 className="text-sm font-medium" style={{ color: theme.typography.secondary }}>
                Task Sort Order
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => onTaskSortChange('newest')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    taskSortOrder === 'newest' ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                  }`}
                  style={{
                    backgroundColor: `${theme.brand.background}10`,
                    color: theme.typography.primary,
                    cursor: 'pointer'
                  }}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Newest First</span>
                </button>
                <button
                  onClick={() => onTaskSortChange('oldest')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    taskSortOrder === 'oldest' ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                  }`}
                  style={{
                    backgroundColor: `${theme.brand.background}10`,
                    color: theme.typography.primary,
                    cursor: 'pointer'
                  }}
                >
                  <ArrowUpDown className="w-4 h-4 rotate-180" />
                  <span>Oldest First</span>
                </button>
              </div>
            </div>

            {/* Study Room Actions */}
            <div className="space-y-2 pt-2 border-t" style={{ borderColor: theme.border }}>
              <h4 className="text-sm font-medium" style={{ color: theme.typography.secondary }}>
                Study Room Actions
              </h4>
              
              {isCreator ? (
                <button
                  onClick={handleDeleteClick}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-opacity-10 disabled:opacity-50 cursor-pointer"
                  style={{
                    backgroundColor: `${theme.error.DEFAULT}10`,
                    color: theme.error.DEFAULT,
                    cursor: 'pointer'
                  }}
                  disabled={actionState.isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{actionState.isLoading ? 'Deleting...' : 'Delete Study Room'}</span>
                </button>
              ) : isParticipant ? (
                <button
                  onClick={handleLeaveClick}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-opacity-10 disabled:opacity-50 cursor-pointer"
                  style={{
                    backgroundColor: `${theme.error.DEFAULT}10`,
                    color: theme.error.DEFAULT,
                    cursor: 'pointer'
                  }}
                  disabled={actionState.isLoading}
                >
                  <LogOut className="w-4 h-4" />
                  <span>{actionState.isLoading ? 'Leaving...' : 'Leave Study Room'}</span>
                </button>
              ) : null}
              {actionState.error && (
                <p className="text-sm" style={{ color: theme.error.DEFAULT }}>
                  {actionState.error}
                </p>
              )}
            </div>
          </div>
        </DropdownPanel>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={async () => {
          await handleConfirmDelete();
          router.push('/');
        }}
        title="Delete Study Room"
        message="Are you sure you want to delete this study room? This action cannot be undone and all participants will be removed."
        confirmText={actionState.isLoading ? "Deleting..." : "Delete Study Room"}
        isDestructive={true}
      />

      <ConfirmationModal
        isOpen={showConfirmLeave}
        onClose={() => setShowConfirmLeave(false)}
        onConfirm={async () => {
          await handleConfirmLeave();
          router.push('/');
        }}
        title="Leave Study Room"
        message="Are you sure you want to leave this study room? You can rejoin later if you have the study room link."
        confirmText={actionState.isLoading ? "Leaving..." : "Leave Study Room"}
        isDestructive={true}
      />
    </div>
  );
} 