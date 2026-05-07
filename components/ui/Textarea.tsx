import { cn } from '@/lib/utils';
import { TextareaHTMLAttributes, forwardRef } from 'react';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex w-full rounded-md border border-obsidian-border bg-obsidian-bg px-3 py-2 text-sm text-obsidian-text placeholder:text-obsidian-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obsidian-accent focus-visible:border-obsidian-accent disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px] resize-y',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
export { Textarea };
