'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import RouteGuard from '@/components/guards/RouteGuard';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard requireCompleteProfile={true}>
      <AppLayout>{children}</AppLayout>
    </RouteGuard>
  );
} 