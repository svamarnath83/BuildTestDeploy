import type { Metadata } from "next";
import AccountingSidebar from "../components/AccountingSidebar";
import './globals.css';

export const metadata: Metadata = {
  title: "Accounting App",
  description: "Financial Management and Accounting System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AccountingSidebar>
          {children}
        </AccountingSidebar>
      </body>
    </html>
  );
}
