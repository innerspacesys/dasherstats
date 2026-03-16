import { redirect } from 'next/navigation';
import { CarFront, WalletCards, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { AuthForm } from '@/components/auth-form';

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/dashboard');

  return (
    <main className="page-shell">
      <div className="container-width grid min-h-[85vh] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] sm:px-4 sm:py-2">
            Built for quick dash logging
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Keep the app fast.
            <br />
            Keep the money clear.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
            Log each dash, estimate what to hold for taxes, and see what is actually yours after every shift.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Feature icon={CarFront} title="Quick entry" text="Built to log a dash on your phone without a mess." />
            <Feature icon={WalletCards} title="Tax aware" text="Gross, set-aside, and take-home stay visible." />
            <Feature icon={TrendingUp} title="Useful AI" text="Summaries and pattern spotting, not fake accounting." />
          </div>
        </section>

        <section className="fade-up stagger-2">
          <AuthForm />
        </section>
      </div>
    </main>
  );
}

function Feature({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="card p-4">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{text}</p>
    </div>
  );
}
