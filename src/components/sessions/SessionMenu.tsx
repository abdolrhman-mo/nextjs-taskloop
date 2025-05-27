import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useHoverBackground } from '@/hooks/useHoverBackground';
import { Session, User } from '@/types/session';
import { DropdownMenu } from '@/components/common/DropdownMenu';

interface SessionMenuProps {
  session: Session;
  user: User | null;
  onLeave: (sessionId: string, e: React.MouseEvent) => Promise<void>;
  onDelete: (sessionId: string, e: React.MouseEvent) => Promise<void>;
  isLeaving: boolean;
  isDeleting: boolean;
  leaveError: string | null;
  deleteError: string | null;
}

export const SessionMenu = ({ 
  session, 
  user,
  onLeave, 
  onDelete,
  isLeaving,
  isDeleting,
  leaveError,
  deleteError 
}: SessionMenuProps) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isCreator = user && session.creator === user.id;
  const isParticipant = user && session.participants.some(p => p.id === user.id);
  const { handleMouseEnter, handleMouseLeave, style } = useHoverBackground();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.session-menu')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleAction = (e: React.MouseEvent) => {
    if (isCreator) {
      if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
        onDelete(session.uuid, e);
      } else {
        setIsOpen(false);
      }
    } else if (isParticipant) {
      if (window.confirm('Are you sure you want to leave this session?')) {
        onLeave(session.uuid, e);
      } else {
        setIsOpen(false);
      }
    }
  };

  // Don't show menu if user is not a participant
  if (!isParticipant) {
    return null;
  }

  // Build menu items
  const items = [
    {
      label: isCreator ? 'Delete Session' : 'Leave Session',
      icon: isCreator ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      onClick: () => handleAction({ preventDefault: () => {}, stopPropagation: () => {} } as unknown as React.MouseEvent),
      isDestructive: true,
      isLoading: isDeleting || isLeaving,
      error: deleteError || leaveError,
    },
  ];

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="absolute top-3 right-3 p-1.5 rounded-lg transition-colors duration-200 session-menu cursor-pointer"
        style={{ 
          ...style,
          color: theme.typography.primary
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={isLeaving || isDeleting}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>
      <DropdownMenu items={items} isOpen={isOpen} className="top-12 right-3 absolute" />
    </>
  );
}; 