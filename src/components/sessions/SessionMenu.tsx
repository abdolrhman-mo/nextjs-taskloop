import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SessionMenuProps {
  sessionId: string;
  onLeave: (sessionId: string, e: React.MouseEvent) => Promise<void>;
  isLeaving: boolean;
  leaveError: string | null;
}

export const SessionMenu = ({ sessionId, onLeave, isLeaving, leaveError }: SessionMenuProps) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-opacity-10 transition-colors duration-200 session-menu cursor-pointer"
        style={{ 
          backgroundColor: isOpen ? `${theme.brand.background}30` : `${theme.brand.background}20`,
          color: theme.typography.primary 
        }}
        disabled={isLeaving}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-12 right-3 w-48 rounded-lg shadow-lg py-1 z-10 session-menu transition-all duration-200"
          style={{ 
            backgroundColor: theme.background.secondary,
            border: `1px solid ${theme.border}`,
            boxShadow: `0 4px 6px -1px ${theme.border}20, 0 2px 4px -1px ${theme.border}10`
          }}
        >
          <button
            onClick={(e) => {
              if (window.confirm('Are you sure you want to leave this session?')) {
                onLeave(sessionId, e);
              } else {
                setIsOpen(false);
              }
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-200 cursor-pointer flex items-center gap-2"
            style={{ 
              color: theme.error.DEFAULT,
              backgroundColor: isLeaving ? `${theme.error.DEFAULT}10` : 'transparent'
            }}
            disabled={isLeaving}
          >
            {isLeaving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Leaving...
              </>
            ) : leaveError ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {leaveError}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Leave Session
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}; 