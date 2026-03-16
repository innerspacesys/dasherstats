import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BatchDashForm } from '@/components/batch-dash-form';
import type { ProfileRow } from '@/lib/types';

export default async function BatchAddPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Batch add dashes</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Add multiple shifts at once, then save them together.
          </p>
        </div>

        <Link href="/dashboard/dashes" className="btn-secondary w-full sm:w-auto">
          Back to dashes
        </Link>
      </div>

      <BatchDashForm profile={profile as ProfileRow} />
    </div>
  );
}