import { useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  isDestructive?: boolean;
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  title,
  message,
  confirmText,
  isDestructive = false
}: ConfirmationModalProps) {
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        style={{ 
          backgroundColor: theme.background.primary,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: theme.border }}>
          <h3 className="text-lg font-semibold" style={{ color: theme.typography.primary }}>
            {title}
          </h3>
        </div>

        {/* Message */}
        <div className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle 
              className="w-5 h-5 flex-shrink-0 mt-0.5" 
              style={{ color: isDestructive ? theme.error.DEFAULT : theme.typography.secondary }}
            />
            <p className="text-sm" style={{ color: theme.typography.secondary }}>
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t flex gap-3" style={{ borderColor: theme.border }}>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            style={{
              backgroundColor: isDestructive ? theme.error.DEFAULT : theme.brand.background,
              color: theme.background.primary
            }}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            style={{
              backgroundColor: `${theme.typography.secondary}20`,
              color: theme.typography.secondary
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 