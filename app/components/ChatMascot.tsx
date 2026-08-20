export default function ChatMascot({ size = 40, className = '' }: Readonly<{ size?: number; className?: string }>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`gx-mascot ${className}`.trim()}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gxMascotBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--gx-blue-400)" />
          <stop offset="100%" stopColor="var(--gx-violet-500)" />
        </linearGradient>
      </defs>

      {/* Pie / sombra de contacto */}
      <ellipse cx="50" cy="88" rx="19" ry="4" fill="currentColor" opacity="0.12" />

      {/* Patitas */}
      <rect x="34" y="78" width="10" height="12" rx="5" fill="url(#gxMascotBody)" />
      <rect x="56" y="78" width="10" height="12" rx="5" fill="url(#gxMascotBody)" />

      {/* Brazo que saluda, con una mini mancuerna */}
      <g className="gx-mascot-arm">
        <rect x="70" y="40" width="9" height="24" rx="4.5" fill="url(#gxMascotBody)" />
        <g transform="translate(74, 34)">
          <rect x="-11" y="-3.5" width="22" height="7" rx="3.5" fill="url(#gxMascotBody)" />
          <circle cx="-10" cy="0" r="6" fill="var(--gx-amber-400)" />
          <circle cx="10" cy="0" r="6" fill="var(--gx-amber-400)" />
        </g>
      </g>

      {/* Cuerpo */}
      <circle cx="48" cy="52" r="32" fill="url(#gxMascotBody)" />
      <ellipse cx="37" cy="40" rx="10" ry="7" fill="#ffffff" opacity="0.18" />

      {/* Ojos */}
      <g className="gx-mascot-eye" style={{ transformOrigin: '36px 48px' }}>
        <circle cx="36" cy="48" r="7" fill="#ffffff" />
        <circle cx="37.5" cy="49" r="3.4" fill="#132338" />
      </g>
      <g className="gx-mascot-eye" style={{ transformOrigin: '60px 48px' }}>
        <circle cx="60" cy="48" r="7" fill="#ffffff" />
        <circle cx="61.5" cy="49" r="3.4" fill="#132338" />
      </g>

      {/* Sonrisa */}
      <path d="M38 63 Q48 71 58 63" stroke="#132338" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity="0.85" />

      {/* Cachetes */}
      <circle cx="27" cy="58" r="4" fill="var(--gx-amber-400)" opacity="0.55" />
      <circle cx="69" cy="58" r="4" fill="var(--gx-amber-400)" opacity="0.55" />
    </svg>
  );
}
