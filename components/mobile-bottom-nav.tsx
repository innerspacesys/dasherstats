'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { BarChart3, Home, PlusCircle, Settings, Wallet } from 'lucide-react';

const items = [
  { href: '/dashboard', label: 'Home', icon: Home, segment: null },
  { href: '/dashboard/dashes', label: 'Dashes', icon: Wallet, segment: 'dashes' },
  { href: '/dashboard/dashes/new', label: 'Add', icon: PlusCircle, segment: 'null' },
  { href: '/dashboard/insights', label: 'Insights', icon: BarChart3, segment: 'insights' },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, segment: 'settings' },
];

export function MobileBottomNav() {
  const segment = useSelectedLayoutSegment();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[color:var(--card-strong)]/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur lg:hidden">
      <ul className="grid grid-cols-5 gap-1">
        {items.map(({ href, label, icon: Icon, segment: itemSegment }) => {
          const active =
            itemSegment === null ? segment === null : segment === itemSegment;

          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium transition ${
                  active
                    ? 'bg-[var(--foreground)] text-[var(--background)]'
                    : 'text-[var(--muted-foreground)]'
                }`}
              >
                <Icon className="mb-1 h-5 w-5" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}