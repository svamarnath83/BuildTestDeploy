'use client';

import { AppLayout, SimpleCache } from '@commercialapp/ui';
import { usePathname } from 'next/navigation';
import ProtectedRoute from './ProtectedRoute';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  // All pages are protected and get AppLayout (shared auth system)
  return (
    <ProtectedRoute>
      <AppLayout>
        <SimpleCache appName="VoyageManager" />
        {children}
      </AppLayout>
    </ProtectedRoute>
  );
}