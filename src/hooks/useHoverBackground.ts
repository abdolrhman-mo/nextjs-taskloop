import { useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const useHoverBackground = () => {
  const { theme } = useTheme();

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = theme.hover;
  }, [theme.hover]);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  }, []);

  return {
    handleMouseEnter,
    handleMouseLeave,
    style: { 
      backgroundColor: 'transparent',
      transition: 'background-color 0.2s ease-in-out'
    }
  };
};