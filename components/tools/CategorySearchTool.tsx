'use client';

import { useState } from 'react';
import { Search, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { categorySearch } from '@/lib/api';
import { saveToVault } from '@/lib/supabase';
import { formatDuration, formatNumber, truncateText } from '@/lib/utils';

const categories = ['Music', 'Gaming', 'Education', 'Entertainment', 'Sports', 'Tech', 'News', 'Comedy', 'Film', 'Science'];

export default function CategorySearchTool() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  async function handleSearch() {
    if (!query.trim() || !category) return;
    setLoading(true);
    setError('');
    try {
      const res = await categorySearch(query.trim(), category, 20);
      setResults(res.results || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Category search failed');
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
        <CardTitle>Category Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input placeholder="Search keyword..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
          <select className="sm:w-40" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button onClick={handleSearch} isLoading={loading}><Search className="w-4 h-4" /> Search</Button>
        </div>
        {error && <p className="text-sm text-obsidian-danger mt-2">{error}</p>}

        <div className="mt-4 space-y-3">
          {results.length === 0 && !loading && !error && <EmptyState title="Search within a category" />}
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
