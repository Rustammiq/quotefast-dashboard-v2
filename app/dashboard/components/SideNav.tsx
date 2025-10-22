
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Users, Settings } from 'lucide-react';
import { NavItem } from '@/types/ui/dashboard';
import { cn } from '@/lib/utils';

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: <Home /> },
  { title: 'Quotes', href: '/dashboard/quotes', icon: <FileText /> },
  { title: 'Customers', href: '/dashboard/customers', icon: <Users /> },
  { title: 'Settings', href: '/dashboard/settings', icon: <Settings /> },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 h-full bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">QuoteFast</h2>
      </div>
      <ul>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                'flex items-center p-2 rounded-md hover:bg-gray-700',
                { 'bg-gray-700': pathname === item.href }
              )}
            >
              {item.icon}
              <span className="ml-2">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
