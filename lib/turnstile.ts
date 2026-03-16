export async function verifyTurnstileToken(token: string, ip?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return { ok: false, error: 'Missing Turnstile secret key.' };
  }

  if (!token) {
    return { ok: false, error: 'Missing Turnstile token.' };
  }

  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', token);

  if (ip) {
    formData.append('remoteip', ip);
  }

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();

  if (!data.success) {
    return {
      ok: false,
      error: 'Turnstile verification failed.',
      details: data,
    };
  }

  return { ok: true, details: data };
}