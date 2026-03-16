export type ThemeMode = 'light' | 'dark' | 'system';

export type ProfileRow = {
  tax_rate_percent: number;
  id: string;
  email: string | null;
  display_name: string | null;
  home_state: string | null;
  onboarding_completed?: boolean | null;

  // Stored as real percent values, not decimals
  // Example: 15.3, 5.39, 20.69
  self_employment_tax_rate: number;
  income_tax_rate: number;
  combined_tax_rate: number;

  extra_holdback_label: string | null;
  extra_holdback_percent: number;

  payout_method_label: string | null;
  payout_method_last4: string | null;

  created_at: string;
  updated_at: string;
};

export type DashRow = {
  id: string;
  user_id: string;
  dash_date: string;
  driver_name: string | null;
  start_odometer: number | null;
  end_odometer: number | null;
  start_time: string | null;
  end_time: string | null;

  gross_amount: number;

  // Stored as percent values, not decimals
  tax_rate: number;
  tax_amount: number | null;

  extra_holdback_label: string | null;
  extra_holdback_percent: number | null;
  extra_holdback_amount: number | null;

  net_amount: number | null;

  payout_account: string | null;
  payout_note: string | null;
  notes: string | null;

  created_at: string;
  updated_at: string;
};

export type DashInput = {
  dash_date: string;
  driver_name?: string;
  start_odometer?: number;
  end_odometer?: number;
  start_time?: string;
  end_time?: string;
  gross_amount: number;
  tax_rate?: number;
  extra_holdback_label?: string;
  extra_holdback_percent?: number;
  payout_account?: string;
  payout_note?: string;
  notes?: string;
};

export type DashSummary = {
  totalGross: number;
  totalTax: number;
  totalExtraHoldback: number;
  totalNet: number;
  totalHours: number;
  totalMiles: number;
  avgHourly: number;
  avgNetHourly: number;
};

export const US_STATE_INCOME_TAX_RATES: Record<string, number> = {
  AL: 5,
  AK: 0,
  AZ: 2.5,
  AR: 3.9,
  CA: 9.3,
  CO: 4.4,
  CT: 5,
  DE: 6.6,
  FL: 0,
  GA: 5.39,
  HI: 8.25,
  ID: 5.8,
  IL: 4.95,
  IN: 3.15,
  IA: 3.9,
  KS: 5.2,
  KY: 4,
  LA: 3,
  ME: 7.15,
  MD: 4.75,
  MA: 5,
  MI: 4.25,
  MN: 6.8,
  MS: 4.7,
  MO: 4.7,
  MT: 5.9,
  NE: 5.1,
  NV: 0,
  NH: 0,
  NJ: 6.37,
  NM: 4.9,
  NY: 6,
  NC: 4.5,
  ND: 2.25,
  OH: 3.5,
  OK: 4,
  OR: 8.75,
  PA: 3.07,
  RI: 4.75,
  SC: 6.2,
  SD: 0,
  TN: 0,
  TX: 0,
  UT: 4.85,
  VT: 6,
  VA: 5.75,
  WA: 0,
  WV: 5.12,
  WI: 5.3,
  WY: 0,
  DC: 6.5,
};

export const DEFAULT_SELF_EMPLOYMENT_TAX_RATE = 15.3;