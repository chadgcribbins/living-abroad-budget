'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../ui';

interface NavBarProps {
  title?: string;
  logo?: React.ReactNode;
  className?: string;
}

const NavBar = ({
  title = 'Living Abroad Budget',
  logo,
  className = '',
}: NavBarProps) => {
  return (
    <div className={`navbar bg-base-200 shadow-sm ${className}`}>
      <div className="container mx-auto">
        <div className="flex-1">
          <Link href="/" className="flex items-center">
            {logo && <span className="mr-2">{logo}</span>}
            <span className="font-bold text-xl">{title}</span>
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/components">Components</Link>
            </li>
            <li>
              <Link href="/scenarios">Scenarios</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default NavBar; 