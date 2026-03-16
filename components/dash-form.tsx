'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  getExtraHoldbackAmount,
  getHours,
  getMiles,
  getNetAfterHoldbacks,
  getTaxToKeep,
  toCurrency,
} from '@/lib/calculations';
import type { DashRow, ProfileRow } from '@/lib/types';

type Props = {
  mode?: 'create' | 'edit';
  initialDash?: DashRow;
  profile: ProfileRow;
};

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function DashForm({ mode = 'create', initialDash, profile }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultTaxRatePercent =
    profile.combined_tax_rate ??
    35;

  const defaultExtraHoldbackLabel =
    initialDash?.extra_holdback_label ??
    profile.extra_holdback_label ??
    'Car maintenance';

  const defaultExtraHoldbackPercent =
    initialDash?.extra_holdback_percent ??
    profile.extra_holdback_percent ??
    0;

  const [form, setForm] = useState({
  dash_date: initialDash?.dash_date || new Date().toISOString().slice(0, 10),
  driver_name: initialDash?.driver_name || profile.display_name || '',
  start_odometer: initialDash?.start_odometer?.toString() || '',
  end_odometer: initialDash?.end_odometer?.toString() || '',
  start_time: initialDash?.start_time?.slice(0, 5) || '',
  end_time: initialDash?.end_time?.slice(0, 5) || '',
  gross_amount: initialDash?.gross_amount?.toString() || '',
  tax_rate: String(initialDash?.tax_rate ?? profile.combined_tax_rate ?? 0),
  extra_holdback_label: initialDash?.extra_holdback_label || profile.extra_holdback_label || 'Car maintenance',
  extra_holdback_percent: String(initialDash?.extra_holdback_percent ?? profile.extra_holdback_percent ?? 0),
  payout_account: initialDash?.payout_account || profile.payout_method_label || '',
  payout_note: initialDash?.payout_note || '',
  notes: initialDash?.notes || '',
});

const gross = Number(form.gross_amount || 0);
const taxRatePercent = Number(form.tax_rate || 0);
const extraHoldbackPercent = Number(form.extra_holdback_percent || 0);



  const hours = getHours(form.start_time || null, form.end_time || null);
  const miles = getMiles(
    form.start_odometer === '' ? null : Number(form.start_odometer),
    form.end_odometer === '' ? null : Number(form.end_odometer),
  );

  const taxAmount = roundMoney(gross * (taxRatePercent / 100));
  const extraHoldbackAmount = roundMoney(gross * (extraHoldbackPercent / 100));
  const netAmount = roundMoney(gross - taxAmount - extraHoldbackAmount);

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setLoading(true);
  setError(null);

  const gross = Number(form.gross_amount);

  if (!form.gross_amount.trim() || !Number.isFinite(gross) || gross <= 0) {
    setError('Enter a valid gross amount greater than 0.');
    setLoading(false);
    return;
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    setError('You must be logged in to save a dash.');
    setLoading(false);
    return;
  }

  const taxRatePercent = Number(form.tax_rate || 0);
  const extraHoldbackPercent = Number(form.extra_holdback_percent || 0);
  const taxAmount = roundMoney(gross * (taxRatePercent / 100));
  const extraHoldbackAmount = roundMoney(gross * (extraHoldbackPercent / 100));
  const netAmount = roundMoney(gross - taxAmount - extraHoldbackAmount);

  const payload = {
    user_id: user.id,
    dash_date: form.dash_date,
    driver_name: form.driver_name || null,
    start_odometer: form.start_odometer === '' ? null : Number(form.start_odometer),
    end_odometer: form.end_odometer === '' ? null : Number(form.end_odometer),
    start_time: form.start_time || null,
    end_time: form.end_time || null,
    gross_amount: gross,
    tax_rate: taxRatePercent,
    tax_amount: taxAmount,
    extra_holdback_label: form.extra_holdback_label?.trim() || 'Car maintenance',
    extra_holdback_percent: extraHoldbackPercent,
    extra_holdback_amount: extraHoldbackAmount,
    net_amount: netAmount,
    payout_account: form.payout_account || null,
    payout_note: form.payout_note || null,
    notes: form.notes || null,
  };

  const query =
    mode === 'edit' && initialDash
      ? supabase.from('dashes').update(payload).eq('id', initialDash.id)
      : supabase.from('dashes').insert(payload);

  const { error: saveError } = await query;

  if (saveError) {
    setError(saveError.message);
    setLoading(false);
    return;
  }

  router.push('/dashboard');
  router.refresh();
}

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date">
          <input className="field" type="date" value={form.dash_date} onChange={(e) => updateField('dash_date', e.target.value)} required />
        </Field>

        <Field label="Driver">
          <input className="field" placeholder="Cory" value={form.driver_name} onChange={(e) => updateField('driver_name', e.target.value)} />
        </Field>

        <Field label="Odometer start">
          <input className="field" inputMode="decimal" placeholder="119742" value={form.start_odometer} onChange={(e) => updateField('start_odometer', e.target.value)} />
        </Field>

        <Field label="Odometer end">
          <input className="field" inputMode="decimal" placeholder="119777" value={form.end_odometer} onChange={(e) => updateField('end_odometer', e.target.value)} />
        </Field>

        <Field label="Time in">
          <input className="field" type="time" value={form.start_time} onChange={(e) => updateField('start_time', e.target.value)} />
        </Field>

        <Field label="Time out">
          <input className="field" type="time" value={form.end_time} onChange={(e) => updateField('end_time', e.target.value)} />
        </Field>

        <Field label="Gross pay">
  <input
    className="field"
    type="number"
    step="0.01"
    min="0"
    inputMode="decimal"
    placeholder="31.69"
    value={form.gross_amount}
    onChange={(e) => updateField('gross_amount', e.target.value)}
    required
  />
</Field>

        <Field label="Tax holdback %">
          <input
            className="field"
            inputMode="decimal"
            placeholder={String(profile.combined_tax_rate ?? 35)}
            value={form.tax_rate}
            onChange={(e) => updateField('tax_rate', e.target.value)}
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

        <Field label="Deposit account">
          <input className="field" placeholder="TVFCU" value={form.payout_account} onChange={(e) => updateField('payout_account', e.target.value)} />
        </Field>

        <Field label="Deposit note">
          <input className="field" placeholder="Fast pay" value={form.payout_note} onChange={(e) => updateField('payout_note', e.target.value)} />
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          className="field min-h-[100px] resize-none"
          placeholder="Anything worth remembering about this dash?"
          value={form.notes}
          onChange={(e) => updateField('notes', e.target.value)}
        />
      </Field>

      <div className="grid gap-3 rounded-[1.5rem] bg-[var(--muted)] p-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <Preview label="Miles" value={String(miles)} />
        <Preview label="Hours" value={hours ? String(hours) : '-'} />
        <Preview label={`Taxes (${taxRatePercent || 0}%)`} value={toCurrency(taxAmount)} />
        <Preview label={`${form.extra_holdback_label || 'Extra'} (${extraHoldbackPercent || 0}%)`} value={toCurrency(extraHoldbackAmount)} />
        <Preview label="Net after holdbacks" value={toCurrency(netAmount)} />
      </div>

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : mode === 'edit' ? 'Save changes' : 'Save dash'}
        </button>
        <button type="button" className="btn-secondary" onClick={() => router.push('/dashboard')}>
          Cancel
        </button>
      </div>
    </form>
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

function Preview({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[var(--card-strong)] p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}