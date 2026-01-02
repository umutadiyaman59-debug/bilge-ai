import React from 'react';

interface TurkishFlagProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TurkishFlag: React.FC<TurkishFlagProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: { width: 24, height: 16 },
    md: { width: 32, height: 21 },
    lg: { width: 48, height: 32 },
  };

  const { width, height } = sizes[size];

  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 48 32"
        className="turkish-flag-wave"
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
        }}
      >
        <defs>
          {/* Waving animation gradient */}
          <linearGradient id="flagShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            <animate
              attributeName="x1"
              values="-100%;100%"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="0%;200%"
              dur="3s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Clip path for rounded corners */}
          <clipPath id="flagClip">
            <rect x="0" y="0" width="48" height="32" rx="3" ry="3" />
          </clipPath>
        </defs>

        <g clipPath="url(#flagClip)">
          {/* Red background */}
          <rect x="0" y="0" width="48" height="32" fill="#E30A17" />

          {/* White crescent (ay) */}
          <circle cx="17" cy="16" r="8" fill="white" />
          <circle cx="19" cy="16" r="6.4" fill="#E30A17" />

          {/* White star (yıldız) */}
          <polygon
            points="32,16 28.5,17.5 29.2,21.2 26.5,18.7 23,20 25,16.8 23,13.5 26.5,15 29.2,12.5 28.5,16"
            fill="white"
            transform="rotate(18, 28, 16)"
          />

          {/* Shine overlay for wave effect */}
          <rect x="0" y="0" width="48" height="32" fill="url(#flagShine)" />
        </g>

        {/* Border */}
        <rect
          x="0.5"
          y="0.5"
          width="47"
          height="31"
          rx="2.5"
          ry="2.5"
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
        />
      </svg>

      <style>{`
        .turkish-flag-wave {
          animation: flagWave 4s ease-in-out infinite;
          transform-origin: left center;
        }

        @keyframes flagWave {
          0%, 100% {
            transform: perspective(100px) rotateY(0deg) scaleX(1);
          }
          25% {
            transform: perspective(100px) rotateY(2deg) scaleX(1.02);
          }
          50% {
            transform: perspective(100px) rotateY(0deg) scaleX(1);
          }
          75% {
            transform: perspective(100px) rotateY(-2deg) scaleX(0.98);
          }
        }
      `}</style>
    </div>
  );
};

// Badge component with flag and text
export const TurkishBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TurkishFlag size="sm" />
      <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
        Türkiye'nin ilk yerli yapay zekası
      </span>
    </div>
  );
};
