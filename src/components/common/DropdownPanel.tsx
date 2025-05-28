import { useRef, useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface DropdownPanelProps {
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  width?: number;
  triggerRef?: React.RefObject<HTMLButtonElement | HTMLElement | null>;
}

export function DropdownPanel({ 
  onClose, 
  title, 
  description, 
  children,
  width = 400,
  triggerRef
}: DropdownPanelProps) {
  const { theme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    function handleClickOutside(event: MouseEvent) {
      // Don't close if clicking the trigger button
      if (triggerRef?.current?.contains(event.target as Node)) {
        return;
      }
      // Close if clicking outside both the dropdown and trigger
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Trigger exit animation
        setIsVisible(false);
        // Wait for animation to complete before calling onClose
        setTimeout(onClose, 150);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose, triggerRef]);

  return (
    <div
      ref={dropdownRef}
      className={`
        absolute right-0 mt-2 z-50 rounded-lg shadow-2xl overflow-hidden
        transition-all duration-150 ease-out
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-2 pointer-events-none'
        }
      `}
      style={{
        backgroundColor: theme.background.secondary,
        border: `1px solid ${theme.border}`,
        width: `${width}px`,
        maxWidth: 'calc(100vw - 2rem)',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: theme.border }}>
        <h3 className="text-lg font-semibold" style={{ color: theme.typography.primary }}>
          {title}
        </h3>
      </div>
      {/* Description */}
      {description && (
        <div className="p-6">
          <p className="text-sm text-center" style={{ color: theme.typography.secondary }}>
            {description}
          </p>
        </div>
      )}
      {/* Content */}
      {children}
    </div>
  );
} 