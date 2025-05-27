import { useTheme } from '@/contexts/ThemeContext';
import { useHoverBackground } from '@/hooks/useHoverBackground';

interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  isDestructive?: boolean;
  isLoading?: boolean;
  error?: string | null;
}

interface DropdownMenuProps {
  items: MenuItem[];
  isOpen: boolean;
  className?: string;
}

export const DropdownMenu = ({ items, isOpen, className = '' }: DropdownMenuProps) => {
  const { theme } = useTheme();
  const { handleMouseEnter, handleMouseLeave, style } = useHoverBackground();

  return (
    <div 
      className={`
        absolute right-0 mt-1 w-48 rounded-lg shadow-lg py-1 z-10
        transition-all duration-200 ease-in-out
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
        ${className}
      `}
      style={{ 
        backgroundColor: theme.background.secondary,
        border: `1px solid ${theme.border}`,
        boxShadow: `0 4px 6px -1px ${theme.border}20, 0 2px 4px -1px ${theme.border}10`
      }}
    >
      <div className="" role="menu" aria-orientation="vertical">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 cursor-pointer"
            style={{ 
              ...style,
              color: item.isDestructive ? theme.error.DEFAULT : theme.typography.primary,
              backgroundColor: item.isLoading ? `${item.isDestructive ? theme.error.DEFAULT : theme.brand.background}10` : 'transparent'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            disabled={item.isLoading}
            role="menuitem"
          >
            {item.isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {item.label}...
              </>
            ) : item.error ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {item.error}
              </>
            ) : (
              <>
                {item.icon}
                {item.label}
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}; 