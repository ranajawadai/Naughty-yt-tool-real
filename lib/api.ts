const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://ranajawad-naughty-yt-tool-real.hf.space';

async function post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function get<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function healthCheck() {
  return get<{ status: string }>('/health');
}

export async function fetchVideo(url: string, includeTranscript = false) {
  return post<{ success: boolean; data: Record<string, unknown> }>('/fetch', { url, include_transcript: includeTranscript });
}

export async function bulkFetch(urls: string[]) {
  return post<{ success: boolean; data: Array<{ url: string; success: boolean; data?: Record<string, unknown>; error?: string }> }>('/bulk-fetch', { urls });
}

export async function searchVideos(query: string, maxResults = 10) {
  return post<{ success: boolean; results: Array<Record<string, unknown>> }>('/search', { query, max_results: maxResults });
}

export async function categorySearch(query: string, category: string, maxResults = 10) {
  return post<{ success: boolean; results: Array<Record<string, unknown>> }>('/category-search', { query, category, max_results: maxResults });
}

export async function trendingVideos(category?: string, maxResults = 20) {
  const qs = new URLSearchParams();
  if (category) qs.set('category', category);
  qs.set('max_results', String(maxResults));
  return get<{ success: boolean; results: Array<Record<string, unknown>> }>(`/trending?${qs.toString()}`);
}

export async function fetchPlaylist(url: string, maxResults = 50) {
  return post<{ success: boolean; results: Array<Record<string, unknown>> }>('/playlist', { url, max_results: maxResults });
}

export async function videoStats(urls: string[]) {
  return post<{ success: boolean; stats: Array<Record<string, unknown>> }>('/stats', { urls });
}

export async function channelInfo(url: string) {
  return post<{ success: boolean; channel: Record<string, unknown> }>('/channel', { url });
}

export async function channelVideos(url: string, maxResults = 30) {
  return post<{ success: boolean; videos: Array<Record<string, unknown>> }>('/channel-videos', { url, max_results: maxResults });
}

export async function compareVideos(urls: string[]) {
  return post<{ success: boolean; comparison: Array<Record<string, unknown>> }>('/compare', { urls });
}

export async function durationFilter(urls: string[], minSeconds = 0, maxSeconds?: number) {
  const body: Record<string, unknown> = { urls, min_seconds: minSeconds };
  if (maxSeconds !== undefined) body.max_seconds = maxSeconds;
  return post<{ success: boolean; videos: Array<Record<string, unknown>> }>('/duration-filter', body);
}

export async function batchInfo(urls: string[]) {
  return post<{ success: boolean; infos: Array<Record<string, unknown>> }>('/batch-info', { urls });
}

export async function exportData(urls: string[], format: string) {
  return post<{ success: boolean; format: string; data?: unknown; content?: string }>('/export', { urls, format });
}

export async function mp3Info(url: string) {
  return post<{ success: boolean; data: Record<string, unknown> }>('/mp3', { url });
}

export async function mp4Info(url: string) {
  return post<{ success: boolean; data: Record<string, unknown> }>('/mp4', { url });
}

export async function liveCheck(url: string) {
  return post<{ success: boolean; data: Record<string, unknown> }>('/live-check', { url });
}

export async function fetchSubtitles(url: string, lang = 'en') {
  return post<{ success: boolean; data: Record<string, unknown> }>('/subtitles', { url, lang });
}

export async function fetchQuality(url: string) {
  return post<{ success: boolean; data: Record<string, unknown> }>('/quality', { url });
}