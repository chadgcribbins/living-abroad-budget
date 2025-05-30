import { ReactNode } from 'react';
import './globals.css';
import { Metadata } from 'next';
import { StoreProvider } from '@/store/StoreProvider';

export const metadata: Metadata = {
  title: 'Living Abroad Budget',
  description: 'A modern budgeting platform for planning international moves',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-screen bg-base-100">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
} 