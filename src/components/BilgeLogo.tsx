import React from 'react';
import { cn } from '@/lib/utils';

interface BilgeLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-lg',
  lg: 'w-16 h-16 text-2xl',
  xl: 'w-24 h-24 text-4xl',
};

export const BilgeLogo: React.FC<BilgeLogoProps> = ({
  size = 'md',
  animated = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white flex items-center justify-center font-bold shadow-lg',
        sizeClasses[size],
        animated && 'animate-pulse-slow',
        className
      )}
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />

      {/* Inner border */}
      <div className="absolute inset-[2px] rounded-[14px] bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
        <span className="relative z-10 font-bold tracking-tight">B</span>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent" />
    </div>
  );
};

export const BilgeLogoFull: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <BilgeLogo size="md" />
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight">Bilge</span>
        <span className="text-xs text-muted-foreground">Yapay Zeka Asistanı</span>
      </div>
    </div>
  );
};
