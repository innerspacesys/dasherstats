import { NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim();
    const password = String(body.password || '');
    const turnstileToken = String(body.turnstileToken || '');

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const forwardedFor =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;

    const turnstile = await verifyTurnstileToken(turnstileToken, forwardedFor);

    if (!turnstile.ok) {
      return NextResponse.json(
        { error: turnstile.error || 'Turnstile verification failed.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create account.' },
      { status: 500 }
    );
  }
}