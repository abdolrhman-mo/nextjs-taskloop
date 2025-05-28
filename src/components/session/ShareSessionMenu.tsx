import { useState, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useHoverBackground } from '@/hooks/useHoverBackground';
import { ShareSessionDropdown } from './ShareSessionDropdown';

interface ShareSessionMenuProps {
  sessionId: string;
}

export function ShareSessionMenu({ sessionId }: ShareSessionMenuProps) {
  const { theme } = useTheme();
  const { handleMouseEnter, handleMouseLeave, style } = useHoverBackground();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 font-semibold"
        style={{
          ...style,
          color: theme.typography.primary,
        }}
        title="Share study room"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span className="text-base">Add friends</span>
      </button>
      {isDropdownOpen && (
        <ShareSessionDropdown
          onClose={() => setIsDropdownOpen(false)}
          sessionId={sessionId}
          triggerRef={triggerRef as React.RefObject<HTMLElement | HTMLButtonElement>}
        />
      )}
    </div>
  );
} 
