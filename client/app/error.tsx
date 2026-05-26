"use client";

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <div className="max-w-md rounded-3xl border border-white/70 bg-white p-8 text-center shadow-lift">
          <h2 className="text-2xl font-semibold text-slate-900">Something went wrong</h2>
          <p className="mt-3 text-sm text-slate-500">The application hit an unexpected error. You can retry or refresh the page.</p>
          <Button className="mt-6" onClick={() => reset()}>
            Try Again
          </Button>
        </div>
      </body>
    </html>
  );
}