import { useTheme } from '@/contexts/ThemeContext';

interface ShareSessionButtonProps {
  onClick: () => void;
  isCopied: boolean;
}

export function ShareSessionButton({ onClick, isCopied }: ShareSessionButtonProps) {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-lg hover:bg-opacity-10 transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
      style={{ 
        backgroundColor: `${theme.brand.background}20`,
        color: theme.brand.background
      }}
      title="Copy session link"
    >
      {isCopied ? (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm">Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">Share</span>
        </>
      )}
    </button>
  );
} 