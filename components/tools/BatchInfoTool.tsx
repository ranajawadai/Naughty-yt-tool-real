'use client';

import { useState } from 'react';
import { Zap, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { batchInfo } from '@/lib/api';
import { formatNumber, formatDuration } from '@/lib/utils';

export default function BatchInfoTool() {
  const [urlsText, setUrlsText] = useState('');
  const [infos, setInfos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFetch() {
    const urls = urlsText.split('\n').map((u) => u.trim()).filter(Boolean);
    if (!urls.length) return;
    setLoading(true);
    setError('');
    try {
      const res = await batchInfo(urls);
      setInfos(res.infos || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Batch info failed');
    } finally {
      setLoading(false);
    }
  }

  function exportCsv() {
    if (!infos.length) return;
    const rows = infos.map((i) => [
      String(i.url || ''),
      String(i.id || ''),
      String(i.title || ''),
      formatDuration(Number(i.duration || 0)),
      String(i.views || ''),
      String(i.uploader || ''),
    ]);
    const headers = ['URL', 'ID', 'Title', 'Duration', 'Views', 'Uploader'];
    const csv = [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch-info.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Video Info</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea placeholder={`Paste many YouTube URLs (100+) for fast stats:\nhttps://...\nhttps://...`} value={urlsText} onChange={(e) => setUrlsText(e.target.value)} />
        <div className="flex gap-2 mt-3">
          <Button onClick={handleFetch} isLoading={loading}><Zap className="w-4 h-4" /> Fetch</Button>
          {infos.length > 0 && <Button variant="secondary" onClick={exportCsv}><Download className="w-4 h-4" /> CSV</Button>}
        </div>
        {error && <p className="text-sm text-obsidian-danger mt-2">{error}</p>}
        {infos.length > 0 && <p className="text-xs text-obsidian-muted mt-2">{String(infos.length || '')} items processed</p>}

        <div className="mt-4 overflow-x-auto">
          {infos.length === 0 && !loading && !error && <EmptyState title="Paste URLs for fast batch stats" />}
          {infos.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-obsidian-border text-obsidian-muted">
                  <th className="text-left py-2 px-2">Title</th>
                  <th className="text-right py-2 px-2">Duration</th>
                  <th className="text-right py-2 px-2">Views</th>
                  <th className="text-left py-2 px-2">Uploader</th>
                </tr>
              </thead>
              <tbody>
                {infos.map((i, idx) => (
                  <tr key={idx} className="border-b border-obsidian-border/50 hover:bg-obsidian-hover transition-colors">
                    <td className="py-2 px-2 max-w-xs truncate">{i.error ? <span className="text-obsidian-danger">{String(i.error)}</span> : String(i.title || '')}</td>
                    <td className="py-2 px-2 text-right">{formatDuration(Number(i.duration || 0))}</td>
                    <td className="py-2 px-2 text-right">{formatNumber(Number(i.views || 0))}</td>
                    <td className="py-2 px-2 truncate">{String(i.uploader || '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
