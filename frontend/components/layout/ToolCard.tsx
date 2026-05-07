'use client';

import { cn } from '@/lib/utils';

interface ToolCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  active?: boolean;
  onClick?: (id: string) => void;
}

export default function ToolCard({ id, title, description, icon: Icon, active, onClick }: ToolCardProps) {
  return (
    <button
      onClick={() => onClick?.(id)}
      className={cn(
        'w-full text-left rounded-lg border p-4 transition-all hover:shadow-md group',
        active
          ? 'border-obsidian-accent bg-obsidian-hover ring-1 ring-obsidian-accent'
          : 'border-obsidian-border bg-obsidian-panel hover:border-obsidian-accent/50 hover:bg-obsidian-hover'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'p-2 rounded-md shrink-0',
          active ? 'bg-obsidian-accent/20 text-obsidian-accent' : 'bg-obsidian-bg text-obsidian-muted group-hover:text-obsidian-accent'
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className={cn('text-sm font-medium', active ? 'text-obsidian-accent' : 'text-obsidian-text')}>{title}</h3>
          <p className="text-xs text-obsidian-muted mt-0.5 line-clamp-2">{description}</p>
        </div>
      </div>
    </button>
  );
}
