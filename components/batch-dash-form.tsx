'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { ProfileRow } from '@/lib/types';

type Row = {
  dash_date: string;
  driver_name: string;
  gross_amount: string;
  start_time: string;
  end_time: string;
  start_odometer: string;
  end_odometer: string;
  tax_rate: string;
  extra_holdback_label: string;
  extra_holdback_percent: string;
  payout_account: string;
  payout_note: string;
  notes: string;
};

function makeRow(profile: ProfileRow): Row {
  return {
    dash_date: new Date().toISOString().slice(0, 10),
    driver_name: profile.display_name || '',
    gross_amount: '',
    start_time: '',
    end_time: '',
    start_odometer: '',
    end_odometer: '',
    tax_rate: String(profile.combined_tax_rate ?? 0),
    extra_holdback_label: profile.extra_holdback_label || 'Car maintenance',
    extra_holdback_percent: String(profile.extra_holdback_percent ?? 0),
    payout_account: profile.payout_method_label || '',
    payout_note: '',
    notes: '',
  };
}

export function BatchDashForm({ profile }: { profile: ProfileRow }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Row[]>([makeRow(profile)]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateRow(index: number, key: keyof Row, value: string) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, makeRow(profile)]);
  }

  function removeRow(index: number) {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError('You must be logged in to save dashes.');
      setLoading(false);
      return;
    }

    const payload = rows
      .filter((row) => row.gross_amount && row.dash_date)
      .map((row) => {
        const gross = Number(row.gross_amount || 0);
        const taxRate = Number(row.tax_rate || 0);
        const extraPct = Number(row.extra_holdback_percent || 0);
        const taxAmount = Number((gross * (taxRate / 100)).toFixed(2));
        const extraAmount = Number((gross * (extraPct / 100)).toFixed(2));
        const netAmount = Number((gross - taxAmount - extraAmount).toFixed(2));

        return {
          user_id: user.id,
          dash_date: row.dash_date,
          driver_name: row.driver_name || null,
          gross_amount: gross,
          start_time: row.start_time || null,
          end_time: row.end_time || null,
          start_odometer: row.start_odometer ? Number(row.start_odometer) : null,
          end_odometer: row.end_odometer ? Number(row.end_odometer) : null,
          tax_rate: taxRate,
          tax_amount: taxAmount,
          extra_holdback_label: row.extra_holdback_label || 'Car maintenance',
          extra_holdback_percent: extraPct,
          extra_holdback_amount: extraAmount,
          net_amount: netAmount,
          payout_account: row.payout_account || null,
          payout_note: row.payout_note || null,
          notes: row.notes || null,
        };
      });

    const { error: insertError } = await supabase.from('dashes').insert(payload);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard/dashes');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {rows.map((row, index) => (
        <div key={index} className="card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Dash #{index + 1}</p>
            <button type="button" className="btn-danger" onClick={() => removeRow(index)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input label="Date" value={row.dash_date} onChange={(v) => updateRow(index, 'dash_date', v)} type="date" />
            <Input label="Driver" value={row.driver_name} onChange={(v) => updateRow(index, 'driver_name', v)} />
            <Input label="Gross" value={row.gross_amount} onChange={(v) => updateRow(index, 'gross_amount', v)} inputMode="decimal" />
            <Input label="Time in" value={row.start_time} onChange={(v) => updateRow(index, 'start_time', v)} type="time" />
            <Input label="Time out" value={row.end_time} onChange={(v) => updateRow(index, 'end_time', v)} type="time" />
            <Input label="Tax holdback %" value={row.tax_rate} onChange={(v) => updateRow(index, 'tax_rate', v)} inputMode="decimal" />
            <Input label="Extra label" value={row.extra_holdback_label} onChange={(v) => updateRow(index, 'extra_holdback_label', v)} />
            <Input label="Extra holdback %" value={row.extra_holdback_percent} onChange={(v) => updateRow(index, 'extra_holdback_percent', v)} inputMode="decimal" />
            <Input label="Odometer start" value={row.start_odometer} onChange={(v) => updateRow(index, 'start_odometer', v)} inputMode="decimal" />
            <Input label="Odometer end" value={row.end_odometer} onChange={(v) => updateRow(index, 'end_odometer', v)} inputMode="decimal" />
            <Input label="Deposit account" value={row.payout_account} onChange={(v) => updateRow(index, 'payout_account', v)} />
            <Input label="Deposit note" value={row.payout_note} onChange={(v) => updateRow(index, 'payout_note', v)} />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              className="field min-h-[96px] resize-none"
              value={row.notes}
              onChange={(e) => updateRow(index, 'notes', e.target.value)}
            />
          </div>
        </div>
      ))}

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" className="btn-secondary w-full sm:w-auto" onClick={addRow}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add another row
        </button>
        <button className="btn-primary w-full sm:w-auto" disabled={loading}>
          {loading ? 'Saving...' : 'Save all dashes'}
        </button>
      </div>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="field" type={type} inputMode={inputMode} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}