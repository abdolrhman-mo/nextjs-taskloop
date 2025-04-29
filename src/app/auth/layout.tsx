import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              TaskLoop
            </Link>
            <nav>
              <ul className="flex space-x-4">
                {user ? (
                  <>
                    <li>
                      <span className="text-gray-600">Welcome, {user.username}</span>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth/register" className="text-gray-600 hover:text-gray-900">
                        Register
                      </Link>
                    </li>
                  </>
                )}
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