import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  inverted?: boolean;
  href?: string;
}

export function LogoIcon({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      <defs>
        <linearGradient id="bc-gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="50%" stopColor="#047857" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
        <linearGradient id="bc-gradient-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="bc-gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="bc-shadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#064e3b" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Rounded Hexagonal / Shield Container */}
      <rect width="48" height="48" rx="13" fill="url(#bc-gradient-primary)" />
      
      {/* Subtle background tech grid pattern */}
      <circle cx="24" cy="24" r="18" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Stylized Modern Bank Pillars + Comparison Growth Bars */}
      {/* Left Pillar (Stable Foundation) */}
      <rect x="11" y="22" width="5.5" height="15" rx="2.5" fill="rgba(255,255,255,0.85)" />
      
      {/* Middle Pillar (Growth & Rate comparison) */}
      <rect x="21" y="16" width="5.5" height="21" rx="2.5" fill="#FFFFFF" filter="url(#bc-shadow)" />
      
      {/* Right Pillar (Maximum return / Target peak) */}
      <rect x="31" y="11" width="5.5" height="26" rx="2.5" fill="url(#bc-gradient-gold)" />

      {/* Dynamic Rising Comparison Arch / Arrow across tops */}
      <path
        d="M 12 18 Q 23 9 36 8"
        stroke="url(#bc-gradient-gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Accent beacon */}
      <circle cx="36" cy="8" r="2.5" fill="#FEF08A" />
      
      {/* Bangladesh subtle crimson touch point */}
      <circle cx="14" cy="12" r="2" fill="#F43F5E" />
    </svg>
  );
}

export function Logo({
  className = "",
  size = "md",
  showText = true,
  inverted = false,
  href = "/",
}: LogoProps) {
  const iconSize = size === "sm" ? 30 : size === "lg" ? 44 : 36;
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-[18px]";

  const content = (
    <div className={`group inline-flex items-center gap-2.5 select-none ${className}`}>
      <LogoIcon size={iconSize} />
      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-black tracking-tight flex items-center gap-1 ${textSize}`}>
            <span className={inverted ? "text-white" : "text-slate-900 dark:text-white"}>
              Bank<span className="text-emerald-600 dark:text-emerald-400">Compare</span>
            </span>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 tracking-wider">
              BD
            </span>
          </div>
          <span className={`text-[10.5px] font-semibold tracking-wider uppercase mt-1 ${inverted ? "text-slate-400" : "text-slate-400 dark:text-slate-500"}`}>
            Financial Intelligence
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="focus:outline-none" aria-label="BankCompare BD Home">
        {content}
      </Link>
    );
  }

  return content;
}
