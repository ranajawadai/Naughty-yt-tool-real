'use client';

import { useState } from 'react';
import { Clock, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { durationFilter } from '@/lib/api';
import { saveToVault } from '@/lib/supabase';
import { formatDuration, formatNumber, truncateText } from '@/lib/utils';

export default function DurationFilterTool() {
  const [urlsText, setUrlsText] = useState('');
  const [minSec, setMinSec] = useState('0');
  const [maxSec, setMaxSec] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  async function handleFilter() {
    const urls = urlsText.split('\n').map((u) => u.trim()).filter(Boolean);
    if (!urls.length) return;
    setLoading(true);
    setError('');
    try {
      const res = await durationFilter(urls, Number(minSec || 0), maxSec ? Number(maxSec) : undefined);
      setResults(res.videos || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Filter failed');
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
        <CardTitle>Duration Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea placeholder="Paste YouTube URLs, one per line..." value={urlsText} onChange={(e) => setUrlsText(e.target.value)} />
        <div className="flex gap-2 mt-3">
          <Input type="number" placeholder="Min seconds" value={minSec} onChange={(e) => setMinSec(e.target.value)} className="w-32" />
          <Input type="number" placeholder="Max seconds (optional)" value={maxSec} onChange={(e) => setMaxSec(e.target.value)} className="w-40" />
          <Button onClick={handleFilter} isLoading={loading}><Clock className="w-4 h-4" /> Filter</Button>
        </div>
        {error && <p className="text-sm text-obsidian-danger mt-2">{error}</p>}
        {results.length > 0 && <p className="text-xs text-obsidian-muted mt-2">{String(results.length || '')} videos match</p>}

        <div className="mt-3 space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {results.length === 0 && !loading && !error && <EmptyState title="Filter videos by duration" />}
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
                  {String(item.uploader || item.channel || '')} · {formatDuration(Number(item.duration || 0))} · {formatNumber(Number(item.view_count || 0))} views
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
