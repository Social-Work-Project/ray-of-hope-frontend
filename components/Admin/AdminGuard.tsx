'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/adminStore';
import type { ReactNode } from 'react';

export function AdminGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAdminStore(s => s.isAuthenticated);
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) router.replace('/admin/login');
  }, [isAuthenticated, router]);
  if (!isAuthenticated) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--blue)' }} />
    </div>
  );
  return <>{children}</>;
}