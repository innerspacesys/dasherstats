'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

const suggestions = [
  'Give me a weekly summary.',
  'Tell me if my last 10 dashes were worth it.',
  'What patterns should I watch?',
];

export function AiCard() {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<string>(
    'Ask for a weekly summary, pattern check, or which shifts looked strongest after taxes.',
  );

  async function runAnalysis(input?: string) {
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input || question }),
      });
      const data = await res.json();
      setResponse(data.message ?? 'No analysis returned.');
    } catch {
      setResponse('Something went wrong while calling the AI route.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-[var(--muted-foreground)]">
          This uses your saved entries and profile defaults. Keep it for summaries and pattern spotting, not final tax advice.
        </p>
      </div>

      <div className="space-y-3">
        <textarea
          className="field min-h-[110px] resize-none"
          placeholder="Example: Summarize my last two weeks and tell me if my net hourly is improving."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <button key={item} type="button" className="pill" onClick={() => { setQuestion(item); runAnalysis(item); }}>
              {item}
            </button>
          ))}
        </div>

        <button className="btn-primary w-full sm:w-auto" onClick={() => runAnalysis()} disabled={loading}>
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? 'Thinking...' : 'Run AI analysis'}
        </button>

        <div className="rounded-3xl border border-[var(--border)] bg-[var(--muted)]/60 p-4">
          <p className="whitespace-pre-wrap text-sm leading-6">{response}</p>
        </div>
      </div>
    </div>
  );
}
