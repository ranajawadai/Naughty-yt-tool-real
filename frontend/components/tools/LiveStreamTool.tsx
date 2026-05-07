'use client';

import { useState } from 'react';
import { Radio } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { liveCheck } from '@/lib/api';

export default function LiveStreamTool() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheck() {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await liveCheck(url.trim());
      setData(res.data || null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Live check failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Stream Checker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input placeholder="Paste video or channel URL..." value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCheck()} />
          <Button onClick={handleCheck} isLoading={loading}><Radio className="w-4 h-4" /> Check</Button>
        </div>
        {error && <p className="text-sm text-obsidian-danger mt-2">{error}</p>}

        {!data && !loading && !error && <EmptyState title="Check if a video is live streaming" />}
        {data && (
          <div className="mt-4 p-4 rounded-md border border-obsidian-border bg-obsidian-bg">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${data.is_live ? 'bg-obsidian-danger animate-pulse' : 'bg-obsidian-muted'}`} />
              <span className="text-sm font-medium">{data.is_live ? 'Currently Live' : data.was_live ? 'Was Live' : 'Not Live'}</span>
            </div>
            <p className="text-xs text-obsidian-muted">Title: {String(data.title || 'N/A')}</p>
            <p className="text-xs text-obsidian-muted mt-1">Status: {String(data.live_status || 'N/A')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
