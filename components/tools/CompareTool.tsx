'use client';

import { useState } from 'react';
import { GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { compareVideos } from '@/lib/api';
import { formatNumber, formatDuration } from '@/lib/utils';

export default function CompareTool() {
  const [urlsText, setUrlsText] = useState('');
  const [comparison, setComparison] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCompare() {
    const urls = urlsText.split('\n').map((u) => u.trim()).filter(Boolean);
    if (urls.length < 2) return;
    setLoading(true);
    setError('');
    try {
      const res = await compareVideos(urls);
      setComparison(res.comparison || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Comparison failed');
    } finally {
      setLoading(false);
    }
  }

  const maxViews = Math.max(...comparison.map((c) => Number(c.views || 0)), 0);
  const maxLikes = Math.max(...comparison.map((c) => Number(c.likes || 0)), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare Videos</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea placeholder={`Paste 2+ YouTube URLs to compare:\nhttps://...\nhttps://...`} value={urlsText} onChange={(e) => setUrlsText(e.target.value)} />
        <div className="flex gap-2 mt-3">
          <Button onClick={handleCompare} isLoading={loading}><GitCompare className="w-4 h-4" /> Compare</Button>
        </div>
        {error && <p className="text-sm text-obsidian-danger mt-2">{error}</p>}

        <div className="mt-4 overflow-x-auto">
          {comparison.length === 0 && !loading && !error && <EmptyState title="Enter at least 2 URLs to compare" />}
          {comparison.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-obsidian-border text-obsidian-muted">
                  <th className="text-left py-2 px-2">Video</th>
                  <th className="text-right py-2 px-2">Views</th>
                  <th className="text-right py-2 px-2">Likes</th>
                  <th className="text-right py-2 px-2">Duration</th>
                  <th className="text-left py-2 px-2">Uploader</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((c, idx) => {
                  const isTopViews = Number(c.views || 0) === maxViews && maxViews > 0;
                  const isTopLikes = Number(c.likes || 0) === maxLikes && maxLikes > 0;
                  return (
                    <tr key={idx} className="border-b border-obsidian-border/50 hover:bg-obsidian-hover transition-colors">
                      <td className="py-2 px-2 max-w-xs truncate">{c.error ? <span className="text-obsidian-danger">{String(c.error)}</span> : String(c.title || '')}</td>
                      <td className={`py-2 px-2 text-right ${isTopViews ? 'text-obsidian-success font-semibold' : ''}`}>{formatNumber(Number(c.views || 0))}</td>
                      <td className={`py-2 px-2 text-right ${isTopLikes ? 'text-obsidian-success font-semibold' : ''}`}>{formatNumber(Number(c.likes || 0))}</td>
                      <td className="py-2 px-2 text-right">{formatDuration(Number(c.duration || 0))}</td>
                      <td className="py-2 px-2 truncate">{String(c.uploader || '')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
