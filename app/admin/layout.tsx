import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin Panel | Ray of Hope Society' };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen  bg-gray-50">{children}</div>;
}