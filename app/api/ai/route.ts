import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { summarizeDashes } from '@/lib/calculations';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'You must be logged in to use AI analysis.' }, { status: 401 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({
        message: 'OPENROUTER_API_KEY is missing. Add it to your environment variables first.',
      });
    }

    const body = await request.json().catch(() => ({}));
    const question = typeof body?.question === 'string' && body.question.trim()
      ? body.question.trim()
      : 'Give me a concise summary of my recent dashes and the main pattern I should pay attention to.';

    const [{ data: dashes }, { data: profile }] = await Promise.all([
      supabase.from('dashes').select('*').eq('user_id', user.id).order('dash_date', { ascending: false }).limit(30),
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    ]);

    const rows = dashes ?? [];
    const summary = summarizeDashes(rows);
    const latest = rows.slice(0, 8).map((row) => ({
      dash_date: row.dash_date,
      gross_amount: row.gross_amount,
      tax_rate: row.tax_rate,
      start_time: row.start_time,
      end_time: row.end_time,
      start_odometer: row.start_odometer,
      end_odometer: row.end_odometer,
      payout_note: row.payout_note,
      notes: row.notes,
    }));

    const prompt = `
You are helping a gig driver understand their dash performance.
Be practical and brief. Do not pretend to be an accountant.
Use only the data below.

User question:
${question}

Profile defaults:
${JSON.stringify({
  home_state: profile?.home_state ?? null,
  self_employment_tax_rate: profile?.self_employment_tax_rate ?? null,
  income_tax_rate: profile?.income_tax_rate ?? null,
  combined_tax_rate: profile?.combined_tax_rate ?? null,
}, null, 2)}

Summary:
${JSON.stringify(summary, null, 2)}

Recent dashes:
${JSON.stringify(latest, null, 2)}

Response rules:
- 1 short overview paragraph
- 3 bullet points max
- Call out one caution if the user is underestimating taxes or earning weak net hourly
- No made-up legal or tax claims
`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-oss-120b',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || 'OpenRouter request failed.';
      return NextResponse.json({ message }, { status: 500 });
    }

    const message = data?.choices?.[0]?.message?.content || 'No response came back from OpenRouter.';
    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Unknown AI error' },
      { status: 500 },
    );
  }
}
