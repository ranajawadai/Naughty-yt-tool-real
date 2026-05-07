'use client';

import { useState } from 'react';
import { Subtitles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchSubtitles } from '@/lib/api';

export default function SubtitleTool() {
  const [url, setUrl] = useState('');
  const [lang, setLang] = useState('en');
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFetch() {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetchSubtitles(url.trim(), lang);
      setData(res.data || null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Subtitle fetch failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subtitle Downloader</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input placeholder="Paste video URL..." value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleFetch()} />
          <Input className="w-24" placeholder="lang" value={lang} onChange={(e) => setLang(e.target.value)} />
          <Button onClick={handleFetch} isLoading={loading}><Subtitles className="w-4 h-4" /> Fetch</Button>
        </div>
        {error && <p className="text-sm text-obsidian-danger mt-2">{error}</p>}

        {!data && !loading && !error && <EmptyState title="Fetch subtitles/transcripts" />}
        {data && (
          <div className="mt-4 space-y-3">
            <div className="bg-obsidian-bg border border-obsidian-border rounded-md p-3 overflow-auto max-h-64">
              <p className="text-xs font-medium text-obsidian-muted mb-1">Available subtitles</p>
              <pre className="text-xs text-obsidian-text whitespace-pre-wrap">{String(data.available_subtitles_raw || 'None')}</pre>
            </div>
            {Array.isArray(data.subtitles) && data.subtitles.length > 0 && (
              <div className="bg-obsidian-bg border border-obsidian-border rounded-md p-3 overflow-auto max-h-64">
                <p className="text-xs font-medium text-obsidian-muted mb-1">Extracted lines</p>
                <pre className="text-xs text-obsidian-text whitespace-pre-wrap">{data.subtitles.join('\n')}</pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
