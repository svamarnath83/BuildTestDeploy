import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Login to your account',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50 min-h-screen flex items-center justify-center">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
