import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Users, Share2, Eye, Target, Sparkles } from 'lucide-react';
import { BaseCTA } from '@/components/common/BaseCTA';

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

  const features = [
    {
      icon: Eye,
      title: 'Live Task Updates',
      description: 'See what your friends have finished in real-time'
    },
    {
      icon: Target,
      title: 'Stay Accountable',
      description: 'Keep focused knowing your friends are watching'
    },
    {
      icon: Sparkles,
      title: 'Group Motivation',
      description: 'Get inspired by your friends\' accomplishments'
    }
  ];

  const actionButton = (
    <>
      <button
        onClick={handleCopyLink}
        className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-opacity duration-200 hover:opacity-90"
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
            <Share2 className="w-5 h-5" />
            <span>Share Room Link</span>
          </>
        )}
      </button>
      {copyState.error && (
        <p className="mt-3 text-sm" style={{ color: theme.error.DEFAULT }}>
          {copyState.error}
        </p>
      )}
    </>
  );

  return (
    <BaseCTA
      icon={Users}
      title="Study Together, Achieve More!"
      description="Share this study room with your friends to collaborate on tasks together"
      features={features}
      actionButton={actionButton}
    />
  );
} 