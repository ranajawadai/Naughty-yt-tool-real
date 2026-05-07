'use client';

import { useEffect, useState } from 'react';
import { History, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { getSearchHistory } from '@/lib/supabase';

export default function HistoryTool() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await getSearchHistory();
      setHistory(data || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <Card id="history">
      <CardHeader>
        <CardTitle>Search History</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="secondary" size="sm" onClick={load} isLoading={loading}><RefreshCw className="w-4 h-4" /> Refresh</Button>
        {error && <p className="text-sm text-obsidian-danger mt-2">{error}</p>}

        <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {history.length === 0 && !loading && <EmptyState title="No search history yet" />}
          {history.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-3 py-2 rounded-md border border-obsidian-border bg-obsidian-bg hover:bg-obsidian-hover transition-colors">
              <div className="flex items-center gap-2 min-w-0">
                <History className="w-4 h-4 text-obsidian-muted shrink-0" />
                <span className="text-sm text-obsidian-text truncate">{String(item.query || '')}</span>
              </div>
              <span className="text-xs text-obsidian-muted shrink-0">
                {item.created_at ? new Date(String(item.created_at)).toLocaleString() : ''}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
