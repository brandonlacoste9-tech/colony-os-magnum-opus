import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
}

export function Button({ variant = 'default', className = '', ...props }: ButtonProps) {
  const variants: Record<string, string> = {
    default: 'bg-[var(--amber)] text-[var(--void)] hover:brightness-110',
    secondary: 'bg-white/10 text-[var(--text-primary)] hover:bg-white/20',
    outline: 'border border-white/20 text-[var(--text-primary)] hover:bg-white/10',
    ghost: 'text-[var(--text-primary)] hover:bg-white/10',
  };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
