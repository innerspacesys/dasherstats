import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashForm } from '@/components/dash-form';
import { DEFAULT_SELF_EMPLOYMENT_TAX_RATE } from '@/lib/types';
import { getCombinedTaxRate } from '@/lib/profile';

export default async function NewDashPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();

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
          <h1 className="text-2xl font-bold tracking-tight">Add a new dash</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">Fast mobile entry. The default tax rate comes from your settings.</p>
          <div className="mt-6">
            <DashForm profile={safeProfile} />
          </div>
        </div>
      </div>
    </main>
  );
}
