import * as React from 'react';

export function Avatar({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/10 ${className}`}
      {...props}
    />
  );
}

export function AvatarImage({ src, alt = '', className = '' }: { src?: string; alt?: string; className?: string }) {
  if (!src) return null;
  return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} />;
}

export function AvatarFallback({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-[var(--amber)]/20 text-sm font-semibold text-[var(--amber)] ${className}`}
      {...props}
    />
  );
}
