'use client';

import { useEffect, useState } from 'react';
import { Activity, Video, Search, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getVault, getSearchHistory } from '@/lib/supabase';

export default function CommandCenter() {
  const [vaultCount, setVaultCount] = useState(0);
  const [searchCount, setSearchCount] = useState(0);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([getVault(), getSearchHistory()]).then(([v, h]) => {
      setVaultCount(v?.length || 0);
      setSearchCount(h?.length || 0);
      setRecentSearches((h || []).slice(0, 5));
    }).catch(() => {});
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Command Center</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-md border border-obsidian-border bg-obsidian-bg text-center">
            <Database className="w-5 h-5 text-obsidian-accent mx-auto mb-1" />
            <p className="text-lg font-semibold">{vaultCount}</p>
            <p className="text-xs text-obsidian-muted">Vault Items</p>
          </div>
          <div className="p-3 rounded-md border border-obsidian-border bg-obsidian-bg text-center">
            <Search className="w-5 h-5 text-obsidian-success mx-auto mb-1" />
            <p className="text-lg font-semibold">{searchCount}</p>
            <p className="text-xs text-obsidian-muted">Searches</p>
          </div>
          <div className="p-3 rounded-md border border-obsidian-border bg-obsidian-bg text-center">
            <Video className="w-5 h-5 text-obsidian-warning mx-auto mb-1" />
            <p className="text-lg font-semibold">20</p>
            <p className="text-xs text-obsidian-muted">Tools</p>
          </div>
          <div className="p-3 rounded-md border border-obsidian-border bg-obsidian-bg text-center">
            <Activity className="w-5 h-5 text-obsidian-danger mx-auto mb-1" />
            <p className="text-lg font-semibold">Live</p>
            <p className="text-xs text-obsidian-muted">Status</p>
          </div>
        </div>

        {recentSearches.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-obsidian-muted uppercase tracking-wide mb-2">Recent Searches</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((s, idx) => (
                <span key={idx} className="px-2 py-1 text-xs rounded-md border border-obsidian-border bg-obsidian-bg text-obsidian-muted">
                  {String(s.query || '')}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
