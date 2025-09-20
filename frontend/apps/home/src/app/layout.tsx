import type { Metadata } from "next";
import './globals.css';

export const metadata: Metadata = {
  title: "Shipnet Home",
  description: "Shipnet Application Landing Page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50">
        {children}
      </body>
    </html>
  );
}
