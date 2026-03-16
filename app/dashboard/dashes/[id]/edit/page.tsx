import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashForm } from '@/components/dash-form';
import { DEFAULT_SELF_EMPLOYMENT_TAX_RATE } from '@/lib/types';
import { getCombinedTaxRate } from '@/lib/profile';

export default async function EditDashPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [{ data: dash }, { data: profile }] = await Promise.all([
    supabase.from('dashes').select('*').eq('id', id).eq('user_id', user.id).maybeSingle(),
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
  ]);

  if (!dash) notFound();

  const safeProfile = profile ?? {
    id: user.id,
    email: user.email ?? null,
    display_name: null,
    home_state: 'TN',
    self_employment_tax_rate: DEFAULT_SELF_EMPLOYMENT_TAX_RATE,
    income_tax_rate: 0,
    combined_tax_rate: getCombinedTaxRate('TN'),
    payout_method_label: null,
    payout_method_last4: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <main className="page-shell">
      <div className="container-width max-w-3xl">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)]">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="fade-up card p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight">Edit dash</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">Fix any number, note, or payout detail without re-entering everything.</p>
          <div className="mt-6">
            <DashForm mode="edit" initialDash={dash} profile={safeProfile} />
          </div>
        </div>
      </div>
    </main>
  );
}
