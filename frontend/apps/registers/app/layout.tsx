import type { Metadata } from 'next';
import './globals.css';
import { AppLayout, SimpleCache } from '@commercialapp/ui';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Registers App',
  description: 'Ship, Port, and Agent Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50">
        <AppLayout>
          <SimpleCache appName="Registers" />
          {children}
        </AppLayout>
        <Toaster />
      </body>
    </html>
  );
} 