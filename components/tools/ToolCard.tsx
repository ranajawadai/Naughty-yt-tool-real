'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export default function ToolCard({ title, description, children, onClose, className }: ToolCardProps) {
  return (
    <div className={cn('bg-obsidian-card border border-obsidian-border rounded-card overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-obsidian-border bg-obsidian-bg/50">
        <div>
          <h3 className="font-semibold text-obsidian-text">{title}</h3>
          {description && <p className="text-xs text-obsidian-muted mt-0.5">{description}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-obsidian-muted hover:text-obsidian-text hover:bg-obsidian-border rounded-button transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
