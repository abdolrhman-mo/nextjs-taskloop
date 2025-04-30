'use client';

import React from 'react';
import Link from 'next/link';
import { theme } from '@/config/theme';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen" style={{backgroundColor: theme.background.primary}}>
      <header className="shadow" style={{backgroundColor: theme.background.secondary, borderBottom: `1px solid ${theme.border}`}}>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold" style={{color: theme.typography.primary}}>
              TaskLoop
            </Link>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link 
                    href="/auth/login" 
                    className="text-gray-600 hover:text-gray-900"
                    style={{color: theme.typography.secondary}}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/auth/register" 
                    className="text-gray-600 hover:text-gray-900"
                    style={{color: theme.typography.secondary}}
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 