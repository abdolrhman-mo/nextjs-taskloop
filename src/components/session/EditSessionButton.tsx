import { useTheme } from '@/contexts/ThemeContext';
import { useHoverBackground } from '@/hooks/useHoverBackground';

interface EditSessionButtonProps {
  onClick: () => void;
}

export function EditSessionButton({ onClick }: EditSessionButtonProps) {
  const { theme } = useTheme();
  const { handleMouseEnter, handleMouseLeave, style } = useHoverBackground();

  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-lg transition-colors duration-200 cursor-pointer"
      style={{ 
        ...style,
        color: theme.brand.background
      }}
      title="Edit session name"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </button>
  );
} 