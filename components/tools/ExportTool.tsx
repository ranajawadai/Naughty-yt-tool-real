'use client';

import { useState } from 'react';
import { FileOutput } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { exportData } from '@/lib/api';

const formats = ['json', 'txt', 'csv', 'md', 'html'];

export default function ExportTool() {
  const [urlsText, setUrlsText] = useState('');
  const [format, setFormat] = useState('json');
  const [result, setResult] = useState<{ format: string; data?: unknown; content?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleExport() {
    const urls = urlsText.split('\n').map((u) => u.trim()).filter(Boolean);
    if (!urls.length) return;
    setLoading(true);
    setError('');
    try {
      const res = await exportData(urls, format);
      setResult({ format: res.format, data: res.data, content: res.content });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setLoading(false);
    }
  }

  function download() {
    if (!result) return;
    const blob = new Blob(
      [result.content || JSON.stringify(result.data, null, 2)],
      { type: result.format === 'json' ? 'application/json' : result.format === 'csv' ? 'text/csv' : result.format === 'html' ? 'text/html' : 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export.${String(result.format || '')}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Export</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea placeholder="Paste YouTube URLs, one per line..." value={urlsText} onChange={(e) => setUrlsText(e.target.value)} />
        <div className="flex gap-2 mt-3">
          <select className="w-28" value={format} onChange={(e) => setFormat(e.target.value)}>
            {formats.map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
          </select>
          <Button onClick={handleExport} isLoading={loading}><FileOutput className="w-4 h-4" /> Export</Button>
          {result && <Button variant="secondary" onClick={download}>Download</Button>}
        </div>
        {error && <p className="text-sm text-obsidian-danger mt-2">{error}</p>}
        {result && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-obsidian-muted uppercase tracking-wide">Preview</p>
            </div>
            <pre className="text-xs bg-obsidian-bg border border-obsidian-border rounded-md p-3 overflow-auto max-h-96 text-obsidian-text whitespace-pre-wrap">
              {result.content || JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}
        {!result && !loading && !error && <EmptyState title="Export video metadata" />}
      </CardContent>
    </Card>
  );
}
