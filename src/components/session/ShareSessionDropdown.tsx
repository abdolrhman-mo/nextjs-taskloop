import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface ShareSessionDropdownProps {
  onClose: () => void;
  sessionId: string;
}

export function ShareSessionDropdown({ onClose, sessionId }: ShareSessionDropdownProps) {
  const { theme } = useTheme();
  const [copyState, setCopyState] = useState({
    isCopied: false,
    error: null as string | null
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleCopyLink = async () => {
    try {
      const sessionUrl = `${window.location.origin}/session/${sessionId}`;
      await navigator.clipboard.writeText(sessionUrl);
      setCopyState({ isCopied: true, error: null });
      setTimeout(() => setCopyState(prev => ({ ...prev, isCopied: false })), 2000);
    } catch {
      setCopyState({ isCopied: false, error: 'Failed to copy link' });
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 z-50 rounded-lg shadow-2xl overflow-hidden"
      style={{
        minWidth: 400,
        width: 500,
        maxWidth: 'calc(100vw - 2rem)',
        backgroundColor: theme.background.primary,
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: theme.border }}>
        <h3 className="text-lg font-semibold" style={{ color: theme.typography.primary }}>
          Share Session
        </h3>
      </div>
      {/* Instructions */}
      <div className="p-6">
        <p className="text-sm text-center" style={{ color: theme.typography.secondary }}>
          Copy and share this link with your friends to let them join your session
        </p>
      </div>
      {/* Copy Link Section */}
      <div className="p-4 border-t" style={{ borderColor: theme.border }}>
        <button
          onClick={handleCopyLink}
          className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-opacity-30"
          style={{
            backgroundColor: `${theme.brand.background}20`,
            color: theme.brand.background
          }}
        >
          {copyState.isCopied ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy Session Link</span>
            </>
          )}
        </button>
        {copyState.error && (
          <p className="mt-2 text-sm text-center" style={{ color: theme.error.DEFAULT }}>
            {copyState.error}
          </p>
        )}
      </div>
    </div>
  );
} 