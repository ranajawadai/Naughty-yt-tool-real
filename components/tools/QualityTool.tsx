'use client';

import { useState } from 'react';
import { Monitor } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchQuality } from '@/lib/api';

export default function QualityTool() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFetch() {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetchQuality(url.trim());
      setData(res.data || null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Quality fetch failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Quality List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input placeholder="Paste video URL..." value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleFetch()} />
          <Button onClick={handleFetch} isLoading={loading}><Monitor className="w-4 h-4" /> List</Button>
        </div>
        {error && <p className="text-sm text-obsidian-danger mt-2">{error}</p>}

        {!data && !loading && !error && <EmptyState title="See all available quality formats" />}
        {data && (
          <div className="mt-4 bg-obsidian-bg border border-obsidian-border rounded-md p-3 overflow-auto max-h-96">
            <pre className="text-xs text-obsidian-text whitespace-pre-wrap">
              {Array.isArray(data.formats) ? data.formats.join('\n') : 'No formats found'}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
