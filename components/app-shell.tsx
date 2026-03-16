'use client';

import type { ReactNode } from 'react';
import { AppSidebar } from './app-sidebar';
import { MobileBottomNav } from './mobile-bottom-nav';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] lg:block">
          <AppSidebar />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8 lg:pt-8">
            {children}
          </main>
        </div>
      </div>

      <div className="lg:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}