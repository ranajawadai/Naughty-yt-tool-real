'use client';

import { useState } from 'react';
import { Music } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { mp3Info } from '@/lib/api';

export default function Mp3Tool() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFetch() {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await mp3Info(url.trim());
      setData(res.data || null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to get MP3 info');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>YouTube to MP3</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input placeholder="Paste video URL..." value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleFetch()} />
          <Button onClick={handleFetch} isLoading={loading}><Music className="w-4 h-4" /> Info</Button>
        </div>
        {error && <p className="text-sm text-obsidian-danger mt-2">{error}</p>}

        {!data && !loading && !error && <EmptyState title="Get audio download info" description="We return format info; use yt-dlp locally to download." />}
        {data && (
          <div className="mt-4 space-y-3">
            <p className="text-xs text-obsidian-muted">{String(data.note || '')}</p>
            <div className="bg-obsidian-bg border border-obsidian-border rounded-md p-3 overflow-auto max-h-64">
              <p className="text-xs font-medium text-obsidian-muted mb-1">Available audio formats</p>
              <pre className="text-xs text-obsidian-text whitespace-pre-wrap">
                {Array.isArray(data.audio_formats) ? data.audio_formats.join('\n') : 'No audio formats found'}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
