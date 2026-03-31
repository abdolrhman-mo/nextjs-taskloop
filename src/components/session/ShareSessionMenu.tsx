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
        className="px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 text-sm font-medium"
        style={{
          ...style,
          color: theme.typography.primary,
        }}
        title="Share study room"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span>Add friends</span>
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
