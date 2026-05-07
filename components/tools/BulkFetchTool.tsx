'use client';

import { useState } from 'react';
import { Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { bulkFetch } from '@/lib/api';
import { saveToVault } from '@/lib/supabase';
import { formatDuration, formatNumber, truncateText } from '@/lib/utils';

export default function BulkFetchTool() {
  const [urlsText, setUrlsText] = useState('');
  const [results, setResults] = useState<Array<{ url: string; success: boolean; data?: Record<string, unknown>; error?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  async function handleFetch() {
    const urls = urlsText.split('\n').map((u) => u.trim()).filter(Boolean);
    if (!urls.length) return;
    setLoading(true);
    setError('');
    try {
      const res = await bulkFetch(urls);
      setResults(res.data || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Bulk fetch failed');
    } finally {
      setLoading(false);
    }
  }

  async function addToVault(item: Record<string, unknown>) {
    try {
      await saveToVault({
        video_id: String(item.id || ''),
        title: String(item.title || ''),
        url: String(item.url || ''),
        thumbnail: String(item.thumbnail || ''),
        uploader: String(item.uploader || ''),
        duration: Number(item.duration || 0),
      });
      setSaved((prev) => new Set(prev).add(String(item.id || item.url)));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to save');
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-fetch.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk URL Fetcher</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea placeholder={`Paste YouTube URLs, one per line:\nhttps://youtube.com/watch?v=...\nhttps://youtube.com/watch?v=...`} value={urlsText} onChange={(e) => setUrlsText(e.target.value)} />
        <div className="flex gap-2 mt-3">
          <Button onClick={handleFetch} isLoading={loading}><Download className="w-4 h-4" /> Fetch All</Button>
          {results.length > 0 && <Button variant="secondary" onClick={exportJson}>Export JSON</Button>}
        </div>
        {error && <p className="text-sm text-obsidian-danger mt-2">{error}</p>}

        <div className="mt-4 space-y-3">
          {results.length === 0 && !loading && !error && <EmptyState title="Paste URLs to fetch metadata" />}
          {results.map((item, idx) => (
            <div key={idx} className={`flex gap-3 p-3 rounded-md border ${item.success ? 'border-obsidian-border bg-obsidian-bg' : 'border-obsidian-danger/30 bg-obsidian-danger/5'} hover:bg-obsidian-hover transition-colors`}>
              {item.success && !!item.data?.thumbnail && (
                <img src={String(item.data.thumbnail)} alt="" className="w-24 h-16 object-cover rounded-md shrink-0 bg-obsidian-panel" loading="lazy" />
              )}
              <div className="min-w-0 flex-1">
                {item.success ? (
                  <>
                    <a href={String(item.data?.url || '#')} target="_blank" rel="noreferrer" className="text-sm font-medium text-obsidian-text hover:text-obsidian-accent truncate block">
                      {truncateText(String(item.data?.title || 'Untitled'), 70)}
                    </a>
                    <p className="text-xs text-obsidian-muted mt-0.5">
                      {String(item.data?.uploader || item.data?.channel || '')} · {formatDuration(Number(item.data?.duration || 0))} · {formatNumber(Number(item.data?.view_count || 0))} views
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-obsidian-danger">{String(item.error || '')}</p>
                )}
              </div>
              {item.success && item.data && (
                <Button variant="ghost" size="sm" onClick={() => addToVault(item.data!)} disabled={saved.has(String(item.data?.id || item.data?.url))}>
                  <Save className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
