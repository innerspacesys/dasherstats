'use client';

import Script from 'next/script';
import { useEffect, useId, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'flexible' | 'compact';
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export function TurnstileWidget({
  onVerify,
  onExpire,
  onError,
}: {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}) {
  const containerId = useId().replace(/:/g, '');
  const widgetIdRef = useRef<string | null>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    function mountWidget() {
      if (!window.turnstile || renderedRef.current) return;

      const el = document.getElementById(containerId);
      if (!el) return;

      widgetIdRef.current = window.turnstile.render(el, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
        callback: (token) => onVerify(token),
        'expired-callback': () => {
          onExpire?.();
        },
        'error-callback': () => {
          onError?.();
        },
        theme: 'auto',
        size: 'flexible',
      });

      renderedRef.current = true;
    }

    const interval = window.setInterval(() => {
      if (window.turnstile) {
        mountWidget();
        window.clearInterval(interval);
      }
    }, 150);

    mountWidget();

    return () => {
      window.clearInterval(interval);
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
      }
      renderedRef.current = false;
      widgetIdRef.current = null;
    };
  }, [containerId, onVerify, onExpire, onError]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        async
        defer
      />
      <div id={containerId} className="min-h-[65px]" />
    </>
  );
}