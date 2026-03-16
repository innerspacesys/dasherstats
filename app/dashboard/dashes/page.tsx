import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Download, Pencil, PlusCircle, Rows3 } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getHours, getMiles, summarizeDashes, toCurrency, toPercent } from '@/lib/calculations';
import type { DashRow } from '@/lib/types';

export default async function DashesPage() {
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
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="space-y-4">
        <PageHeader />
        <div className="card p-6">
          <p className="text-sm text-[var(--danger)]">{error.message}</p>
        </div>
      </div>
    );
  }

  const rows = (dashes ?? []) as DashRow[];
  const summary = summarizeDashes(rows);

  return (
    <div className="space-y-6">
      <PageHeader />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <SummaryCard label="Gross" value={toCurrency(summary.totalGross)} />
        <SummaryCard label="Taxes" value={toCurrency(summary.totalTax)} />
        <SummaryCard label="Extra held" value={toCurrency(summary.totalExtraHoldback)} />
        <SummaryCard label="Net" value={toCurrency(summary.totalNet)} />
        <SummaryCard label="Hours" value={String(summary.totalHours)} />
      </section>

      {rows.length === 0 ? (
        <div className="card p-6 sm:p-8">
          <h2 className="text-lg font-semibold">No dashes yet</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Start logging shifts so you can see totals, holdbacks, and trends.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link href="/dashboard/dashes/new" className="btn-primary w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add your first dash
            </Link>

            <Link href="/dashboard/dashes/batch" className="btn-secondary w-full">
              <Rows3 className="mr-2 h-4 w-4" />
              Batch add
            </Link>

            <Link href="/dashboard/dashes/import" className="btn-secondary w-full">
              <Download className="mr-2 h-4 w-4" />
              Import history
            </Link>
          </div>
        </div>
      ) : (
        <>
          <section className="space-y-3 lg:hidden">
            {rows.map((dash) => (
              <MobileDashCard key={dash.id} dash={dash} />
            ))}
          </section>

          <section className="card hidden overflow-hidden lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--muted)]/60 text-left text-[var(--muted-foreground)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Driver</th>
                    <th className="px-4 py-3 font-medium">Gross</th>
                    <th className="px-4 py-3 font-medium">Tax</th>
                    <th className="px-4 py-3 font-medium">Extra</th>
                    <th className="px-4 py-3 font-medium">Net</th>
                    <th className="px-4 py-3 font-medium">Hours</th>
                    <th className="px-4 py-3 font-medium">Miles</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((dash) => {
                    const hours = getHours(dash.start_time, dash.end_time);
                    const miles = getMiles(dash.start_odometer, dash.end_odometer);

                    return (
                      <tr key={dash.id} className="border-b border-[var(--border)] last:border-b-0">
                        <td className="px-4 py-4">{formatDate(dash.dash_date)}</td>
                        <td className="px-4 py-4">{dash.driver_name || '-'}</td>
                        <td className="px-4 py-4 font-medium">{toCurrency(dash.gross_amount)}</td>
                        <td className="px-4 py-4">{toCurrency(dash.tax_amount ?? 0)}</td>
                        <td className="px-4 py-4">
                          {toCurrency(dash.extra_holdback_amount ?? 0)}
                        </td>
                        <td className="px-4 py-4 font-semibold">{toCurrency(dash.net_amount ?? 0)}</td>
                        <td className="px-4 py-4">{hours || '-'}</td>
                        <td className="px-4 py-4">{miles || '-'}</td>
                        <td className="px-4 py-4 text-right">
                          <Link
                            href={`/dashboard/dashes/${dash.id}/edit`}
                            className="btn-secondary"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashes</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Review every logged shift, holdback, and final net amount.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:justify-end">
        <Link href="/dashboard/dashes/new" className="btn-primary w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add dash
        </Link>

        <Link href="/dashboard/dashes/batch" className="btn-secondary w-full">
          <Rows3 className="mr-2 h-4 w-4" />
          Batch add
        </Link>

        <Link href="/dashboard/dashes/import" className="btn-secondary w-full">
          <Download className="mr-2 h-4 w-4" />
          Import
        </Link>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

function MobileDashCard({ dash }: { dash: DashRow }) {
  const hours = getHours(dash.start_time, dash.end_time);
  const miles = getMiles(dash.start_odometer, dash.end_odometer);

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold">{formatDate(dash.dash_date)}</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {dash.driver_name || 'No driver name'}
          </p>
        </div>

        <Link
          href={`/dashboard/dashes/${dash.id}/edit`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--muted)]"
          aria-label="Edit dash"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <MiniStat label="Gross" value={toCurrency(dash.gross_amount)} />
        <MiniStat label="Net" value={toCurrency(dash.net_amount ?? 0)} />
        <MiniStat label="Tax" value={toCurrency(dash.tax_amount ?? 0)} />
        <MiniStat
          label={dash.extra_holdback_label || 'Extra'}
          value={toCurrency(dash.extra_holdback_amount ?? 0)}
        />
        <MiniStat label="Hours" value={hours ? String(hours) : '-'} />
        <MiniStat label="Miles" value={miles ? String(miles) : '-'} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
        <span className="pill">Tax {toPercent(dash.tax_rate ?? 0)}</span>
        <span className="pill">
          {dash.extra_holdback_label || 'Extra'} {toPercent(dash.extra_holdback_percent ?? 0)}
        </span>
      </div>

      {dash.notes ? (
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">{dash.notes}</p>
      ) : null}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--muted)] p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}