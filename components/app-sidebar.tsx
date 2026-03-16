'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { BarChart3, Home, PlusCircle, Settings, Wallet } from 'lucide-react';

const items = [
  { href: '/dashboard', label: 'Overview', icon: Home, segment: null },
  { href: '/dashboard/dashes', label: 'Dashes', icon: Wallet, segment: 'dashes' },
  { href: '/dashboard/dashes/new', label: 'Add dash', icon: PlusCircle, segment: 'null' },
  { href: '/dashboard/insights', label: 'Insights', icon: BarChart3, segment: 'insights' },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, segment: 'settings' },
];

export function AppSidebar() {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="flex h-full flex-col p-4">
      <div className="px-3 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
          DashMetrx
        </p>
        <h1 className="mt-2 text-xl font-bold">Driver dashboard</h1>
      </div>

      <nav className="mt-4 space-y-2">
        {items.map(({ href, label, icon: Icon, segment: itemSegment }) => {
          const active =
            itemSegment === null ? segment === null : segment === itemSegment;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                active
                  ? 'bg-[var(--foreground)] text-[var(--background)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}