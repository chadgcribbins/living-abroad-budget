'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useProfile } from '@/store/hooks';

interface RouteGuardProps {
  children: ReactNode;
  requireCompleteProfile?: boolean;
}

/**
 * RouteGuard component that protects routes based on completion status
 * Can be used to prevent access to routes that require certain data
 */
const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requireCompleteProfile = false 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isComplete } = useProfile();

  useEffect(() => {
    // If profile completion is required but not complete,
    // redirect to profile page
    if (requireCompleteProfile && !isComplete && pathname !== '/profile') {
      router.push('/profile');
    }
  }, [router, pathname, isComplete, requireCompleteProfile]);

  // If we're checking for profile completion and it's not complete,
  // and we're not already on the profile page, don't render children
  if (requireCompleteProfile && !isComplete && pathname !== '/profile') {
    return (
      <div className="container mx-auto py-12">
        <div className="alert alert-warning shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Profile completion required. Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteGuard; 