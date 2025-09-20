'use client';

import { AppLayout, SimpleCache } from '@commercialapp/ui';
import { usePathname } from 'next/navigation';
import ProtectedRoute from './ProtectedRoute';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    // Login page gets clean layout without protection
    return (
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    );
  }

  // All other pages are protected and get AppLayout
  return (
    <ProtectedRoute>
      <AppLayout>
        <SimpleCache appName="Chartering" />
        {children}
      </AppLayout>
    </ProtectedRoute>
  );
}
