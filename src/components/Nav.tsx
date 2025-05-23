'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { theme } from '@/config/theme';
import { useState, useEffect, useRef } from 'react';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const Nav = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { get } = useApi();

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <nav 
      className="py-4 px-4 sm:px-6 lg:px-8 shadow-md mb-8"
      style={{
        backgroundColor: theme.background.secondary, // Or theme.background.primary if you prefer
        borderBottom: `1px solid ${theme.border}`
      }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link 
          href="/" 
          className="text-2xl sm:text-3xl font-extrabold tracking-tight hover:opacity-80 transition-opacity cursor-pointer"
          style={{ color: theme.brand.background }}
        >
          TaskLoop
        </Link>

        {/* User menu */}
        {username && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-opacity-10 transition-colors duration-200 cursor-pointer"
              style={{
                backgroundColor: `${theme.brand.background}20`,
                color: theme.typography.primary 
              }}
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

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-10"
                style={{ 
                  backgroundColor: theme.background.secondary,
                  border: `1px solid ${theme.border}`
                }}
              >
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 transition-colors duration-200 cursor-pointer"
                  style={{ 
                    color: theme.typography.primary,
                    backgroundColor: `${theme.brand.background}20`
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}; 