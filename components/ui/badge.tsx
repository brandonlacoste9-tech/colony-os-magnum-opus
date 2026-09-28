import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline';
}

export function Badge({ variant = 'default', className = '', ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-[var(--amber)] text-[var(--void)]',
    secondary: 'bg-white/10 text-[var(--text-primary)]',
    outline: 'border border-white/20 text-[var(--text-primary)]',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
