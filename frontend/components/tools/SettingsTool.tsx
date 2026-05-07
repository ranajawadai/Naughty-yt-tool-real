'use client';

import { useEffect, useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { getSettings, saveSettings } from '@/lib/supabase';

export default function SettingsTool() {
  const [format, setFormat] = useState('json');
  const [maxResults, setMaxResults] = useState(20);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getSettings().then((s) => {
      setFormat(String(s.default_export_format || 'json'));
      setMaxResults(Number(s.max_results || 20));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      await saveSettings({ default_export_format: format, max_results: maxResults });
      setMessage('Settings saved');
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card id="settings">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-obsidian-text mb-1">Default Export Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full">
              {['json', 'txt', 'csv', 'md', 'html'].map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-obsidian-text mb-1">Default Max Results</label>
            <input type="number" min={1} max={100} value={maxResults} onChange={(e) => setMaxResults(Number(e.target.value))} className="w-full" />
          </div>
          <Button onClick={handleSave} isLoading={saving || loading}><Save className="w-4 h-4" /> Save Settings</Button>
          {message && <p className="text-sm text-obsidian-muted">{message}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
