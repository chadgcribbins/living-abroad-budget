'use client';

import React from 'react';
import { RouteGuard } from '@/components/guards';

export default function ScenariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard requireCompleteProfile={true}>
      {children}
    </RouteGuard>
  );
} 