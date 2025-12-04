'use client';

import { AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const [lateCount, setLateCount] = useState<number>(0);

  useEffect(() => {
    // Fetch late orders count
    fetch('/api/repair-orders/late')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLateCount(data.count || 0);
        }
      })
      .catch(err => console.error('Error fetching late orders count:', err));
  }, [pathname]);

  const navItems = [
    {
      href: '/',
      label: 'Início',
      icon: Home,
      active: pathname === '/',
      badge: null,
    },
    {
      href: '/atrasadas',
      label: 'Atrasadas',
      icon: AlertCircle,
      active: pathname === '/atrasadas',
      badge: lateCount > 0 ? lateCount : null,
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">P</span>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">Pipelore</div>
            </Link>
            <div className="flex gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all relative
                      ${
                        item.active
                          ? 'bg-white text-blue-700 shadow-md scale-105'
                          : 'text-blue-50 hover:bg-white/20 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                    {item.badge !== null && (
                      <span className="ml-1 px-2.5 py-1 text-xs font-bold bg-red-500 text-white rounded-full shadow-lg animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
