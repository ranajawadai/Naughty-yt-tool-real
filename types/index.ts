export interface VideoData {
  id?: string;
  title?: string;
  url?: string;
  duration?: number;
  duration_string?: string;
  view_count?: number;
  like_count?: number;
  upload_date?: string;
  uploader?: string;
  uploader_id?: string;
  channel?: string;
  channel_id?: string;
  channel_url?: string;
  description?: string;
  thumbnail?: string;
  tags?: string[];
  categories?: string[];
  transcript?: string[];
}

export interface ChannelData {
  channel_id?: string;
  channel?: string;
  channel_url?: string;
  uploader?: string;
  uploader_id?: string;
}

export interface StatEntry {
  url: string;
  id?: string;
  title?: string;
  views?: number;
  likes?: number;
  comments?: number;
  duration?: number;
  upload_date?: string;
  error?: string;
}

export interface CompareEntry {
  url: string;
  id?: string;
  title?: string;
  views?: number;
  likes?: number;
  duration?: number;
  upload_date?: string;
  uploader?: string;
  error?: string;
}

export interface BulkResult {
  url: string;
  success: boolean;
  data?: VideoData;
  error?: string;
}

export interface ExportResult {
  format: string;
  data?: BulkResult[];
  content?: string;
}

export interface LiveCheckResult {
  url: string;
  is_live: boolean;
  was_live: boolean;
  live_status?: string;
  title?: string;
}

export interface SubtitleResult {
  url: string;
  language: string;
  available_subtitles_raw?: string;
  subtitles: string[];
}

export interface QualityResult {
  url: string;
  formats: string[];
}

export interface Mp3Result {
  url: string;
  audio_formats: string[];
  note: string;
}

export interface Mp4Result {
  url: string;
  video_formats: string[];
  note: string;
}

export interface VaultItem {
  id?: string;
  video_id?: string;
  title?: string;
  url?: string;
  thumbnail?: string;
  uploader?: string;
  duration?: number;
  created_at?: string;
}

export interface SearchLog {
  id?: string;
  query?: string;
  created_at?: string;
}

export interface ToolDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'discovery' | 'analysis' | 'download' | 'utilities';
}