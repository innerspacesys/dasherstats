'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  DEFAULT_SELF_EMPLOYMENT_TAX_RATE,
  ProfileRow,
  US_STATE_INCOME_TAX_RATES,
} from '@/lib/types';
import { ThemeToggle } from './theme-provider';

export function SettingsForm({ profile }: { profile: ProfileRow }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
  display_name: profile.display_name || '',
  home_state: profile.home_state || 'GA',
  self_employment_tax_rate: String(profile.self_employment_tax_rate ?? DEFAULT_SELF_EMPLOYMENT_TAX_RATE),
  income_tax_rate: String(profile.income_tax_rate ?? US_STATE_INCOME_TAX_RATES[profile.home_state || 'GA'] ?? 0),
  extra_holdback_label: profile.extra_holdback_label || 'Car maintenance',
  extra_holdback_percent: String(profile.extra_holdback_percent ?? 0),
  payout_method_label: profile.payout_method_label || '',
  payout_method_last4: profile.payout_method_last4 || '',
});

  const combinedTaxRate = Number(form.self_employment_tax_rate || 0) + Number(form.income_tax_rate || 0);
  const extraHoldbackPercent = Number(form.extra_holdback_percent || 0);

  const totalHoldbackRate =
    combinedTaxRate + Number(form.extra_holdback_percent || 0);

  function updateField(key: keyof typeof form, value: string) {
  if (key === 'home_state') {
    setForm((prev) => ({
      ...prev,
      home_state: value,
      income_tax_rate: String(US_STATE_INCOME_TAX_RATES[value] ?? 0),
    }));
    return;
  }

  setForm((prev) => ({ ...prev, [key]: value }));
}

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError('You must be logged in to update settings.');
      setLoading(false);
      return;
    }

    const payload = {
  id: user.id,
  email: user.email ?? null,
  display_name: form.display_name || null,
  home_state: form.home_state || null,
  self_employment_tax_rate: Number(form.self_employment_tax_rate || DEFAULT_SELF_EMPLOYMENT_TAX_RATE),
  income_tax_rate: Number(form.income_tax_rate || 0),
  combined_tax_rate: combinedTaxRate,
  extra_holdback_label: form.extra_holdback_label || 'Car maintenance',
  extra_holdback_percent: Number(form.extra_holdback_percent || 0),
  payout_method_label: form.payout_method_label || null,
  payout_method_last4: form.payout_method_last4 || null,
};

    const { error: saveError } = await supabase.from('profiles').upsert(payload);

    if (saveError) {
      setError(saveError.message);
      setLoading(false);
      return;
    }

    setMessage('Settings saved.');
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Set your default holdbacks, display name, and payout placeholders.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Display name">
            <input className="field" value={form.display_name} onChange={(e) => updateField('display_name', e.target.value)} />
          </Field>

          <Field label="Home state">
            <select className="field" value={form.home_state} onChange={(e) => updateField('home_state', e.target.value)}>
              {Object.keys(US_STATE_INCOME_TAX_RATES).sort().map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Self-employment tax rate %">
            <input
              className="field"
              inputMode="decimal"
              placeholder="15.3"
              disabled
              value={form.self_employment_tax_rate}
              onChange={(e) => updateField('self_employment_tax_rate', e.target.value)}
            />
          </Field>

          <Field label="State income tax rate %">
  <input
    className="field"
    inputMode="decimal"
    disabled
    placeholder="5.39"
    value={form.income_tax_rate}
    onChange={(e) => updateField('income_tax_rate', e.target.value)}
  />
</Field>

          <Field label="Extra holdback label">
            <input
              className="field"
              placeholder="Car maintenance"
              value={form.extra_holdback_label}
              onChange={(e) => updateField('extra_holdback_label', e.target.value)}
            />
          </Field>

          <Field label="Extra holdback %">
            <input
              className="field"
              inputMode="decimal"
              placeholder="0"
              value={form.extra_holdback_percent}
              onChange={(e) => updateField('extra_holdback_percent', e.target.value)}
            />
          </Field>

          

          <Field label="Payout method label">
            <input
              className="field"
              placeholder="TVFCU checking"
              value={form.payout_method_label}
              onChange={(e) => updateField('payout_method_label', e.target.value)}
            />
          </Field>

          <Field label="Payout last 4">
            <input
              className="field"
              maxLength={4}
              placeholder="1234"
              value={form.payout_method_last4}
              onChange={(e) => updateField('payout_method_last4', e.target.value.replace(/\D/g, '').slice(0, 4))}
            />
          </Field>
        </div>

         <div className="mt-6 rounded-[1.5rem] bg-[var(--muted)] p-4">
  <p className="text-sm font-semibold">Live calculation preview</p>
  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
    Combined tax rate:{' '}
    <span className="font-semibold text-[var(--foreground)]">{combinedTaxRate.toFixed(1)}%</span>
  </p>
  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
    {form.extra_holdback_label || 'Extra holdback'}:{' '}
    <span className="font-semibold text-[var(--foreground)]">{extraHoldbackPercent.toFixed(1)}%</span>
  </p>
  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
    Total default holdback:{' '}
    <span className="font-semibold text-[var(--foreground)]">{totalHoldbackRate.toFixed(1)}%</span>
  </p>
</div>

        {error ? <p className="mt-4 text-sm text-[var(--danger)]">{error}</p> : null}
        {message ? <p className="mt-4 text-sm text-[var(--success)]">{message}</p> : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save settings'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => router.push('/dashboard')}>
            Back
          </button>
        </div>
      </form>

      <div className="card p-6">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Light, dark, or system. Local only for now, which is fine for v1/v2.
        </p>
        <div className="mt-4">
          <ThemeToggle />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold">Payment integration placeholder</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Right now this is just a label and last-four placeholder. Later, this is the clean spot to plug in Stripe or payout destination settings if you expand it.
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}