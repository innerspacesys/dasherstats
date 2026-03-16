'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { LogOut, Plus, Settings, MoonStar, SunMedium, Brain, Pencil, Trash2, Wallet } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { formatPaymentLabel, getHours, getMiles, getNetAfterHoldbacks, getNetHourly, getTaxToKeep, summarizeDashes, toCurrency, toPercent } from '@/lib/calculations';
import type { DashRow, ProfileRow } from '@/lib/types';
import { AiCard } from './ai-card';
import { ThemeToggle } from './theme-provider';

export function DashboardView({
  dashes,
  profile,
  userEmail,
}: {
  dashes: DashRow[];
  profile: ProfileRow;
  userEmail: string | undefined;
}) {
  const summary = useMemo(() => summarizeDashes(dashes), [dashes]);
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState(dashes);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  async function deleteDash(id: string) {
    const confirmed = window.confirm('Delete this dash entry?');
    if (!confirmed) return;

    setDeletingId(id);
    const { error } = await supabase.from('dashes').delete().eq('id', id);
    if (!error) {
      setItems((prev) => prev.filter((dash) => dash.id !== id));
    } else {
      window.alert(error.message);
    }
    setDeletingId(null);
  }

  const liveSummary = useMemo(() => summarizeDashes(items), [items]);

  return (
    <main className="page-shell">
      <div className="container-width">
        <div className="fade-up mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="pill inline-flex items-center gap-2">
              <Wallet className="h-3.5 w-3.5" />
              {profile.home_state || 'No state'} · combined tax {toPercent(profile.combined_tax_rate)}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Hey {profile.display_name || profile.email?.split('@')[0] || 'driver'}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{userEmail}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/dashboard/new" className="btn-primary justify-center">
              <Plus className="mr-2 h-4 w-4" />
              New dash
            </Link>
            <Link href="/dashboard/settings" className="btn-secondary justify-center">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
            <button className="btn-secondary justify-center" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </button>
          </div>
        </div>

        <section className="fade-up stagger-1 grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Gross" value={toCurrency(liveSummary.totalGross)} />
          <StatCard label="Set aside" value={toCurrency(liveSummary.totalTax)} />
          <StatCard label="After tax" value={toCurrency(liveSummary.totalNet)} />
          <StatCard label="Hours" value={String(liveSummary.totalHours)} />
          <StatCard label="Miles" value={String(liveSummary.totalMiles)} />
          <StatCard label="Net/hr" value={toCurrency(liveSummary.avgNetHourly)} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <div className="fade-up stagger-2 card overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                  <h2 className="text-base font-semibold">Recent dashes</h2>
                  <p className="text-sm text-[var(--muted-foreground)]">Tap edit for corrections or delete junk entries.</p>
                </div>
                <div className="text-sm text-[var(--muted-foreground)]">{items.length} entries shown</div>
              </div>

              <div className="divide-y divide-[var(--border)]">
                {items.length === 0 ? (
                  <div className="p-5 text-sm text-[var(--muted-foreground)]">No dashes logged yet. Add your first one.</div>
                ) : (
                  items.map((dash) => {
                    const hours = getHours(dash.start_time, dash.end_time);
                    const miles = getMiles(dash.start_odometer, dash.end_odometer);
                    const taxes = getTaxToKeep(dash.gross_amount, dash.tax_rate);
                    const net = getNetAfterHoldbacks(dash.gross_amount, dash.tax_rate, dash.extra_holdback_percent || 0);
                    const netHourly = getNetHourly(dash.gross_amount, dash.tax_rate, hours, dash.extra_holdback_percent || 0);

                    return (
                      <div key={dash.id} className="p-4 transition hover:bg-[var(--accent-soft)]/60 sm:p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex-1">
                            <p className="font-semibold">
                              {dash.driver_name || profile.display_name || 'Driver'} · {dash.dash_date}
                            </p>
                            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                              {miles} miles · {hours} hrs · {dash.payout_account || formatPaymentLabel(profile.payout_method_label, profile.payout_method_last4)}
                            </p>
                            {dash.payout_note || dash.notes ? (
                              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                {[dash.payout_note, dash.notes].filter(Boolean).join(' · ')}
                              </p>
                            ) : null}
                          </div>

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between md:min-w-[280px]">
                            <div className="text-left sm:text-right">
                              <p className="font-semibold">{toCurrency(dash.gross_amount)}</p>
                              <p className="text-sm text-[var(--muted-foreground)]">
                                Net {toCurrency(net)} · Tax {toCurrency(taxes)}
                              </p>
                              <p className="text-sm text-[var(--muted-foreground)]">Net/hr {toCurrency(netHourly)}</p>
                            </div>

                            <div className="flex gap-2">
                              <Link href={`/dashboard/${dash.id}/edit`} className="btn-secondary px-3 py-2">
                                <Pencil className="h-4 w-4" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => deleteDash(dash.id)}
                                disabled={deletingId === dash.id}
                                className="btn-danger px-3 py-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="fade-up stagger-2 card p-5">
              <div className="mb-4 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <p className="text-sm font-semibold">AI assistant</p>
              </div>
              <AiCard />
            </div>

            <div className="fade-up stagger-3 card p-5">
              <div className="mb-4 flex items-center gap-2">
                <MoonStar className="h-4 w-4" />
                <SunMedium className="h-4 w-4" />
                <p className="text-sm font-semibold">Appearance</p>
              </div>
              <ThemeToggle />
            </div>

            <div className="fade-up stagger-4 card p-5">
              <p className="text-sm font-semibold">Current defaults</p>
              <ul className="mt-3 space-y-2 text-sm text-[var(--muted-foreground)]">
                <li>Self-employment tax: {toPercent(profile.self_employment_tax_rate)}</li>
                <li>State income tax: {toPercent(profile.income_tax_rate)}</li>
                <li>Combined tax used by default: {toPercent(profile.combined_tax_rate)}</li>
                <li>Payout method placeholder: {formatPaymentLabel(profile.payout_method_label, profile.payout_method_last4)}</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
