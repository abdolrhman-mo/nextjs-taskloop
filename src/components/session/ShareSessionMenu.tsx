import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ShareSessionModal } from './ShareSessionModal';

interface ShareSessionMenuProps {
  sessionId: string;
}

export function ShareSessionMenu({ sessionId }: ShareSessionMenuProps) {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-1.5 rounded-lg hover:bg-opacity-10 transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
        style={{ 
          backgroundColor: `${theme.brand.background}20`,
          color: theme.brand.background
        }}
        title="Share session"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span className="text-sm">Share</span>
      </button>

      <ShareSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sessionId={sessionId}
      />
    </>
  );
} 