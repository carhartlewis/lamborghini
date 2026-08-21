// Abstract low-poly Lamborghini side profile with the digital billboard panel.
export function Lambo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 220"
      role="img"
      aria-label="Side profile of a Lamborghini with a digital billboard panel reading YOUR LOGO"
      className={className}
    >
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.30 0.005 285)" />
          <stop offset="1" stopColor="oklch(0.18 0.005 285)" />
        </linearGradient>
        <linearGradient id="screen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="oklch(0.80 0.16 89)" />
          <stop offset="0.5" stopColor="oklch(0.88 0.175 89)" />
          <stop offset="1" stopColor="oklch(0.80 0.16 89)" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="oklch(0.86 0.171 89 / 35%)" />
          <stop offset="1" stopColor="oklch(0.86 0.171 89 / 0%)" />
        </radialGradient>
      </defs>

      {/* billboard glow */}
      <ellipse cx="320" cy="130" rx="200" ry="80" fill="url(#glow)" />

      {/* speed lines */}
      <g stroke="oklch(1 0 0 / 12%)" strokeWidth="2">
        <line x1="8" y1="96" x2="96" y2="96" />
        <line x1="0" y1="120" x2="72" y2="120" />
        <line x1="20" y1="144" x2="84" y2="144" />
      </g>

      {/* body wedge */}
      <path
        d="M118 176 L96 172 L84 158 L92 142 L128 128 L196 108 L246 84 L268 74 L340 70 L368 72 L430 84 L472 92 L544 104 L560 112 L566 132 L560 158 L544 170 L520 176 Z"
        fill="url(#body)"
        stroke="oklch(1 0 0 / 14%)"
        strokeWidth="1.5"
      />
      {/* canopy */}
      <path
        d="M272 78 L338 74 L362 76 L398 82 L352 96 L296 98 Z"
        fill="oklch(0.12 0.004 285)"
        stroke="oklch(1 0 0 / 10%)"
        strokeWidth="1"
      />
      {/* rear wing */}
      <path
        d="M520 92 L586 84 L594 92 L536 102 Z"
        fill="oklch(0.24 0.005 285)"
        stroke="oklch(1 0 0 / 12%)"
        strokeWidth="1"
      />
      {/* front wheel */}
      <circle cx="180" cy="168" r="34" fill="oklch(0.10 0 0)" />
      <circle
        cx="180"
        cy="168"
        r="20"
        fill="none"
        stroke="oklch(0.86 0.171 89 / 70%)"
        strokeWidth="3"
        strokeDasharray="9 7"
      />
      {/* rear wheel */}
      <circle cx="484" cy="168" r="34" fill="oklch(0.10 0 0)" />
      <circle
        cx="484"
        cy="168"
        r="20"
        fill="none"
        stroke="oklch(0.86 0.171 89 / 70%)"
        strokeWidth="3"
        strokeDasharray="9 7"
      />

      {/* the digital billboard */}
      <g>
        <rect
          x="252"
          y="104"
          width="176"
          height="52"
          rx="6"
          fill="oklch(0.10 0 0)"
          stroke="url(#screen)"
          strokeWidth="2.5"
        />
        <text
          x="340"
          y="137"
          textAnchor="middle"
          fill="url(#screen)"
          fontFamily="var(--font-heading)"
          fontWeight="800"
          fontSize="27"
          letterSpacing="3"
        >
          YOUR LOGO
        </text>
      </g>

      {/* ground line */}
      <line
        x1="60"
        y1="204"
        x2="600"
        y2="204"
        stroke="oklch(1 0 0 / 10%)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
