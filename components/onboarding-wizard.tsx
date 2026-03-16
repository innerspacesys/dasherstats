'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
  DEFAULT_SELF_EMPLOYMENT_TAX_RATE,
  ProfileRow,
  US_STATE_INCOME_TAX_RATES,
} from '@/lib/types';

type Props = {
  profile: ProfileRow;
  userId: string;
  userEmail?: string | null;
};

type StepKey =
  | 'name'
  | 'state'
  | 'extraHoldback'
  | 'extraDetails'
  | 'payout'
  | 'review';

export function OnboardingWizard({ profile, userId, userEmail }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  const [form, setForm] = useState({
    display_name: profile.display_name || '',
    home_state: profile.home_state || 'GA',
    self_employment_tax_rate: String(
      normalizePercent(profile.self_employment_tax_rate, DEFAULT_SELF_EMPLOYMENT_TAX_RATE)
    ),
    income_tax_rate: String(
      normalizePercent(
        profile.income_tax_rate,
        US_STATE_INCOME_TAX_RATES[profile.home_state || 'GA'] ?? 0
      )
    ),
    wants_extra_holdback: (profile.extra_holdback_percent ?? 0) > 0 ? 'yes' : 'no',
    extra_holdback_label: profile.extra_holdback_label || 'Car maintenance',
    extra_holdback_percent: String(profile.extra_holdback_percent ?? 0),
    payout_method_label: profile.payout_method_label || '',
  });

  const selfEmploymentRate = Number(form.self_employment_tax_rate || 0);
  const stateIncomeRate = Number(form.income_tax_rate || 0);
  const combinedTaxRate = selfEmploymentRate + stateIncomeRate;
  const extraHoldbackPercent =
    form.wants_extra_holdback === 'yes' ? Number(form.extra_holdback_percent || 0) : 0;
  const totalHoldbackRate = combinedTaxRate + extraHoldbackPercent;

  const steps: StepKey[] = [
  'name',
  'state',
  'extraHoldback',
  ...(form.wants_extra_holdback === 'yes' ? (['extraDetails'] as StepKey[]) : []),
  'payout',
  'review',
];

const currentStep = steps[stepIndex];

  function updateField(key: keyof typeof form, value: string) {
    if (key === 'home_state') {
      setForm((prev) => ({
        ...prev,
        home_state: value,
        income_tax_rate: String(US_STATE_INCOME_TAX_RATES[value] ?? 0),
      }));
      return;
    }

    if (key === 'wants_extra_holdback' && value === 'no') {
  setForm((prev) => ({
    ...prev,
    wants_extra_holdback: 'no',
    extra_holdback_label: 'Car maintenance',
    extra_holdback_percent: '0',
  }));
  return;
}
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function nextStep() {
  setError(null);

  if (currentStep === 'name' && !form.display_name.trim()) {
    setError('Please enter the name you want shown in the app.');
    return;
  }

  if (currentStep === 'state' && !form.home_state) {
    setError('Please choose your state.');
    return;
  }

  if (
    currentStep === 'extraDetails' &&
    form.wants_extra_holdback === 'yes' &&
    Number(form.extra_holdback_percent || 0) < 0
  ) {
    setError('Extra holdback cannot be negative.');
    return;
  }

  let nextIndex = Math.min(stepIndex + 1, steps.length - 1);

  if (currentStep === 'extraHoldback' && form.wants_extra_holdback === 'no') {
    const payoutIndex = steps.indexOf('payout');
    nextIndex = payoutIndex;
  }

  setDirection(1);
  setStepIndex(nextIndex);
}

 function prevStep() {
  setError(null);

  let prevIndex = Math.max(stepIndex - 1, 0);

  if (currentStep === 'payout' && form.wants_extra_holdback === 'no') {
    const extraHoldbackIndex = steps.indexOf('extraHoldback');
    prevIndex = extraHoldbackIndex;
  }

  setDirection(-1);
  setStepIndex(prevIndex);
}

  async function finishSetup() {
    setLoading(true);
    setError(null);

    const payload = {
      id: userId,
      email: userEmail ?? profile.email ?? null,
      display_name: form.display_name.trim() || null,
      home_state: form.home_state || null,
      self_employment_tax_rate: selfEmploymentRate,
      income_tax_rate: stateIncomeRate,
      combined_tax_rate: combinedTaxRate,
      extra_holdback_label:
        form.wants_extra_holdback === 'yes'
          ? form.extra_holdback_label.trim() || 'Car maintenance'
          : 'Car maintenance',
      extra_holdback_percent: extraHoldbackPercent,
      payout_method_label: form.payout_method_label.trim() || null,
      onboarding_completed: true,
    };

    const { error } = await supabase.from('profiles').upsert(payload);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card-strong)] shadow-2xl">
        <div className="border-b border-[var(--border)] px-6 py-5 sm:px-8">
          <p className="text-sm font-medium text-[var(--muted-foreground)]">Initial setup</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">Let’s get DashMetrx ready</h2>

          <div className="mt-4 h-2 rounded-full bg-[var(--muted)]">
            <div
              className="h-2 rounded-full bg-[var(--foreground)] transition-all duration-300"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="min-h-[360px] px-6 py-6 sm:px-8 sm:py-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: direction > 0 ? 28 : -28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -28 : 28 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              {currentStep === 'name' ? (
                <Step
                  title="What should we call you in the app?"
                  description="This is the name shown on your dashboard and used as the default driver name."
                >
                  <input
                    className="field"
                    placeholder="Your Name"
                    value={form.display_name}
                    onChange={(e) => updateField('display_name', e.target.value)}
                  />
                </Step>
              ) : null}

              {currentStep === 'state' ? (
                <Step
                  title="What state do you live or work in?"
                  description="We use this to suggest your default state income tax rate."
                >
                  <select
                    className="field"
                    value={form.home_state}
                    onChange={(e) => updateField('home_state', e.target.value)}
                  >
                    {Object.keys(US_STATE_INCOME_TAX_RATES)
                      .sort()
                      .map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                  </select>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <InfoCard label="Self-employment" value={`${selfEmploymentRate.toFixed(1)}%`} />
                    <InfoCard label="State income tax" value={`${stateIncomeRate.toFixed(2)}%`} />
                    <InfoCard label="Combined default tax" value={`${combinedTaxRate.toFixed(2)}%`} />
                  </div>

                  <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                    Federal income tax can be added later as a separate default. I would not bolt it in
                    halfway right now and risk bad math across the app.
                  </p>
                </Step>
              ) : null}

              {currentStep === 'extraHoldback' ? (
                <Step
                  title="Do you want to hold back extra money beyond taxes?"
                  description="This is useful for gas, car maintenance, repairs, or any extra cushion you want."
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ChoiceCard
                      active={form.wants_extra_holdback === 'yes'}
                      title="Yes"
                      text="I want to set aside some extra money."
                      onClick={() => updateField('wants_extra_holdback', 'yes')}
                    />
                    <ChoiceCard
                      active={form.wants_extra_holdback === 'no'}
                      title="No"
                      text="I only want the default tax holdback."
                      onClick={() => updateField('wants_extra_holdback', 'no')}
                    />
                  </div>
                </Step>
              ) : null}

              {currentStep === 'extraDetails' ? (
                <Step
                  title="What should that extra holdback look like?"
                  description="The label is optional. Most people can leave it alone or skip it."
                >
                  <div className="space-y-4">
                    <div>
                      <label className="label">Extra holdback label (optional)</label>
                      <input
                        className="field"
                        placeholder="Car maintenance, Gas, etc."
                        value={form.extra_holdback_label}
                        onChange={(e) => updateField('extra_holdback_label', e.target.value)}
                        disabled={form.wants_extra_holdback !== 'yes'}
                      />
                    </div>

                    <div>
                      <label className="label">Extra holdback percent</label>
                      <input
                        className="field"
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        placeholder="0"
                        value={form.extra_holdback_percent}
                        onChange={(e) => updateField('extra_holdback_percent', e.target.value)}
                        disabled={form.wants_extra_holdback !== 'yes'}
                      />
                    </div>

                    <div className="rounded-[1.5rem] bg-[var(--muted)] p-4">
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Combined tax holdback:{' '}
                        <span className="font-semibold text-[var(--foreground)]">
                          {combinedTaxRate.toFixed(2)}%
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        Extra holdback:{' '}
                        <span className="font-semibold text-[var(--foreground)]">
                          {extraHoldbackPercent.toFixed(2)}%
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        Total default holdback:{' '}
                        <span className="font-semibold text-[var(--foreground)]">
                          {totalHoldbackRate.toFixed(2)}%
                        </span>
                      </p>
                    </div>
                  </div>
                </Step>
              ) : null}

              {currentStep === 'payout' ? (
                <Step
                  title="Do you want a default payout label?"
                  description="This is optional. It only really helps if you share the app, use multiple payout destinations, or want to label things like Crimson card or checking."
                >
                  <input
                    className="field"
                    placeholder="Crimson card, checking account, etc."
                    value={form.payout_method_label}
                    onChange={(e) => updateField('payout_method_label', e.target.value)}
                  />

                  <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                    For most people, this is safe to leave blank.
                  </p>
                </Step>
              ) : null}

              {currentStep === 'review' ? (
                <Step
                  title="Review your setup"
                  description="This is what the app will use as your default starting point."
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <InfoCard label="Name" value={form.display_name || '-'} />
                    <InfoCard label="State" value={form.home_state || '-'} />
                    <InfoCard label="Self-employment tax" value={`${selfEmploymentRate.toFixed(1)}%`} />
                    <InfoCard label="State income tax" value={`${stateIncomeRate.toFixed(2)}%`} />
                    <InfoCard label="Combined tax holdback" value={`${combinedTaxRate.toFixed(2)}%`} />
                    <InfoCard label="Extra holdback" value={`${extraHoldbackPercent.toFixed(2)}%`} />
                    <InfoCard
                      label="Extra holdback label"
                      value={
                        form.wants_extra_holdback === 'yes'
                          ? form.extra_holdback_label || 'Car maintenance'
                          : 'None'
                      }
                    />
                    <InfoCard
                      label="Default payout label"
                      value={form.payout_method_label || 'None'}
                    />
                  </div>
                </Step>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {error ? <p className="mt-4 text-sm text-[var(--danger)]">{error}</p> : null}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border)] px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={prevStep}
            className="btn-secondary"
            disabled={stepIndex === 0 || loading}
          >
            Back
          </button>

          {stepIndex < steps.length - 1 ? (
            <button type="button" onClick={nextStep} className="btn-primary" disabled={loading}>
              Next
            </button>
          ) : (
            <button type="button" onClick={finishSetup} className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Finish setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function normalizePercent(value: number | null | undefined, fallback: number) {
  if (value == null) return fallback;
  return value <= 1 ? value * 100 : value;
}

function Step({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function ChoiceCard({
  active,
  title,
  text,
  onClick,
}: {
  active: boolean;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1.5rem] border p-5 text-left transition ${
        active
          ? 'border-transparent bg-[var(--foreground)] text-[var(--background)]'
          : 'border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]'
      }`}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-2 text-sm opacity-80">{text}</p>
    </button>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-[var(--muted)] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}