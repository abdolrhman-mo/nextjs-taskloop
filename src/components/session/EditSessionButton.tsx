import { useTheme } from '@/contexts/ThemeContext';

interface EditSessionButtonProps {
  onClick: () => void;
}

export function EditSessionButton({ onClick }: EditSessionButtonProps) {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-lg hover:bg-opacity-10 transition-colors duration-200 cursor-pointer"
      style={{ 
        backgroundColor: `${theme.brand.background}20`,
        color: theme.brand.background
      }}
      title="Edit session name"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </button>
  );
} 