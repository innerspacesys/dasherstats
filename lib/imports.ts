export type ImportedDashRow = {
  dash_date: string;
  driver_name: string | undefined;
  gross_amount: number;
  start_time: string | null;
  end_time: string | null;
  start_odometer: number | null;
  end_odometer: number | null;
  tax_rate: number;
  extra_holdback_label: string;
  extra_holdback_percent: number;
  payout_account: string | null;
  payout_note: string | null;
  notes: string | null;
};

function firstValue(row: Record<string, unknown>, names: string[]) {
  const lowerMap = Object.fromEntries(
    Object.entries(row).map(([k, v]) => [k.trim().toLowerCase(), v])
  );
  for (const name of names) {
    const val = lowerMap[name.toLowerCase()];
    if (val !== undefined && val !== null && String(val).trim() !== '') return val;
  }
  return undefined;
}

function toNumber(value: unknown): number | null {
  if (value == null || value === '') return null;
  const cleaned = String(value).replace(/[$,%]/g, '').trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function toTime(value: unknown): string | null {
  if (value == null || value === '') return null;

  if (value instanceof Date) {
    const hh = String(value.getHours()).padStart(2, '0');
    const mm = String(value.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const totalMinutes = Math.round(value * 24 * 60);
    const hh = String(Math.floor(totalMinutes / 60) % 24).padStart(2, '0');
    const mm = String(totalMinutes % 60).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  const s = String(value).trim();

  if (/^\d{1,2}:\d{2}/.test(s)) {
    const [h, m] = s.split(':');
    return `${String(Number(h)).padStart(2, '0')}:${String(Number(m)).padStart(2, '0')}`;
  }

  const parsed = new Date(`1970-01-01T${s}`);
  if (!Number.isNaN(parsed.getTime())) {
    const hh = String(parsed.getHours()).padStart(2, '0');
    const mm = String(parsed.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  return null;
}

function toDateString(value: unknown): string | null {
  if (value == null || value === '') return null;

  // Excel serial date number
  if (typeof value === 'number' && Number.isFinite(value)) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const ms = value * 24 * 60 * 60 * 1000;
    const date = new Date(excelEpoch.getTime() + ms);
    return date.toISOString().slice(0, 10);
  }

  const s = String(value).trim();
  const date = new Date(s);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 10);
}

export function normalizeImportedRows(rawRows: Record<string, unknown>[]) {
  return rawRows
    .map((row) => {
      const gross = toNumber(
        firstValue(row, ['gross$', 'gross', 'gross pay', 'amount', 'earnings', 'total'])
      );

      const dashDate = toDateString(
        firstValue(row, ['date', 'dash date'])
      );

      if (gross == null || !dashDate) return null;

      const taxSavedRaw = toNumber(
        firstValue(row, ['save$', 'save', 'tax saved', 'tax holdback', 'tax holdback %', 'tax rate', 'tax_rate'])
      );

      const extraRateRaw = toNumber(
        firstValue(row, ['extra holdback %', 'maintenance %', 'extra_rate'])
      );

      const normalizedTaxRate =
        taxSavedRaw != null && gross > 0
          ? Number(((taxSavedRaw / gross) * 100).toFixed(2))
          : 0;

      const normalizedExtraRate =
        extraRateRaw != null
          ? (extraRateRaw <= 1 ? extraRateRaw * 100 : extraRateRaw)
          : 0;

      return {
        dash_date: dashDate,
        driver_name: String(firstValue(row, ['driver', 'driver name', 'name']) || '').trim() || undefined,
        gross_amount: gross,
        start_time: toTime(firstValue(row, ['time-in', 'time in', 'start time'])),
        end_time: toTime(firstValue(row, ['time-out', 'time out', 'end time'])),
        start_odometer: toNumber(firstValue(row, ['mile start', 'miles start', 'odometer start', 'start odometer'])),
        end_odometer: toNumber(firstValue(row, ['mile end', 'miles end', 'odometer end', 'end odometer'])),
        tax_rate: normalizedTaxRate,
        extra_holdback_label: String(firstValue(row, ['extra holdback label', 'maintenance label']) || 'Car maintenance'),
        extra_holdback_percent: normalizedExtraRate,
        payout_account: String(firstValue(row, ['deposited', 'deposit account', 'payout account']) || '').trim() || null,
        payout_note: String(firstValue(row, ['withdrawn', 'deposit note', 'payout note']) || '').trim() || null,
        notes: String(firstValue(row, ['notes', 'note']) || '').trim() || null,
      };
    })
    .filter((row): row is ImportedDashRow => row !== null);
}