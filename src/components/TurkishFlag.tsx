import React from 'react';
import { cn } from '@/lib/utils';

interface TurkishFlagProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const TurkishFlag: React.FC<TurkishFlagProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizes = {
    xs: { width: 16, height: 10 },
    sm: { width: 20, height: 13 },
    md: { width: 28, height: 18 },
    lg: { width: 36, height: 24 },
    xl: { width: 48, height: 32 },
  };

  const { width, height } = sizes[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 32"
      className={cn('flex-shrink-0', className)}
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
    >
      <defs>
        <clipPath id="flagClipClean">
          <rect x="0" y="0" width="48" height="32" rx="2" ry="2" />
        </clipPath>
      </defs>

      <g clipPath="url(#flagClipClean)">
        {/* Red background */}
        <rect x="0" y="0" width="48" height="32" fill="#E30A17" />

        {/* White crescent */}
        <circle cx="17" cy="16" r="8" fill="white" />
        <circle cx="19" cy="16" r="6.4" fill="#E30A17" />

        {/* White star */}
        <polygon
          points="32,16 28.5,17.5 29.2,21.2 26.5,18.7 23,20 25,16.8 23,13.5 26.5,15 29.2,12.5 28.5,16"
          fill="white"
          transform="rotate(18, 28, 16)"
        />
      </g>

      {/* Subtle border */}
      <rect
        x="0.5"
        y="0.5"
        width="47"
        height="31"
        rx="1.5"
        ry="1.5"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
      />
    </svg>
  );
};

// Professional corner badge - minimal and elegant
export const WavingFlagBadge: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position = 'bottom-right', className }) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-20 left-4',
    'bottom-right': 'bottom-20 right-4',
  };

  return (
    <div
      className={cn(
        'fixed z-40 hidden md:flex',
        positionClasses[position],
        className
      )}
    >
      <div className={cn(
        'flex items-center gap-2.5 px-3.5 py-2',
        'bg-white/90 dark:bg-zinc-900/90',
        'backdrop-blur-sm',
        'border border-zinc-200/60 dark:border-zinc-700/60',
        'rounded-lg',
        'shadow-sm',
        'transition-all duration-300',
        'hover:shadow-md hover:border-red-200 dark:hover:border-red-900/50',
        'group cursor-default'
      )}>
        {/* Flag with subtle wave animation */}
        <div className="relative overflow-hidden">
          <div className="flag-wave-subtle">
            <TurkishFlag size="md" />
          </div>
        </div>

        {/* Text */}
        <span className={cn(
          'text-[11px] font-medium tracking-wide',
          'text-zinc-600 dark:text-zinc-400',
          'group-hover:text-zinc-800 dark:group-hover:text-zinc-200',
          'transition-colors duration-300',
          'whitespace-nowrap select-none'
        )}>
          Türkiye'nin İlk Yerli Yapay Zekası
        </span>

        <style>{`
          .flag-wave-subtle {
            animation: subtleWave 4s ease-in-out infinite;
            transform-origin: left center;
          }

          @keyframes subtleWave {
            0%, 100% {
              transform: perspective(100px) rotateY(0deg);
            }
            50% {
              transform: perspective(100px) rotateY(3deg);
            }
          }

          .group:hover .flag-wave-subtle {
            animation-duration: 2s;
          }
        `}</style>
      </div>
    </div>
  );
};

// Even more minimal - just text with tiny flag
export const MinimalFlagBadge: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn(
      'fixed bottom-20 right-4 z-40 hidden md:flex',
      className
    )}>
      <div className={cn(
        'flex items-center gap-2 px-3 py-1.5',
        'text-[10px] font-medium tracking-wide',
        'text-zinc-500 dark:text-zinc-500',
        'bg-zinc-100/80 dark:bg-zinc-800/80',
        'backdrop-blur-sm',
        'rounded-full',
        'border border-zinc-200/50 dark:border-zinc-700/50',
        'hover:text-zinc-700 dark:hover:text-zinc-300',
        'hover:border-zinc-300 dark:hover:border-zinc-600',
        'transition-all duration-200',
        'cursor-default select-none'
      )}>
        <TurkishFlag size="sm" />
        <span>Türkiye'nin İlk Yerli Yapay Zekası</span>
      </div>
    </div>
  );
};

// Legacy exports for compatibility
export const TurkishBadge = MinimalFlagBadge;
export const CompactFlagBadge = MinimalFlagBadge;
