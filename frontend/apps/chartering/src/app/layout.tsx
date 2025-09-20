import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import './globals.css';
import LayoutWrapper from './components/LayoutWrapper';

export const metadata: Metadata = {
  title: "Chartering App",
  description: "Voyage and Chartering Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50">
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <Toaster />
      </body>
    </html>
  );
}
