'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type ImportedRow = {
  dash_date: string;
  driver_name?: string;
  gross_amount: number;
  start_time?: string | null;
  end_time?: string | null;
  start_odometer?: number | null;
  end_odometer?: number | null;
  tax_rate?: number;
  extra_holdback_label?: string;
  extra_holdback_percent?: number;
  payout_account?: string | null;
  payout_note?: string | null;
  notes?: string | null;
};

export default function ImportPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'sheet' | 'screenshot'>('sheet');
  const [rows, setRows] = useState<ImportedRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSpreadsheet(file: File) {
    setBusy(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/import/spreadsheet', {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || 'Failed to parse spreadsheet.');
      setBusy(false);
      return;
    }

    setRows(json.rows || []);
    setBusy(false);
  }

  async function handleScreenshot(file: File) {
    setBusy(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/import/screenshot', {
      method: 'POST',
      body: formData,
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || 'Failed to parse screenshot.');
      setBusy(false);
      return;
    }

    setRows(json.rows || []);
    setBusy(false);
  }

  async function confirmImport() {
  setBusy(true);
  setError(null);

  const res = await fetch('/api/import/spreadsheet', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows }),
  });

  const json = await res.json();

  if (!res.ok) {
    setError(json.error || 'Failed to import rows.');
    setBusy(false);
    return;
  }

  router.push('/dashboard/dashes');
  router.refresh();
}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Import dash history</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Upload a spreadsheet or screenshot, review the parsed rows, then import.
        </p>
      </div>

      <div className="flex gap-2 rounded-2xl bg-[var(--muted)] p-1">
        <button type="button" className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold ${tab === 'sheet' ? 'bg-[var(--foreground)] text-[var(--background)]' : ''}`} onClick={() => setTab('sheet')}>
          Spreadsheet
        </button>
        <button type="button" className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold ${tab === 'screenshot' ? 'bg-[var(--foreground)] text-[var(--background)]' : ''}`} onClick={() => setTab('screenshot')}>
          Screenshot
        </button>
      </div>

      <div className="card p-5">
        <label className="label">{tab === 'sheet' ? 'Upload .xlsx or .csv' : 'Upload screenshot'}</label>
        <input
          className="field"
          type="file"
          accept={tab === 'sheet' ? '.xlsx,.xls,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel' : 'image/*'}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (tab === 'sheet') handleSpreadsheet(file);
            else handleScreenshot(file);
          }}
        />
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          Screenshot import should always be treated as review-first. It is convenience, not source of truth.
        </p>
      </div>

      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}

      {rows.length > 0 ? (
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="text-lg font-semibold">Review parsed rows</h2>
            <div className="mt-4 space-y-3">
              {rows.map((row, i) => (
                <div key={i} className="rounded-2xl bg-[var(--muted)] p-4">
                  <p className="font-medium">{row.dash_date} — ${row.gross_amount}</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {row.driver_name || 'No driver'} • Tax {row.tax_rate ?? 0}% • {row.extra_holdback_label || 'Extra'} {row.extra_holdback_percent ?? 0}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary w-full sm:w-auto" disabled={busy} onClick={confirmImport}>
            {busy ? 'Importing...' : `Import ${rows.length} row${rows.length === 1 ? '' : 's'}`}
          </button>
        </div>
      ) : null}
    </div>
  );
}