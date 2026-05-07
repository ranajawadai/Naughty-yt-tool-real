'use client';

import { useState } from 'react';
import {
  Search, Download, ListVideo, BarChart3, User, GitCompare, Clock, Zap,
  FileOutput, Music, Video, Radio, Subtitles, Monitor, HardDrive, History,
  Settings, Activity, Youtube, TrendingUp, Layers,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ToolCard from '@/components/layout/ToolCard';
import SearchTool from '@/components/tools/SearchTool';
import BulkFetchTool from '@/components/tools/BulkFetchTool';
import CategorySearchTool from '@/components/tools/CategorySearchTool';
import TrendingTool from '@/components/tools/TrendingTool';
import PlaylistTool from '@/components/tools/PlaylistTool';
import StatsTool from '@/components/tools/StatsTool';
import ChannelTool from '@/components/tools/ChannelTool';
import CompareTool from '@/components/tools/CompareTool';
import DurationFilterTool from '@/components/tools/DurationFilterTool';
import BatchInfoTool from '@/components/tools/BatchInfoTool';
import ExportTool from '@/components/tools/ExportTool';
import Mp3Tool from '@/components/tools/Mp3Tool';
import Mp4Tool from '@/components/tools/Mp4Tool';
import LiveStreamTool from '@/components/tools/LiveStreamTool';
import SubtitleTool from '@/components/tools/SubtitleTool';
import QualityTool from '@/components/tools/QualityTool';
import VaultTool from '@/components/tools/VaultTool';
import HistoryTool from '@/components/tools/HistoryTool';
import SettingsTool from '@/components/tools/SettingsTool';
import CommandCenter from '@/components/tools/CommandCenter';
import type { ToolDef } from '@/types';

const tools: ToolDef[] = [
  { id: 'search', title: 'Search', description: 'Keyword search with thumbnails and metadata.', icon: 'Search', category: 'discovery' },
  { id: 'bulk-fetch', title: 'Bulk Fetch', description: 'Paste multiple URLs and fetch all metadata at once.', icon: 'Download', category: 'discovery' },
  { id: 'category-search', title: 'Category Search', description: 'Search within specific YouTube categories.', icon: 'Layers', category: 'discovery' },
  { id: 'trending', title: 'Trending', description: 'Fetch trending videos by category.', icon: 'TrendingUp', category: 'discovery' },
  { id: 'playlist', title: 'Playlist', description: 'Extract all videos from a playlist.', icon: 'ListVideo', category: 'discovery' },
  { id: 'stats', title: 'Stats', description: 'Quick statistics table for multiple videos.', icon: 'BarChart3', category: 'analysis' },
  { id: 'channel', title: 'Channel Info', description: 'Channel metadata and recent videos.', icon: 'User', category: 'analysis' },
  { id: 'compare', title: 'Compare', description: 'Side-by-side comparison of videos.', icon: 'GitCompare', category: 'analysis' },
  { id: 'duration-filter', title: 'Duration Filter', description: 'Filter videos by length range.', icon: 'Clock', category: 'analysis' },
  { id: 'batch-info', title: 'Batch Info', description: 'Fast stats from 100+ URLs.', icon: 'Zap', category: 'analysis' },
  { id: 'export', title: 'Export', description: 'Export data as JSON, CSV, MD, TXT, or HTML.', icon: 'FileOutput', category: 'download' },
  { id: 'mp3', title: 'MP3 Info', description: 'Get audio download format info.', icon: 'Music', category: 'download' },
  { id: 'mp4', title: 'MP4 Info', description: 'Get video download format info.', icon: 'Video', category: 'download' },
  { id: 'subtitles', title: 'Subtitles', description: 'Fetch and view subtitles/transcripts.', icon: 'Subtitles', category: 'download' },
  { id: 'quality', title: 'Quality', description: 'List all available quality formats.', icon: 'Monitor', category: 'download' },
  { id: 'live-check', title: 'Live Check', description: 'Check if a video is currently live.', icon: 'Radio', category: 'utilities' },
  { id: 'command-center', title: 'Overview', description: 'Dashboard overview and recent activity.', icon: 'Activity', category: 'utilities' },
  { id: 'vault', title: 'Vault', description: 'Saved videos and manage your collection.', icon: 'HardDrive', category: 'utilities' },
  { id: 'history', title: 'History', description: 'Recent search queries log.', icon: 'History', category: 'utilities' },
  { id: 'settings', title: 'Settings', description: 'Preferences and default options.', icon: 'Settings', category: 'utilities' },
];

const iconMap: Record<string, React.ElementType> = {
  Search, Download, ListVideo, BarChart3, User, GitCompare, Clock, Zap,
  FileOutput, Music, Video, Radio, Subtitles, Monitor, HardDrive, History,
  Settings, Activity, Youtube, TrendingUp, Layers,
};

const categories = [
  { key: 'discovery', label: 'Discovery' },
  { key: 'analysis', label: 'Analysis' },
  { key: 'download', label: 'Download' },
  { key: 'utilities', label: 'Utilities' },
];

export default function Home() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  function scrollToTool(id: string) {
    setActiveTool(id);
    setTimeout(() => {
      const el = document.getElementById(`tool-section-${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function renderTool(id: string) {
    switch (id) {
      case 'search': return <SearchTool />;
      case 'bulk-fetch': return <BulkFetchTool />;
      case 'category-search': return <CategorySearchTool />;
      case 'trending': return <TrendingTool />;
      case 'playlist': return <PlaylistTool />;
      case 'stats': return <StatsTool />;
      case 'channel': return <ChannelTool />;
      case 'compare': return <CompareTool />;
      case 'duration-filter': return <DurationFilterTool />;
      case 'batch-info': return <BatchInfoTool />;
      case 'export': return <ExportTool />;
      case 'mp3': return <Mp3Tool />;
      case 'mp4': return <Mp4Tool />;
      case 'live-check': return <LiveStreamTool />;
      case 'subtitles': return <SubtitleTool />;
      case 'quality': return <QualityTool />;
      case 'vault': return <VaultTool />;
      case 'history': return <HistoryTool />;
      case 'settings': return <SettingsTool />;
      case 'command-center': return <CommandCenter />;
      default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-obsidian-bg text-obsidian-text">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-obsidian-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-xl bg-obsidian-accent/10 mb-4">
              <Youtube className="w-10 h-10 text-obsidian-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">YouTube Intelligence Suite</h1>
            <p className="mt-3 text-obsidian-muted max-w-xl text-sm sm:text-base">
              Professional tools for YouTube discovery, analysis, and metadata extraction.
              Powered by yt-dlp. No auth required.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-5 py-2.5 bg-obsidian-accent text-white text-sm font-medium rounded-md hover:bg-blue-500 transition-colors"
              >
                Explore Tools
              </button>
              <a
                href="#vault"
                onClick={(e) => { e.preventDefault(); scrollToTool('vault'); }}
                className="px-5 py-2.5 bg-obsidian-panel border border-obsidian-border text-obsidian-text text-sm font-medium rounded-md hover:bg-obsidian-hover transition-colors"
              >
                Open Vault
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Grid */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {categories.map((cat) => (
          <div key={cat.key} className="mb-10">
            <h2 className="text-lg font-semibold mb-4 capitalize">{cat.label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {tools.filter((t) => t.category === cat.key).map((tool) => (
                <ToolCard
                  key={tool.id}
                  id={tool.id}
                  title={tool.title}
                  description={tool.description}
                  icon={iconMap[tool.icon] || Search}
                  active={activeTool === tool.id}
                  onClick={(id) => scrollToTool(id)}
                />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Active Tool Sections */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 space-y-8">
        {tools.map((tool) => (
          <div
            key={tool.id}
            id={`tool-section-${tool.id}`}
            className={`transition-all duration-300 ${activeTool === tool.id ? 'block animate-fade-in' : 'hidden'}`}
          >
            {renderTool(tool.id)}
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
