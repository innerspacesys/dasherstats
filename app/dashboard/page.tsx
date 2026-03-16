import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardView } from '@/components/dashboard-view';
import { OnboardingWizard } from '@/components/onboarding-wizard';
import { DEFAULT_SELF_EMPLOYMENT_TAX_RATE } from '@/lib/types';
import { getCombinedTaxRate } from '@/lib/profile';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [{ data: dashes }, { data: profile }] = await Promise.all([
    supabase
      .from('dashes')
      .select('*')
      .eq('user_id', user.id)
      .order('dash_date', { ascending: false })
      .limit(60),
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
  ]);

  const safeProfile = profile ?? {
    id: user.id,
    email: user.email ?? null,
    display_name: user.user_metadata?.display_name ?? null,
    home_state: 'GA',
    self_employment_tax_rate: DEFAULT_SELF_EMPLOYMENT_TAX_RATE,
    income_tax_rate: 0,
    combined_tax_rate: getCombinedTaxRate('GA'),
    extra_holdback_label: 'Car maintenance',
    extra_holdback_percent: 0,
    payout_method_label: null,
    payout_method_last4: null,
    onboarding_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const needsOnboarding = !safeProfile.onboarding_completed;

  return (
    <>
      {needsOnboarding ? (
        <OnboardingWizard
          profile={safeProfile}
          userId={user.id}
          userEmail={user.email}
        />
      ) : null}

      <div className={needsOnboarding ? 'pointer-events-none select-none blur-[2px]' : ''}>
        <DashboardView dashes={dashes ?? []} profile={safeProfile} userEmail={user.email} />
      </div>
    </>
  );
}