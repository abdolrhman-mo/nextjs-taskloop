import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Users } from 'lucide-react';

interface ShareRoomCTAProps {
  sessionId: string;
}

export function ShareRoomCTA({ sessionId }: ShareRoomCTAProps) {
  const { theme } = useTheme();
  const [copyState, setCopyState] = useState({
    isCopied: false,
    error: null as string | null
  });

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
    <div className="flex items-center gap-3 py-3">
      <Users className="w-4 h-4 shrink-0" style={{ color: theme.typography.secondary }} />
      <span className="text-sm" style={{ color: theme.typography.secondary }}>
        Invite friends
      </span>
      <button
        onClick={handleCopyLink}
        className="cursor-pointer text-sm font-medium hover:opacity-70 transition-opacity"
        style={{ color: theme.brand.background }}
      >
        {copyState.isCopied ? 'Copied!' : 'Copy link'}
      </button>
      {copyState.error && (
        <span className="text-xs" style={{ color: theme.error.DEFAULT }}>
          {copyState.error}
        </span>
      )}
    </div>
  );
}
