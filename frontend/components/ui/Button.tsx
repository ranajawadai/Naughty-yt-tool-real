import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-obsidian-accent text-white hover:bg-blue-500',
      secondary: 'bg-obsidian-panel border border-obsidian-border text-obsidian-text hover:bg-obsidian-hover',
      danger: 'bg-obsidian-danger text-white hover:bg-red-600',
      ghost: 'bg-transparent text-obsidian-muted hover:text-obsidian-text hover:bg-obsidian-hover',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obsidian-accent disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
export { Button };
