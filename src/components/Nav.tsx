'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DropdownMenu } from './common/DropdownMenu';
import { useHoverBackground } from '@/hooks/useHoverBackground';
import { Logo } from './common/Logo';
import { ConfirmationModal } from './common/ConfirmationModal';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface NavProps {
  children?: React.ReactNode;
}

export const Nav = ({ children }: NavProps) => {
  const { theme } = useTheme();
  const [username, setUsername] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { get } = useApi();
  const { handleMouseEnter, handleMouseLeave, style } = useHoverBackground();

  // Get username from /auth/me endpoint
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await get<User>(ENDPOINTS.AUTH.ME.path);
        setUsername(userData.username);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    fetchUserData();
  }, [get]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear the token from localStorage
      localStorage.removeItem('token');
      
      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const menuItems = [
    {
      label: 'Logout',
      onClick: () => {
        setShowLogoutConfirm(true);
        setIsDropdownOpen(false);
      },
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )
    }
  ];

  return (
    <>
    <nav 
      className="py-4 px-4 sm:px-6 lg:px-8 fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: theme.background.primary,
        // borderBottom: `1px solid ${theme.border}`
      }}
      >
      <div className="max-w-8xl mx-auto flex justify-between items-center">
        {/* Left section - Logo */}
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Middle section - Optional children */}
        {children && (
          <div 
            className="flex-1 flex justify-center items-center px-4"
            style={{
              color: theme.typography.primary
            }}
          >
            {children}
          </div>
        )}

        {/* Right section - User controls */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* User menu */}
          {username && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1 rounded-lg transition-colors duration-200 cursor-pointer"
                style={{
                  ...style,
                  color: theme.typography.primary 
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="font-medium">{username}</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <DropdownMenu 
                items={menuItems}
                isOpen={isDropdownOpen}
                className="mt-2"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
    <div className='h-14'></div>

    {/* Logout Confirmation Modal */}
    <ConfirmationModal
      isOpen={showLogoutConfirm}
      onClose={() => {
        if (!isLoggingOut) {
          setShowLogoutConfirm(false);
        }
      }}
      onConfirm={handleLogout}
      title="Logout"
      message="Are you sure you want to logout? You will need to login again to access your study rooms."
      confirmText={isLoggingOut ? "Logging out..." : "Logout"}
      isDestructive={false}
      isConfirming={isLoggingOut}
    />
    </>
  );
}; 