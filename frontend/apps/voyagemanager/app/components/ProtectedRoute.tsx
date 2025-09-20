'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { tokenManager } from '@commercialapp/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user has a valid token
        const isAuth = tokenManager.isAuthenticated();
        
        if (!isAuth) {
          console.log('Not authenticated, redirecting to auth app');
          // Redirect to shared auth app
          window.location.href = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3002';
          return;
        }

        console.log('User authenticated');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        // Redirect to shared auth app
        window.location.href = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3002';
      } finally {
        setIsLoading(false);
      }
    };

    // Initial auth check
    checkAuth();

    // Set up continuous auth monitoring
    const authCheckInterval = setInterval(() => {
      const isAuth = tokenManager.isAuthenticated();
      
      if (!isAuth) {
        console.log('Authentication lost during session, redirecting to auth app');
        setIsAuthenticated(false);
        window.location.href = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3002';
      }
    }, 30000); // Check every 30 seconds

    // Cleanup interval on unmount
    return () => {
      clearInterval(authCheckInterval);
    };
  }, [router]);

  // Remove login page check since we use shared auth

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}