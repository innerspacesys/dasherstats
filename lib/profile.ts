import { DEFAULT_SELF_EMPLOYMENT_TAX_RATE, US_STATE_INCOME_TAX_RATES } from './types';

export function getStateIncomeTaxRate(state?: string | null) {
  if (!state) return 0;
  return US_STATE_INCOME_TAX_RATES[state.toUpperCase()] ?? 0;
}

export function getCombinedTaxRate(state?: string | null, selfEmploymentTaxRate = DEFAULT_SELF_EMPLOYMENT_TAX_RATE) {
  const stateRate = getStateIncomeTaxRate(state);
  return Number((selfEmploymentTaxRate + stateRate).toFixed(4));
}
