import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Sparkles, TrendingUp, Wallet, Clock3, CarFront } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import {
  getHours,
  getMiles,
  summarizeDashes,
  toCurrency,
} from '@/lib/calculations';
import type { DashRow } from '@/lib/types';

export default async function InsightsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: dashes, error } = await supabase
    .from('dashes')
    .select('*')
    .eq('user_id', user.id)
    .order('dash_date', { ascending: false })
    .limit(90);

  if (error) {
    return (
      <div className="space-y-4">
        <Header />
        <div className="card p-6">
          <p className="text-sm text-[var(--danger)]">{error.message}</p>
        </div>
      </div>
    );
  }

  const rows = (dashes ?? []) as DashRow[];
  const summary = summarizeDashes(rows);

  const avgGrossPerDash =
    rows.length > 0 ? summary.totalGross / rows.length : 0;

  const avgNetPerDash =
    rows.length > 0 ? summary.totalNet / rows.length : 0;

  const bestDash = [...rows].sort((a, b) => (b.net_amount ?? 0) - (a.net_amount ?? 0))[0];

  const recent7 = rows.slice(0, 7);
  const recentGross = recent7.reduce((sum, dash) => sum + Number(dash.gross_amount || 0), 0);
  const recentNet = recent7.reduce((sum, dash) => sum + Number(dash.net_amount || 0), 0);
  const recentHours = recent7.reduce((sum, dash) => sum + getHours(dash.start_time, dash.end_time), 0);
  const recentMiles = recent7.reduce((sum, dash) => sum + getMiles(dash.start_odometer, dash.end_odometer), 0);

  return (
    <div className="space-y-6">
      <Header />

      {rows.length === 0 ? (
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-semibold">No data yet</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Log a few dashes first, then this page can show real insights.
          </p>
          <div className="mt-4">
            <Link href="/dashboard/dashes/new" className="btn-primary w-full sm:w-auto">
              Add a dash
            </Link>
          </div>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <InsightCard
              icon={Wallet}
              label="Average gross / dash"
              value={toCurrency(avgGrossPerDash)}
            />
            <InsightCard
              icon={TrendingUp}
              label="Average net / dash"
              value={toCurrency(avgNetPerDash)}
            />
            <InsightCard
              icon={Clock3}
              label="Average net / hour"
              value={toCurrency(summary.avgNetHourly)}
            />
            <InsightCard
              icon={CarFront}
              label="Average gross / hour"
              value={toCurrency(summary.avgHourly)}
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="card p-5">
              <h2 className="text-lg font-semibold">Current totals</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <BreakdownStat label="Gross" value={toCurrency(summary.totalGross)} />
                <BreakdownStat label="Tax held" value={toCurrency(summary.totalTax)} />
                <BreakdownStat label="Extra held" value={toCurrency(summary.totalExtraHoldback)} />
                <BreakdownStat label="Net kept" value={toCurrency(summary.totalNet)} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <BreakdownStat label="Total dashes" value={String(rows.length)} />
                <BreakdownStat label="Hours" value={String(summary.totalHours)} />
                <BreakdownStat label="Miles" value={String(summary.totalMiles)} />
                <BreakdownStat
                  label="Best net dash"
                  value={bestDash ? toCurrency(bestDash.net_amount ?? 0) : '$0.00'}
                />
              </div>
            </div>

            <div className="card p-5">
              <h2 className="text-lg font-semibold">Last 7 dashes</h2>
              <div className="mt-4 space-y-3 text-sm">
                <Row label="Gross" value={toCurrency(recentGross)} />
                <Row label="Net" value={toCurrency(recentNet)} />
                <Row label="Hours" value={String(Number(recentHours.toFixed(2)))} />
                <Row label="Miles" value={String(Number(recentMiles.toFixed(1)))} />
                <Row
                  label="Net / hour"
                  value={toCurrency(recentHours ? recentNet / recentHours : 0)}
                />
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            <div className="card p-5">
              <h2 className="text-lg font-semibold">Quick take</h2>
              <ul className="mt-4 space-y-3 text-sm text-[var(--muted-foreground)]">
                <li>
                  Your average net per dash is <span className="font-semibold text-[var(--foreground)]">{toCurrency(avgNetPerDash)}</span>.
                </li>
                <li>
                  Your average net per hour is <span className="font-semibold text-[var(--foreground)]">{toCurrency(summary.avgNetHourly)}</span>.
                </li>
                <li>
                  Your strongest single dash netted <span className="font-semibold text-[var(--foreground)]">{bestDash ? toCurrency(bestDash.net_amount ?? 0) : '$0.00'}</span>.
                </li>
                <li>
                  You have logged <span className="font-semibold text-[var(--foreground)]">{summary.totalMiles}</span> miles total.
                </li>
              </ul>
            </div>

            <div className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">AI insights</h2>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    This is the right place for OpenRouter summaries, trend spotting, and suggestions based on your recent dashes.
                  </p>
                </div>
                <div className="rounded-2xl bg-[var(--accent-soft)] p-3">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
                Example prompts:
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="pill">Summarize my last 7 dashes</span>
                  <span className="pill">Which shifts were most profitable?</span>
                  <span className="pill">What patterns do you notice?</span>
                </div>
              </div>

              <div className="mt-4">
                <Link href="/dashboard" className="btn-primary w-full sm:w-auto">
                  Open AI assistant
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function Header() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Insights</h1>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
        See what your dashes are really producing after holdbacks.
      </p>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
            {label}
          </p>
          <p className="mt-2 text-lg font-semibold">{value}</p>
        </div>
        <div className="rounded-2xl bg-[var(--accent-soft)] p-3">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function BreakdownStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--muted)] p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="font-semibold text-[var(--foreground)]">{value}</span>
    </div>
  );
}