import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title = 'No results', description, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-10 text-center', className)}>
      {Icon && <Icon className="w-8 h-8 text-obsidian-muted mb-3" />}
      <p className="text-sm font-medium text-obsidian-muted">{title}</p>
      {description && <p className="text-xs text-obsidian-muted mt-1">{description}</p>}
    </div>
  );
}
