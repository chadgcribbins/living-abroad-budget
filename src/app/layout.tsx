import React from 'react';
import './globals.css';
import { Metadata } from 'next';
import { StoreProvider } from '@/store/StoreProvider';

export const metadata: Metadata = {
  title: 'Living Abroad Budget Tool',
  description: 'Plan your international move with confidence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-screen bg-base-100">
        <StoreProvider>
          <main>{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
} 