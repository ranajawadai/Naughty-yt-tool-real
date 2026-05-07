import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex w-full rounded-md border border-obsidian-border bg-obsidian-bg px-3 py-2 text-sm text-obsidian-text placeholder:text-obsidian-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obsidian-accent focus-visible:border-obsidian-accent disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
export { Input };
