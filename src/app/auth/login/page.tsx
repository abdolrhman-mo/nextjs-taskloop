'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { theme } from '@/config/theme';

interface LoginResponse {
  message: string;
  token: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { post } = useApi();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await post<LoginResponse>(ENDPOINTS.AUTH.LOGIN.path, { username, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        router.push('/');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{backgroundColor: theme.background.primary}}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold" style={{color: theme.typography.primary}}>
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm" style={{color: theme.typography.secondary}}>
            Or{' '}
            <Link href="/auth/register" className="font-medium" style={{color: theme.typography.primary}}>
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6 p-8 rounded-xl shadow-md" style={{backgroundColor: theme.background.secondary, border: `1px solid ${theme.border}`}} onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                placeholder="Username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 rounded-t-md focus:outline-none focus:z-10 sm:text-sm" style={{borderColor: theme.border, color: theme.typography.primary}}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" style={{borderColor: theme.border, color: theme.typography.primary}}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-center" style={{color: theme.error.DEFAULT}}>{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md" style={{backgroundColor: theme.brand.background, color: theme.brand.text, opacity: loading ? 0.5 : 1}}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 