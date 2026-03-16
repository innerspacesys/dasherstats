import type { DashRow, DashSummary } from './types';

export function toCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function toPercent(value: number) {
  return `${Number(value || 0).toFixed(1)}%`;
}

export function getMiles(start?: number | null, end?: number | null) {
  if (typeof start !== 'number' || typeof end !== 'number') return 0;
  return Math.max(0, Number((end - start).toFixed(1)));
}

export function getHours(start?: string | null, end?: string | null) {
  if (!start || !end) return 0;

  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);

  if ([sh, sm, eh, em].some((v) => Number.isNaN(v))) return 0;

  const startMinutes = sh * 60 + sm;
  let endMinutes = eh * 60 + em;

  if (endMinutes < startMinutes) endMinutes += 24 * 60;

  return Number(((endMinutes - startMinutes) / 60).toFixed(2));
}

export function roundMoney(value: number) {
  return Number((value || 0).toFixed(2));
}

export function getTaxToKeep(gross: number, taxRatePercent: number) {
  return roundMoney((gross || 0) * ((taxRatePercent || 0) / 100));
}

export function getExtraHoldbackAmount(gross: number, extraHoldbackPercent: number) {
  return roundMoney((gross || 0) * ((extraHoldbackPercent || 0) / 100));
}

export function getNetAfterHoldbacks(
  gross: number,
  taxRatePercent: number,
  extraHoldbackPercent = 0
) {
  const tax = getTaxToKeep(gross, taxRatePercent);
  const extra = getExtraHoldbackAmount(gross, extraHoldbackPercent);
  return roundMoney((gross || 0) - tax - extra);
}

export function getHourly(gross: number, hours: number) {
  if (!hours) return 0;
  return roundMoney((gross || 0) / hours);
}

export function getNetHourly(
  gross: number,
  taxRatePercent: number,
  hours: number,
  extraHoldbackPercent = 0
) {
  if (!hours) return 0;
  return roundMoney(
    getNetAfterHoldbacks(gross, taxRatePercent, extraHoldbackPercent) / hours
  );
}

export function summarizeDashes(dashes: DashRow[]): DashSummary {
  const totalGross = dashes.reduce((sum, dash) => sum + Number(dash.gross_amount || 0), 0);

  const totalTax = dashes.reduce((sum, dash) => {
    if (dash.tax_amount != null) return sum + Number(dash.tax_amount);
    return sum + getTaxToKeep(Number(dash.gross_amount || 0), Number(dash.tax_rate || 0));
  }, 0);

  const totalExtraHoldback = dashes.reduce((sum, dash) => {
    if (dash.extra_holdback_amount != null) return sum + Number(dash.extra_holdback_amount);
    return sum + getExtraHoldbackAmount(
      Number(dash.gross_amount || 0),
      Number(dash.extra_holdback_percent || 0)
    );
  }, 0);

  const totalNet = dashes.reduce((sum, dash) => {
    if (dash.net_amount != null) return sum + Number(dash.net_amount);
    return sum + getNetAfterHoldbacks(
      Number(dash.gross_amount || 0),
      Number(dash.tax_rate || 0),
      Number(dash.extra_holdback_percent || 0)
    );
  }, 0);

  const totalHours = dashes.reduce((sum, dash) => sum + getHours(dash.start_time, dash.end_time), 0);
  const totalMiles = dashes.reduce((sum, dash) => sum + getMiles(dash.start_odometer, dash.end_odometer), 0);

  const avgHourly = getHourly(totalGross, totalHours);
  const avgNetHourly = getHourly(totalNet, totalHours);

  return {
    totalGross: roundMoney(totalGross),
    totalTax: roundMoney(totalTax),
    totalExtraHoldback: roundMoney(totalExtraHoldback),
    totalNet: roundMoney(totalNet),
    totalHours: Number(totalHours.toFixed(2)),
    totalMiles: Number(totalMiles.toFixed(1)),
    avgHourly,
    avgNetHourly,
  };
}

export function formatPaymentLabel(label?: string | null, last4?: string | null) {
  if (!label && !last4) return 'No payout method set';
  if (label && last4) return `${label} •••• ${last4}`;
  return label || `•••• ${last4}`;
}