'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { ENDPOINTS } from '@/config/endpoints';
import { theme } from '@/config/theme';

interface RegisterResponse {
  message: string;
  token: string;
}

export default function RegisterPage() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { post } = useApi();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER.path, { 
        username, 
        email, 
        password 
      });
      
      console.log(response.message);

      // Safely store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
      }
      
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{backgroundColor: theme.background.primary}}>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold" style={{color: theme.typography.primary}}>
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm" style={{color: theme.typography.secondary}}>
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium" style={{color: theme.brand.background}}>
              Sign in
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
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 focus:outline-none focus:z-10 sm:text-sm" style={{borderColor: theme.border, color: theme.typography.primary}}
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
                minLength={8}
                className="appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 focus:outline-none focus:z-10 sm:text-sm" style={{borderColor: theme.border, color: theme.typography.primary}}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                minLength={8}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 rounded-b-md focus:outline-none focus:z-10 sm:text-sm" style={{borderColor: theme.border, color: theme.typography.primary}}
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}