'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { login, register } from '../services/api';
import { useRouter } from 'next/navigation';
import { setCookie, deleteCookie } from 'cookies-next';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string) => Promise<void>;
  register: (username: string, email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (e.g., from cookies)
    const token = document.cookie.split('; ').find(row => row.startsWith('token='));
    if (token) {
      const userCookie = document.cookie.split('; ').find(row => row.startsWith('user='));
      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        setUser(userData);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await login(email);
      setUser(response.user);
      setCookie('user', JSON.stringify(response.user));
      setCookie('token', response.token);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await register(username, email);
      setUser(response.user);
      setCookie('user', JSON.stringify(response.user));
      setCookie('token', response.token);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    deleteCookie('user');
    deleteCookie('token');
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 