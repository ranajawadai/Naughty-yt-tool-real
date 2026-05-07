'use client';

import { useState } from 'react';
import { BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { videoStats } from '@/lib/api';
import { formatNumber, formatDuration } from '@/lib/utils';

export default function StatsTool() {
  const [urlsText, setUrlsText] = useState('');
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleFetch() {
    const urls = urlsText.split('\n').map((u) => u.trim()).filter(Boolean);
    if (!urls.length) return;
    setLoading(true);
    setError('');
    try {
      const res = await videoStats(urls);
      setStats(res.stats || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Stats fetch failed');
    } finally {
      setLoading(false);
    }
  }

  function exportCsv() {
    if (!stats.length) return;
    const rows = stats.map((s) => [
      String(s.url || ''),
      String(s.title || ''),
      String(s.views || ''),
      String(s.likes || ''),
      String(s.comments || ''),
      formatDuration(Number(s.duration || 0)),
    ]);
    const headers = ['URL', 'Title', 'Views', 'Likes', 'Comments', 'Duration'];
    const csv = [headers.join(','), ...rows.map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stats.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea placeholder="Paste YouTube URLs, one per line..." value={urlsText} onChange={(e) => setUrlsText(e.target.value)} />
        <div className="flex gap-2 mt-3">
          <Button onClick={handleFetch} isLoading={loading}><BarChart3 className="w-4 h-4" /> Get Stats</Button>
          {stats.length > 0 && <Button variant="secondary" onClick={exportCsv}><Download className="w-4 h-4" /> CSV</Button>}
        </div>
        {error && <p className="text-sm text-obsidian-danger mt-2">{error}</p>}

        <div className="mt-4 overflow-x-auto">
          {stats.length === 0 && !loading && !error && <EmptyState title="Enter URLs to get statistics" />}
          {stats.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-obsidian-border text-obsidian-muted">
                  <th className="text-left py-2 px-2">Title</th>
                  <th className="text-right py-2 px-2">Views</th>
                  <th className="text-right py-2 px-2">Likes</th>
                  <th className="text-right py-2 px-2">Comments</th>
                  <th className="text-right py-2 px-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s, idx) => (
                  <tr key={idx} className="border-b border-obsidian-border/50 hover:bg-obsidian-hover transition-colors">
                    <td className="py-2 px-2 max-w-xs truncate">{s.error ? <span className="text-obsidian-danger">{String(s.error)}</span> : String(s.title || '')}</td>
                    <td className="py-2 px-2 text-right">{formatNumber(Number(s.views || 0))}</td>
                    <td className="py-2 px-2 text-right">{formatNumber(Number(s.likes || 0))}</td>
                    <td className="py-2 px-2 text-right">{formatNumber(Number(s.comments || 0))}</td>
                    <td className="py-2 px-2 text-right">{formatDuration(Number(s.duration || 0))}</td>
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
