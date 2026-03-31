import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useHoverBackground } from '@/hooks/useHoverBackground';

interface BackButtonProps {
  href: string;
}

export function BackButton({ href }: BackButtonProps) {
  const { theme } = useTheme();
  const { handleMouseEnter, handleMouseLeave, style } = useHoverBackground();

  return (
    <Link
      href={href}
      className="p-2 rounded-lg transition-colors duration-200 cursor-pointer flex items-center"
      style={{
        ...style,
        color: theme.typography.primary
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
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </Link>
  );
} 