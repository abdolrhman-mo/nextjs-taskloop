import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

interface BackButtonProps {
  href: string;
  className?: string;
}

export function BackButton({ href, className = '' }: BackButtonProps) {
  const { theme } = useTheme();

  return (
    <Link 
      href={href}
      className={`p-2 rounded-lg hover:bg-opacity-10 transition-all duration-200 cursor-pointer ${className}`}
      style={{
        backgroundColor: `${theme.brand.background}20`,
        color: theme.brand.background
      }}
      title="Go back"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
    </Link>
  );
} 