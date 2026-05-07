import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://siduhagrrutrixgvezeu.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let client: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Return a dummy client during SSR/static generation
    return createClient(supabaseUrl, 'dummy-key-for-build');
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseKey || 'missing-key');
  }
  return client;
}

export async function saveToVault(item: { video_id?: string; title?: string; url?: string; thumbnail?: string; uploader?: string; duration?: number }) {
  if (!supabaseKey) throw new Error('Supabase not configured');
  const { data, error } = await getSupabase().from('vault').insert([item]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getVault() {
  if (!supabaseKey) return [];
  const { data, error } = await getSupabase().from('vault').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function deleteFromVault(id: string) {
  if (!supabaseKey) throw new Error('Supabase not configured');
  const { error } = await getSupabase().from('vault').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function logSearch(query: string) {
  if (!supabaseKey) return null;
  const { data, error } = await getSupabase().from('search_history').insert([{ query }]).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getSearchHistory() {
  if (!supabaseKey) return [];
  const { data, error } = await getSupabase().from('search_history').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getSettings() {
  if (!supabaseKey) return { default_export_format: 'json', max_results: 20, theme: 'dark' };
  const { data, error } = await getSupabase().from('settings').select('*').eq('id', 'global').single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data || { default_export_format: 'json', max_results: 20, theme: 'dark' };
}

export async function saveSettings(settings: Record<string, unknown>) {
  if (!supabaseKey) throw new Error('Supabase not configured');
  const { data, error } = await getSupabase().from('settings').upsert([{ id: 'global', ...settings }]).select().single();
  if (error) throw new Error(error.message);
  return data;
}
