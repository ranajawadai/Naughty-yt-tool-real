'use client';

import { useEffect, useState } from 'react';
import { Trash2, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { getVault, deleteFromVault } from '@/lib/supabase';
import { formatDuration, truncateText } from '@/lib/utils';

export default function VaultTool() {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await getVault();
      setItems(data || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load vault');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    try {
      await deleteFromVault(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Delete failed');
    }
  }

  const filtered = items.filter((i) => {
    const q = filter.toLowerCase();
    return String(i.title || '').toLowerCase().includes(q) || String(i.uploader || '').toLowerCase().includes(q);
  });

  return (
    <Card id="vault">
      <CardHeader>
        <CardTitle>Vault</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input placeholder="Filter saved videos..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          <Button variant="secondary" onClick={load} isLoading={loading}><HardDrive className="w-4 h-4" /> Refresh</Button>
        </div>
        {error && <p className="text-sm text-obsidian-danger mt-2">{error}</p>}

        <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {filtered.length === 0 && !loading && <EmptyState title="Your vault is empty" description="Save videos from other tools to see them here." />}
          {filtered.map((item) => (
            <div key={String(item.id)} className="flex gap-3 p-3 rounded-md border border-obsidian-border bg-obsidian-bg hover:bg-obsidian-hover transition-colors">
              {!!item.thumbnail && (
                <img src={String(item.thumbnail)} alt="" className="w-24 h-16 object-cover rounded-md shrink-0 bg-obsidian-panel" loading="lazy" />
              )}
              <div className="min-w-0 flex-1">
                <a href={String(item.url || '#')} target="_blank" rel="noreferrer" className="text-sm font-medium text-obsidian-text hover:text-obsidian-accent truncate block">
                  {truncateText(String(item.title || 'Untitled'), 70)}
                </a>
                <p className="text-xs text-obsidian-muted mt-0.5">
                  {String(item.uploader || '')} · {formatDuration(Number(item.duration || 0))}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => remove(String(item.id))}>
                <Trash2 className="w-4 h-4 text-obsidian-danger" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
