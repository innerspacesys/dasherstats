'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Script from 'next/script';
import { TurnstileWidget } from '@/components/turnstile-widget';

const supabase = createClient();

declare global {
  interface Window {
    handleGoogleCredential?: (response: { credential: string }) => void;
  }
}

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.handleGoogleCredential = async (response: { credential: string }) => {
      setLoading(true);
      setError(null);
      setMessage(null);

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
      setLoading(false);
    };

    return () => {
      delete window.handleGoogleCredential;
    };
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!turnstileToken) {
      setError('Please complete the verification check.');
      setLoading(false);
      return;
    }

    const endpoint =
      mode === 'login' ? '/api/auth/login' : '/api/auth/signup';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, turnstileToken }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error || 'Authentication failed.');
      setLoading(false);
      return;
    }

    setMessage(
      mode === 'signup'
        ? 'Account created. Check your email if confirmation is on.'
        : 'Logged in. Redirecting...'
    );

    router.push('/dashboard');
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="card-strong p-6 sm:p-8">
      <Script src="https://accounts.google.com/gsi/client" async defer />

      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        data-context={mode === 'signup' ? 'signup' : 'signin'}
        data-ux_mode="popup"
        data-callback="handleGoogleCredential"
        data-itp_support="true"
      />

      <div className="mb-6">
        <p className="text-sm font-medium text-[var(--muted-foreground)]">Welcome</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">Sign in to DashMetrx</h2>
      </div>

      <div className="mb-6 flex gap-2 rounded-2xl bg-[var(--muted)] p-1">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setTurnstileToken(null);
          }}
          className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold ${
            mode === 'login'
              ? 'bg-[var(--foreground)] text-[var(--background)]'
              : 'text-[var(--muted-foreground)]'
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup');
            setTurnstileToken(null);
          }}
          className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold ${
            mode === 'signup'
              ? 'bg-[var(--foreground)] text-[var(--background)]'
              : 'text-[var(--muted-foreground)]'
          }`}
        >
          Sign up
        </button>
      </div>

      <div className="mb-4 flex justify-center">
        <div
          className="g_id_signin"
          data-type="standard"
          data-shape="pill"
          data-theme="filled_blue"
          data-text={mode === 'signup' ? 'signup_with' : 'continue_with'}
          data-size="large"
          data-logo_alignment="left"
          data-width="320"
        />
      </div>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-xs text-[var(--muted-foreground)]">or</span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            className="field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <TurnstileWidget
            onVerify={(token) => {
              setTurnstileToken(token);
              setError(null);
            }}
            onExpire={() => {
              setTurnstileToken(null);
            }}
            onError={() => {
              setTurnstileToken(null);
              setError('Verification failed. Please try again.');
            }}
          />
        </div>

        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        {message ? <p className="text-sm text-[var(--success)]">{message}</p> : null}

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Working...' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>
    </div>
  );
}