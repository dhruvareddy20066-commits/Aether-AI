import React from 'react';

interface FloatingRobotAvatarProps {
  state?: 'idle' | 'listening' | 'thinking' | 'speaking';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechWaves?: boolean;
  className?: string;
}

export const FloatingRobotAvatar: React.FC<FloatingRobotAvatarProps> = ({
  state = 'idle',
  size = 'lg',
  showSpeechWaves = false,
  className = '',
}) => {
  // Scale dimensions
  const scaleMap = {
    sm: 'w-36 h-48',
    md: 'w-52 h-68',
    lg: 'w-64 h-84',
    xl: 'w-80 h-96',
  };

  const isListening = state === 'listening';
  const isThinking = state === 'thinking';
  const isSpeaking = state === 'speaking';

  // State-based glow colors
  const primaryGlow = isListening
    ? '#06b6d4' // cyan
    : isThinking
    ? '#8b5cf6' // purple/violet
    : isSpeaking
    ? '#10b981' // emerald
    : '#3b82f6'; // vibrant blue

  const secondaryGlow = isListening
    ? '#38bdf8'
    : isThinking
    ? '#c084fc'
    : isSpeaking
    ? '#34d399'
    : '#60a5fa';

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${scaleMap[size]} ${className}`}>
      {/* Ambient background light aura */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-40 transition-all duration-700 pointer-events-none animate-pulse-glow"
        style={{
          background: `radial-gradient(circle, ${primaryGlow} 0%, ${secondaryGlow} 40%, transparent 70%)`,
        }}
      />

      {/* Floating full-body robot SVG */}
      <div className="relative w-full h-full animate-float z-10 flex items-center justify-center">
        <svg
          viewBox="0 0 320 400"
          className="w-full h-full drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Linear and radial gradients */}
            <linearGradient id="bodyWhiteMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            <linearGradient id="visorGlass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="70%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <linearGradient id="cyberCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <linearGradient id="cyberEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="cyberViolet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>

            <radialGradient id="reactorCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor={primaryGlow} />
              <stop offset="75%" stopColor={secondaryGlow} />
              <stop offset="100%" stopColor="#1e1b4b" />
            </radialGradient>

            {/* Glowing filter */}
            <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ================= ION HOVER GLOW / PROPULSION ================= */}
          <g opacity={isThinking ? '0.9' : '0.75'}>
            <ellipse cx="160" cy="355" rx="38" ry="10" fill={primaryGlow} filter="url(#neonGlow)" />
            <ellipse cx="160" cy="355" rx="20" ry="5" fill="#ffffff" filter="url(#softGlow)" />
            <path
              d="M135 345 L160 375 L185 345 Z"
              fill={`url(#cyber${isSpeaking ? 'Emerald' : isThinking ? 'Violet' : 'Cyan'})`}
              opacity="0.6"
              filter="url(#softGlow)"
            />
          </g>

          {/* ================= ROBOT LEGS / LOWER CHASSIS ================= */}
          <g>
            {/* Pelvis & Lower body joint */}
            <rect x="132" y="275" width="56" height="32" rx="14" fill="#334155" />
            <rect x="136" y="278" width="48" height="26" rx="12" fill="url(#bodyWhiteMetal)" />
            <circle cx="160" cy="291" r="6" fill={primaryGlow} filter="url(#softGlow)" />

            {/* Floating Thruster Base */}
            <path
              d="M142 307 L178 307 L170 340 L150 340 Z"
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth="2"
            />
            <rect x="146" y="338" width="28" height="6" rx="3" fill={primaryGlow} filter="url(#softGlow)" />
          </g>

          {/* ================= ROBOT TORSO & ARMS ================= */}
          <g>
            {/* Left Arm (Observer's left) */}
            <g>
              {/* Shoulder joint */}
              <circle cx="95" cy="185" r="14" fill="#1e293b" />
              <circle cx="95" cy="185" r="11" fill="url(#bodyWhiteMetal)" />
              <circle cx="95" cy="185" r="4" fill={primaryGlow} filter="url(#softGlow)" />

              {/* Upper Arm */}
              <rect
                x="88"
                y="195"
                width="14"
                height="42"
                rx="7"
                fill="url(#bodyWhiteMetal)"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                transform={isListening ? 'rotate(8 95 185)' : 'rotate(-2 95 185)'}
              />

              {/* Elbow & Forearm */}
              <circle cx="95" cy="242" r="7" fill="#334155" />
              <rect
                x="89"
                y="245"
                width="12"
                height="34"
                rx="6"
                fill="url(#bodyWhiteMetal)"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />

              {/* Glowing Wrist band */}
              <rect x="88" y="274" width="14" height="4" rx="2" fill={secondaryGlow} filter="url(#softGlow)" />

              {/* Cyber Hand */}
              <path d="M91 282 C91 280, 99 280, 99 282 L98 295 C98 298, 92 298, 92 295 Z" fill="#475569" />
              <circle cx="95" cy="296" r="2" fill={primaryGlow} />
            </g>

            {/* Right Arm (Observer's right) */}
            <g>
              {/* Shoulder joint */}
              <circle cx="225" cy="185" r="14" fill="#1e293b" />
              <circle cx="225" cy="185" r="11" fill="url(#bodyWhiteMetal)" />
              <circle cx="225" cy="185" r="4" fill={primaryGlow} filter="url(#softGlow)" />

              {/* Upper Arm */}
              <rect
                x="218"
                y="195"
                width="14"
                height="42"
                rx="7"
                fill="url(#bodyWhiteMetal)"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                transform={isListening ? 'rotate(-8 225 185)' : 'rotate(2 225 185)'}
              />

              {/* Elbow & Forearm */}
              <circle cx="225" cy="242" r="7" fill="#334155" />
              <rect
                x="219"
                y="245"
                width="12"
                height="34"
                rx="6"
                fill="url(#bodyWhiteMetal)"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />

              {/* Glowing Wrist band */}
              <rect x="218" y="274" width="14" height="4" rx="2" fill={secondaryGlow} filter="url(#softGlow)" />

              {/* Cyber Hand */}
              <path d="M221 282 C221 280, 229 280, 229 282 L228 295 C228 298, 222 298, 222 295 Z" fill="#475569" />
              <circle cx="225" cy="296" r="2" fill={primaryGlow} />
            </g>

            {/* Main Torso Outer Shell */}
            <path
              d="M106 170 C106 160, 214 160, 214 170 L206 270 C206 276, 114 276, 114 270 Z"
              fill="url(#bodyWhiteMetal)"
              stroke="#cbd5e1"
              strokeWidth="2"
            />

            {/* Chest Armor Accents */}
            <path
              d="M120 178 L200 178 L192 210 L128 210 Z"
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth="1"
            />
            <line x1="160" y1="178" x2="160" y2="210" stroke="#cbd5e1" strokeWidth="1.5" />

            {/* QUANTUM ARC REACTOR / HEART CORE */}
            <g transform="translate(160, 235)">
              {/* Outer ring */}
              <circle cx="0" cy="0" r="25" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
              {/* Pulsing glow ring */}
              <circle
                cx="0"
                cy="0"
                r="20"
                fill={`url(#reactorCore)`}
                filter="url(#neonGlow)"
                className={isListening || isThinking ? 'animate-pulse' : ''}
              />
              {/* Internal geometric cross / aperture */}
              <circle cx="0" cy="0" r="10" fill="#ffffff" opacity="0.9" filter="url(#softGlow)" />
              <path
                d="M-15 0 L15 0 M0 -15 L0 15"
                stroke="#ffffff"
                strokeWidth="2"
                opacity={isListening ? '1' : '0.7'}
              />
              {/* Status indicator ring dots */}
              <circle cx="-16" cy="-10" r="1.5" fill={primaryGlow} />
              <circle cx="16" cy="-10" r="1.5" fill={primaryGlow} />
              <circle cx="0" cy="18" r="1.5" fill={secondaryGlow} />
            </g>

            {/* Side torso cyber vents with light strips */}
            <rect x="115" y="222" width="4" height="24" rx="2" fill={primaryGlow} filter="url(#softGlow)" />
            <rect x="201" y="222" width="4" height="24" rx="2" fill={primaryGlow} filter="url(#softGlow)" />
          </g>

          {/* ================= ROBOT NECK & COLLAR ================= */}
          <g>
            <rect x="144" y="148" width="32" height="18" rx="6" fill="#1e293b" />
            <ellipse cx="160" cy="154" rx="18" ry="4" fill={primaryGlow} filter="url(#softGlow)" />
          </g>

          {/* ================= ROBOT HEAD ================= */}
          <g>
            {/* Ear Antennas with Pulsing LED Beacons */}
            {/* Left Ear */}
            <g>
              <rect x="90" y="96" width="12" height="30" rx="6" fill="#334155" />
              <line x1="96" y1="96" x2="96" y2="72" stroke="#64748b" strokeWidth="3" />
              <circle
                cx="96"
                cy="70"
                r="7"
                fill={primaryGlow}
                filter="url(#neonGlow)"
                className={isListening ? 'animate-ping' : ''}
              />
              <circle cx="96" cy="70" r="4" fill="#ffffff" />
            </g>

            {/* Right Ear */}
            <g>
              <rect x="218" y="96" width="12" height="30" rx="6" fill="#334155" />
              <line x1="224" y1="96" x2="224" y2="72" stroke="#64748b" strokeWidth="3" />
              <circle
                cx="224"
                cy="70"
                r="7"
                fill={primaryGlow}
                filter="url(#neonGlow)"
                className={isListening ? 'animate-ping' : ''}
              />
              <circle cx="224" cy="70" r="4" fill="#ffffff" />
            </g>

            {/* Head Dome & Shell */}
            <rect
              x="100"
              y="68"
              width="120"
              height="86"
              rx="40"
              fill="url(#bodyWhiteMetal)"
              stroke="#e2e8f0"
              strokeWidth="2"
            />

            {/* Top Head Fin/Sensor */}
            <path
              d="M150 68 C150 60, 170 60, 170 68 Z"
              fill={secondaryGlow}
              filter="url(#softGlow)"
            />

            {/* VISOR (Deep Obsidian Glass) */}
            <rect
              x="110"
              y="82"
              width="100"
              height="58"
              rx="24"
              fill="url(#visorGlass)"
              stroke="#475569"
              strokeWidth="2"
            />

            {/* Glass reflection highlight */}
            <path
              d="M116 92 C125 86, 155 86, 175 88"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.35"
            />

            {/* EYES (Luminous, Animated & Blinking) */}
            <g className="animate-blink">
              {/* Left Eye */}
              <ellipse
                cx="138"
                cy="104"
                rx={isListening ? 12 : 10}
                ry={isListening ? 13 : 9}
                fill={primaryGlow}
                filter="url(#neonGlow)"
              />
              <ellipse cx="138" cy="104" rx="4" ry="4" fill="#ffffff" />
              {/* Iris shimmer */}
              <circle cx="136" cy="101" r="1.5" fill="#ffffff" />

              {/* Right Eye */}
              <ellipse
                cx="182"
                cy="104"
                rx={isListening ? 12 : 10}
                ry={isListening ? 13 : 9}
                fill={primaryGlow}
                filter="url(#neonGlow)"
              />
              <ellipse cx="182" cy="104" rx="4" ry="4" fill="#ffffff" />
              {/* Iris shimmer */}
              <circle cx="180" cy="101" r="1.5" fill="#ffffff" />
            </g>

            {/* MOUTH / SPEECH EQUALIZER VISUALIZER */}
            {isSpeaking ? (
              <g transform="translate(160, 128)" filter="url(#softGlow)">
                <rect x="-24" y="-4" width="4" height="8" rx="2" fill="#ffffff" className="animate-pulse" />
                <rect x="-16" y="-7" width="4" height="14" rx="2" fill={secondaryGlow} />
                <rect x="-8" y="-10" width="4" height="20" rx="2" fill="#ffffff" />
                <rect x="0" y="-12" width="4" height="24" rx="2" fill={primaryGlow} />
                <rect x="8" y="-10" width="4" height="20" rx="2" fill="#ffffff" />
                <rect x="16" y="-7" width="4" height="14" rx="2" fill={secondaryGlow} />
                <rect x="24" y="-4" width="4" height="8" rx="2" fill="#ffffff" className="animate-pulse" />
              </g>
            ) : isListening ? (
              <g transform="translate(160, 128)" filter="url(#softGlow)">
                {/* Listening wave pulse */}
                <ellipse cx="0" cy="0" rx="14" ry="3" fill="none" stroke={primaryGlow} strokeWidth="2" />
                <circle cx="0" cy="0" r="2" fill="#ffffff" />
              </g>
            ) : (
              // Friendly subtle smile curve
              <path
                d="M148 126 Q160 134 172 126"
                stroke={primaryGlow}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                filter="url(#softGlow)"
              />
            )}
          </g>
        </svg>
      </div>

      {/* Dynamic Sound Wave & State Indicator Banner below robot */}
      {showSpeechWaves && (
        <div className="mt-2 flex flex-col items-center">
          <div className="flex items-center gap-1.5 h-8 px-4 py-1.5 rounded-full glass-panel-accent border border-white/80 shadow-md">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: primaryGlow,
                boxShadow: `0 0 10px ${primaryGlow}`,
              }}
            />
            <span className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
              {isListening
                ? 'Listening to you...'
                : isThinking
                ? 'Analyzing with AI...'
                : isSpeaking
                ? 'Speaking...'
                : 'AetherBot Online'}
            </span>

            {/* Realtime bouncing wave bars */}
            {(isListening || isSpeaking) && (
              <div className="flex items-center gap-1 ml-2">
                {[4, 12, 18, 10, 22, 14, 6].map((height, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full transition-all duration-150 animate-pulse"
                    style={{
                      height: `${height}px`,
                      backgroundColor: primaryGlow,
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
