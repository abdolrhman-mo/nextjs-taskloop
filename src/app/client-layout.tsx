'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/utils/auth';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if already on login page or if authenticated
    if (pathname === '/auth/login' || pathname === '/auth/register' || auth.isAuthenticated()) {
      return;
    }

    // Redirect to login if not authenticated
    router.push('/auth/login');
  }, [pathname, router]);

  return <>{children}</>;
} 