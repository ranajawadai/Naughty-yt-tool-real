'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-obsidian-bg px-4">
      <div className="max-w-md w-full bg-obsidian-panel border border-obsidian-border rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold text-obsidian-danger mb-2">Something went wrong</h2>
        <p className="text-sm text-obsidian-muted mb-4">{error.message || 'An unexpected error occurred.'}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-obsidian-accent text-white text-sm font-medium rounded-md hover:bg-blue-500 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
