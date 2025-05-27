import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useHoverBackground } from '@/hooks/useHoverBackground';

interface BackButtonProps {
  href: string;
  className?: string;
}

export function BackButton({ href, className = '' }: BackButtonProps) {
  const { theme } = useTheme();
  const { handleMouseEnter, handleMouseLeave, style } = useHoverBackground();

  return (
    <Link 
      href={href}
      className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${className}`}
      style={{
        ...style,
        color: theme.brand.background
      }}
      title="Go back"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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