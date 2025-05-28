import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { Repeat } from 'lucide-react';
import { Jua } from 'next/font/google';

const jua = Jua({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

interface LogoProps {
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ 
  className = '', 
  showIcon = true,
  size = 'md'
}: LogoProps) {
  const { theme } = useTheme();

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl'
  };

  return (
    <Link 
      href="/" 
      className={`font-bold tracking-tight cursor-pointer ${jua.className} flex items-center justify-center gap-1 h-10 ${className}`}
      style={{ color: theme.brand.background }}
    >
      {showIcon && <Repeat className={`${size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'}`} />}
      <span 
        className={`${sizeClasses[size]} top-0 md:translate-y-[2px]`}
        style={{ color: theme.typography.primary }}
      >
        TaskLoop
      </span>
    </Link>
  );
} 