'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/utils/auth';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run auth check after hydration
    if (!isClient) return;

    // Don't redirect if already on login page or if authenticated
    if (pathname === '/auth/login' || pathname === '/auth/register' || auth.isAuthenticated()) {
      return;
    }

    // Redirect to login if not authenticated
    router.push('/auth/login');
  }, [pathname, router, isClient]);

  // During SSR and initial hydration, render children without auth check
  if (!isClient) {
    return <>{children}</>;
  }

  return <>{children}</>;
} 