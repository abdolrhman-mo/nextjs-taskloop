import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Users, Eye, Target, Sparkles } from 'lucide-react';
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
            <span>Copy Room Link</span>
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