interface FlagProps {
  className?: string;
}

export function FlagGB({ className = "w-8 h-6" }: FlagProps) {
  return (
    <svg
      viewBox="0 0 60 30"
      className={className}
      aria-hidden="true"
    >
      <clipPath id="gb-clip">
        <rect width="60" height="30" />
      </clipPath>
      <g clipPath="url(#gb-clip)">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#gb-diag)" />
        <clipPath id="gb-diag">
          <path d="M30,15 L60,30 L60,15 L30,15 L60,0 L30,0 L30,15 L0,0 L0,15 L30,15 L0,30 L30,30 Z" />
        </clipPath>
        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

export function FlagFR({ className = "w-8 h-6" }: FlagProps) {
  return (
    <svg
      viewBox="0 0 3 2"
      className={className}
      aria-hidden="true"
    >
      <rect width="1" height="2" fill="#002395" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#ED2939" />
    </svg>
  );
}
