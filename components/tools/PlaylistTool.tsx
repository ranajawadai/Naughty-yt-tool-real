'use client';

import { useState } from 'react';
import { ListVideo, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchPlaylist } from '@/lib/api';
import { saveToVault } from '@/lib/supabase';
import { formatDuration, formatNumber, truncateText } from '@/lib/utils';

export default function PlaylistTool() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  async function handleFetch() {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetchPlaylist(url.trim(), 50);
      setResults(res.results || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to fetch playlist');
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Playlist Fetcher</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input placeholder="Paste playlist URL..." value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleFetch()} />
          <Button onClick={handleFetch} isLoading={loading}><ListVideo className="w-4 h-4" /> Fetch</Button>
        </div>
        {error && <p className="text-sm text-obsidian-danger mt-2">{error}</p>}
        {results.length > 0 && <p className="text-xs text-obsidian-muted mt-2">{String(results.length || '')} videos found</p>}

        <div className="mt-3 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {results.length === 0 && !loading && !error && <EmptyState title="Enter a playlist URL" />}
          {results.map((item, idx) => (
            <div key={idx} className="flex gap-3 p-3 rounded-md border border-obsidian-border bg-obsidian-bg hover:bg-obsidian-hover transition-colors">
              {!!item.thumbnail && (
                <img src={String(item.thumbnail)} alt="" className="w-24 h-16 object-cover rounded-md shrink-0 bg-obsidian-panel" loading="lazy" />
              )}
              <div className="min-w-0 flex-1">
                <a href={String(item.url || '#')} target="_blank" rel="noreferrer" className="text-sm font-medium text-obsidian-text hover:text-obsidian-accent truncate block">
                  {truncateText(String(item.title || 'Untitled'), 70)}
                </a>
                <p className="text-xs text-obsidian-muted mt-0.5">
                  {String(item.uploader || item.channel || '')} · {formatDuration(Number(item.duration || 0))}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => addToVault(item)} disabled={saved.has(String(item.id || item.url))}>
                <Save className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
