'use client';

import { cn } from '@/lib/utils';

interface ToolSectionProps {
  children: React.ReactNode;
  className?: string;
  visible: boolean;
}

export default function ToolSection({ children, className, visible }: ToolSectionProps) {
  if (!visible) return null;

  return (
    <section className={cn('py-8 animate-in fade-in slide-in-from-bottom-4 duration-300', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
