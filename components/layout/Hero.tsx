'use client';

import { Youtube, Zap, Shield, BarChart3 } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-accent/10 text-obsidian-accent text-sm mb-6">
          <Zap className="h-4 w-4" />
          <span>20+ Powerful Tools</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-obsidian-text mb-6 tracking-tight">
          YouTube Intelligence{' '}
          <span className="text-obsidian-accent">Suite</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-obsidian-muted max-w-2xl mx-auto mb-10">
          Advanced toolkit for creators, marketers, and researchers. 
          Search, analyze, download, and compare YouTube content with powerful precision.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onGetStarted}
            className="px-8 py-3 bg-obsidian-accent text-white font-medium rounded-button hover:bg-blue-600 transition-colors"
          >
            Get Started
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-2 p-4 bg-obsidian-card border border-obsidian-border rounded-card">
            <BarChart3 className="h-6 w-6 text-obsidian-accent" />
            <h3 className="font-medium text-obsidian-text">Deep Analytics</h3>
            <p className="text-sm text-obsidian-muted">Stats, comparisons & trends</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-obsidian-card border border-obsidian-border rounded-card">
            <Youtube className="h-6 w-6 text-obsidian-success" />
            <h3 className="font-medium text-obsidian-text">Content Tools</h3>
            <p className="text-sm text-obsidian-muted">MP3, MP4, subtitles & more</p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-obsidian-card border border-obsidian-border rounded-card">
            <Shield className="h-6 w-6 text-obsidian-warning" />
            <h3 className="font-medium text-obsidian-text">Vault & History</h3>
            <p className="text-sm text-obsidian-muted">Save and track everything</p>
          </div>
        </div>
      </div>
    </section>
  );
}
